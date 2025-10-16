/**
 * @jest-environment node
 */

import { Request, Response, NextFunction } from 'express';

// ---------------- MOCK MODULES ----------------

// fs
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn()
}));

// sharp
jest.mock('sharp', () => {
  return jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(true)
  }));
});

// AppDataSource + Repository
jest.mock('../src/config/data-source', () => {
  const mockCreate = jest.fn();
  const mockSave = jest.fn();
  const mockFind = jest.fn();

  const mockRepo = {
    create: mockCreate,
    save: mockSave,
    find: mockFind
  };

  const mockQB = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(true)
  };

  return {
    AppDataSource: {
      // nhận 1 argument để TS không báo lỗi
      getRepository: jest.fn((target: any) => mockRepo),
      createQueryBuilder: jest.fn(() => mockQB)
    }
  };
});

// Upload model
jest.mock('../src/models/Upload.model', () => ({
  Upload: jest.fn()
}));

// config
jest.mock('../src/config/config', () => ({
  config: { url_upload: 'http://localhost:3000' }
}));

// ---------------- IMPORTS AFTER MOCK ----------------
import uploadController from '../src/controllers/upload.controller';
import sharp from 'sharp';
import fs from 'fs';
import { AppDataSource } from '../src/config/data-source';
import { AppError } from '../src/config/exception';
import { ErrorMap } from '../src/config/ErrorMap';
import { Upload } from '../src/models/Upload.model';

// ---------------- HELPERS ----------------
const createMockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

// ---------------- TEST SUITE ----------------
describe('UploadController', () => {
  let mockRepo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo = AppDataSource.getRepository(Upload) as unknown as {
      create: jest.Mock;
      save: jest.Mock;
      find: jest.Mock;
    };
  });

  describe('uploadImage', () => {
    it('Upload thành công', async () => {
      const mockReq = {
        file: { buffer: Buffer.from('fake') }
      } as unknown as Request & { file: Express.Multer.File };
      const res = createMockResponse();

      mockRepo.create.mockReturnValue({ id: '1', url: 'http://localhost:3000/uploads/test.jpg' });
      mockRepo.save.mockResolvedValue(true);
      mockRepo.find.mockResolvedValue([{ id: '1', url: 'http://localhost:3000/uploads/test.jpg' }]);

      await uploadController.uploadImage(mockReq, res, mockNext);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(sharp).toHaveBeenCalledWith(mockReq.file.buffer);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'upload image successfully',
          url: expect.stringMatching(/\/uploads\/.*\.jpg$/)
        })
      );
    });

    it('Gọi next với NO_FILE_UPLOAD nếu không có file', async () => {
      const mockReq = {} as Request;
      const res = createMockResponse();

      await uploadController.uploadImage(mockReq, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.NO_FILE_UPLOAD));
    });

    it('Gọi next khi Sharp lỗi', async () => {
      const mockReq = {
        file: { buffer: Buffer.from('fake') }
      } as unknown as Request & { file: Express.Multer.File };
      const res = createMockResponse();

      (sharp as unknown as jest.Mock).mockImplementationOnce(() => ({
        resize: jest.fn().mockReturnThis(),
        jpeg: jest.fn().mockReturnThis(),
        toFile: jest.fn().mockRejectedValue(new Error('Sharp failed'))
      }));

      await uploadController.uploadImage(mockReq, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Sharp failed'));
    });

    it('Gọi next khi DB save lỗi', async () => {
      const mockReq = {
        file: { buffer: Buffer.from('fake') }
      } as unknown as Request & { file: Express.Multer.File };
      const res = createMockResponse();

      mockRepo.create.mockReturnValue({ id: '1', url: 'http://localhost:3000/uploads/test.jpg' });
      mockRepo.save.mockRejectedValue(new Error('DB fail'));

      await uploadController.uploadImage(mockReq, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('DB fail'));
    });

    it('Cập nhật domain khi URL khác với url_upload', async () => {
      const mockReq = {
        file: { buffer: Buffer.from('fake') }
      } as unknown as Request & { file: Express.Multer.File };
      const res = createMockResponse();

      mockRepo.create.mockReturnValue({ id: '1', url: 'http://old-domain.com/uploads/test.jpg' });
      mockRepo.save.mockResolvedValue(true);
      mockRepo.find.mockResolvedValue([{ id: '1', url: 'http://old-domain.com/uploads/test.jpg' }]);

      await uploadController.uploadImage(mockReq, res, mockNext);

      expect(AppDataSource.createQueryBuilder).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'upload image successfully'
        })
      );
    });
  });
});
