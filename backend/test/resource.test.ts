import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import ResourceController from '../src/controllers/resource.controller';
import { AppDataSource } from '../src/config/data-source';
import { AppError } from '../src/config/exception';
import { config } from '../src/config/config';

// Mock AppDataSource trước — khai báo trong closure để tránh lỗi ReferenceError
jest.mock('../src/config/data-source', () => {
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn()
  };
  return {
    AppDataSource: {
      getRepository: jest.fn(() => mockRepo)
    }
  };
});

// Mock sharp
jest.mock('sharp', () =>
  jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(true)
  }))
);

// Mock config
jest.mock('../src/config/config', () => ({
  config: { domain: 'http://localhost:3000' }
}));

// Mock fs
jest.spyOn(fs, 'existsSync').mockReturnValue(true);
jest.spyOn(fs, 'mkdirSync').mockImplementation((_p?: any, _o?: any) => undefined);

describe('ResourceController.uploadImage', () => {
  let app: Express;
  let mockRepo: any;

  beforeAll(() => {
    app = express();

    // Lấy mockRepo sau khi AppDataSource đã được mock
    mockRepo = (AppDataSource.getRepository as jest.Mock)();

    // Route upload
    app.post('/api/upload', (req: Request, res: Response, next: NextFunction) => {
      req.file = {
        buffer: Buffer.from('fake image content'),
        originalname: 'test.jpg'
      } as any;
      ResourceController.uploadImage(req, res, next);
    });

    // Middleware lỗi
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        const status = err.getStatusCode ? err.getStatusCode() : 400;
        return res.status(status).json({ message: err.message });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Upload ảnh thành công
  it('Upload ảnh thành công', async () => {
    mockRepo.create.mockReturnValue({
      id: '123',
      url: 'http://localhost:3000/uploads/123.jpg'
    });
    mockRepo.save.mockResolvedValue({
      id: '123',
      url: 'http://localhost:3000/uploads/123.jpg'
    });

    const response = await request(app).post('/api/upload');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('upload image successfully');
    expect(response.body.data.url).toContain('http://localhost:3000/uploads/');
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
  });

  // Không có file upload
  it('Trả lỗi khi không có file upload', async () => {
    const appNoFile = express();
    appNoFile.post('/api/upload', (req, res, next) => ResourceController.uploadImage(req, res, next));
    appNoFile.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        const status = err.getStatusCode ? err.getStatusCode() : 400;
        return res.status(status).json({ message: err.message });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    });

    const response = await request(appNoFile).post('/api/upload');
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/no file upload/i);
  });
});
