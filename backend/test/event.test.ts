import request from 'supertest';
import express, { Express } from 'express';
import { AppDataSource } from '../src/config/data-source';
import EventController from '../src/controllers/event.controller';
import { AppError } from '../src/config/exception';
import { ErrorMap } from '../src/config/ErrorMap';

// Mock database để không cần kết nối thật
jest.mock('../src/config/data-source', () => ({
  AppDataSource: {
    transaction: jest.fn(),
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    }),
  },
}));

describe('EventController', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/api/events', (req, res, next) => EventController.createEvent(req, res, next));
  });

  it('tạo event thành công', async () => {
    (AppDataSource.transaction as jest.Mock).mockImplementation(async (callback) => {
      return { eventId: 1, title: 'Test Event' };
    });

    const response = await request(app)
      .post('/api/events')
      .set('Authorization', 'Bearer testtoken')
      .send({
        event: {
          title: 'Test Event',
          eventInfo: 'Mô tả sự kiện',
          eventImage: 'image.jpg',
          startTime: new Date(),
          endTime: new Date(),
          category: 'Music',
        },
        venue: {
          province: 'Hà Nội',
          district: 'Cầu Giấy',
          ward: 'Dịch Vọng',
          street: 'Phạm Văn Bạch',
        },
        organizer: {
          organizerName: 'Test Organizer',
          organizerInfo: 'Thông tin nhà tổ chức',
        },
        ticketTypes: [],
        setting: {
          messageToReceiver: 'Cảm ơn bạn đã tham gia!',
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Test Event');
  });

  it('trả lỗi khi user không tồn tại', async () => {
    (AppDataSource.transaction as jest.Mock).mockImplementation(async () => {
      throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
    });

    const response = await request(app).post('/api/events').send({});
    expect(response.status).toBe(404);
  });
});
