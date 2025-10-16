import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';

const mockRepo = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
};

jest.mock('../src/config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => mockRepo),
  },
}));

jest.mock('../src/middlewares/auth.middleware', () => ({
  auth: (req: Request, res: Response, next: NextFunction) => {
    res.locals.requester = { id: 1 }; // gắn user ảo
    next();
  },
}));

jest.mock('../src/middlewares/validate.middleware', () => ({
  validate: () => (req: Request, res: Response, next: NextFunction) => next(),
}));

import userRouter from '../src/routes/user.route';
import { AppError } from '../src/config/exception';
import { AppDataSource } from '../src/config/data-source';

describe('User Routes', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRouter);

    // Middleware xử lý lỗi toàn cục
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        const status = (err as any).getStatusCode?.() || (err as any).statusCode || 400;
        return res.status(status).json({ message: err.message });
      }
      console.error('Unexpected error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // reset mockRepo và đảm bảo mỗi lần getRepository đều trả về mockRepo
    mockRepo.findOne.mockReset();
    mockRepo.findOneBy.mockReset();
    mockRepo.save.mockReset();

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  // TEST 1: GET /:id
  it('Trả thông tin user theo id thành công', async () => {
    mockRepo.findOneBy.mockResolvedValue({
      id: 1,
      userName: 'Thế',
      email: 'the@example.com',
      passwordHash: '1234',
    });

    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body.data.userName).toBe('Thế');
    expect(response.body.data.passwordHash).toBeUndefined();
  });

  it('Trả lỗi khi user không tồn tại (getUserById)', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);

    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
  });

  // TEST 2: GET /my-info
  it('Lấy thông tin người dùng đăng nhập thành công', async () => {
    mockRepo.findOne.mockResolvedValue({
      id: 1,
      userName: 'Thế',
      email: 'the@example.com',
      passwordHash: 'xxx',
    });

    const response = await request(app).get('/api/users/my-info');
    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('the@example.com');
  });

  it('Trả lỗi khi không tìm thấy user (getMyInfo)', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    const response = await request(app).get('/api/users/my-info');
    expect(response.status).toBe(404);
  });

  // TEST 3: PUT /my-info
  it('Cập nhật thông tin người dùng thành công', async () => {
    mockRepo.findOne.mockResolvedValue({
      id: 1,
      userName: 'hathe',
      phoneNumber: '0123',
      passwordHash: 'xxx',
    });

    mockRepo.save.mockResolvedValue({
      id: 1,
      userName: 'havanthe',
      phoneNumber: '0999',
      passwordHash: 'xxx',
    });

    const response = await request(app)
      .put('/api/users/my-info')
      .send({ userName: 'havanthe', phoneNumber: '0999' });

    expect(response.status).toBe(200);
    expect(response.body.data.userName).toBe('havanthe');
  });

  it('Trả lỗi khi không tìm thấy user (updateMyInfo)', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    const response = await request(app)
      .put('/api/users/my-info')
      .send({ userName: 'havanthe' });

    expect(response.status).toBe(404);
  });
});
