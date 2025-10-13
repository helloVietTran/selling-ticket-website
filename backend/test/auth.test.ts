import { Request, Response, NextFunction } from 'express';
import authController from '../src/controllers/auth.controller';
import { AppError } from '../src/config/exception';
import { ErrorMap } from '../src/config/ErrorMap';
import { Role } from '../src/types/enum';

// -------------------- MOCK MODULES --------------------

jest.mock('../src/config/data-source', () => {
  const mockSave = jest.fn();
  const mockFindOne = jest.fn();
  const mockCreate = jest.fn();
  return {
    AppDataSource: {
      getRepository: jest.fn(() => ({
        findOne: mockFindOne,
        create: mockCreate,
        save: mockSave
      }))
    }
  };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

jest.mock('../src/config/config', () => ({
  config: { jwt_secret: 'TEST_SECRET' }
}));

// -------------------- MOCK SETUP --------------------

import { AppDataSource } from '../src/config/data-source';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../src/models/User.model';

const mockGetRepository = AppDataSource.getRepository as jest.Mock;
const mockFindOne = () => mockGetRepository().findOne as jest.Mock;
const mockCreate = () => mockGetRepository().create as jest.Mock;
const mockSave = () => mockGetRepository().save as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;
const mockSign = jwt.sign as jest.Mock;
const mockVerify = jwt.verify as jest.Mock;

jest.mock('../src/models/User.model'); // mock lớp User
const MockedUser = User as jest.MockedClass<typeof User>;

const createMockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

// -------------------- TEST SUITE --------------------

describe('AuthController (new version)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- REGISTER --------
  describe('register', () => {
    const mockReq = {
      body: { email: 'new@example.com', userName: 'newuser', password: '123456' }
    } as unknown as Request;

    it('Đăng ký thành công', async () => {
      MockedUser.prototype.validate = jest.fn();
      mockFindOne().mockResolvedValue(null);
      mockHash.mockResolvedValue('hashed_pw');
      mockCreate().mockReturnValue({});
      const res = createMockResponse();

      await authController.register(mockReq, res, mockNext);

      expect(MockedUser.prototype.validate).toHaveBeenCalled();
      expect(mockFindOne()).toHaveBeenCalledWith({ where: { email: mockReq.body.email } });
      expect(mockHash).toHaveBeenCalledWith('123456', 10);
      expect(mockSave()).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Đăng ký thành công!' });
    });

    it('Gọi next khi user đã tồn tại', async () => {
      MockedUser.prototype.validate = jest.fn();
      mockFindOne().mockResolvedValue({});
      const res = createMockResponse();

      await authController.register(mockReq, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_ALREADY_EXISTS));
    });

    it('Gọi next khi lỗi DB', async () => {
      MockedUser.prototype.validate = jest.fn();
      const dbError = new Error('DB fail');
      mockFindOne().mockRejectedValue(dbError);
      const res = createMockResponse();

      await authController.register(mockReq, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });

  // -------- LOGIN --------
  describe('login', () => {
    const mockReq = {
      body: { email: 'test@example.com', password: 'pw' }
    } as unknown as Request;

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hashed_pw',
      roles: [Role.User]
    };

    it('Đăng nhập thành công', async () => {
      mockFindOne().mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue('mockToken');
      const res = createMockResponse();

      await authController.login(mockReq, res, mockNext);

      expect(mockCompare).toHaveBeenCalledWith('pw', 'hashed_pw');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Đăng nhập thành công',
        data: {
          user: mockUser,
          accessToken: 'mockToken'
        }
      });
    });

    it('Gọi next khi user không tồn tại', async () => {
      mockFindOne().mockResolvedValue(null);
      const res = createMockResponse();

      await authController.login(mockReq, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND));
    });

    it('Gọi next khi mật khẩu sai', async () => {
      mockFindOne().mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(false);
      const res = createMockResponse();

      await authController.login(mockReq, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.PASSWORD_INCORRECT));
    });
  });

  // -------- LOGOUT --------
  describe('logout', () => {
    const token = 'valid.jwt';
    const mockReq = { body: { accessToken: token } } as unknown as Request;
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const decoded = { id: 1, role: Role.User, exp };

    it('Đăng xuất thành công', async () => {
      mockVerify.mockReturnValue(decoded);
      mockCreate().mockReturnValue({});
      const res = createMockResponse();

      await authController.logout(mockReq, res, mockNext);

      expect(mockVerify).toHaveBeenCalledWith(token, 'TEST_SECRET');
      expect(mockCreate()).toHaveBeenCalledWith({
        token,
        expiresAt: new Date(decoded.exp * 1000)
      });
      expect(mockSave()).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Đăng xuất thành công, token đã bị vô hiệu hóa.'
      });
    });

    it('Gọi next khi token invalid', async () => {
      const jwtErr = new Error('invalid');
      mockVerify.mockImplementation(() => {
        throw jwtErr;
      });
      const res = createMockResponse();

      await authController.logout(mockReq, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(jwtErr);
    });
  });

  // -------- VERIFY TOKEN --------
  describe('verifyToken', () => {
    const mockReq = { body: { accessToken: 'token123' } } as unknown as Request;
    const decoded = { id: 1, roles: [Role.User] };

    it('Xác thực token thành công', async () => {
      mockVerify.mockReturnValue(decoded);
      const res = createMockResponse();

      await authController.verifyToken(mockReq, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token hợp lệ',
        data: decoded
      });
    });

    it('Gọi next khi không có token', async () => {
      const badReq = { body: {} } as unknown as Request;
      const res = createMockResponse();

      await authController.verifyToken(badReq, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.NOT_FOUND_TOKEN));
    });

    it('Gọi next khi verify lỗi', async () => {
      const jwtErr = new Error('invalid');
      mockVerify.mockImplementation(() => {
        throw jwtErr;
      });
      const res = createMockResponse();

      await authController.verifyToken(mockReq, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(jwtErr);
    });
  });
});
