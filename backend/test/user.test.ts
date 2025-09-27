import { Request, Response, NextFunction } from 'express';
import userController from '../src/controllers/user.controller';
import { AppDataSource } from '../src/config/data-source';
import { User } from '../src/models/User.model';
import { ErrorMap } from '../src/config/ErrorMap';
import { AppError } from '../src/config/exception';

// ----------------------- MOCK MODULE -----------------------
jest.mock('../src/config/data-source', () => {
  const mockFindOne = jest.fn();
  const mockFindOneBy = jest.fn();
  const mockSave = jest.fn();

  return {
    AppDataSource: {
      getRepository: jest.fn(() => ({
        findOne: mockFindOne,
        findOneBy: mockFindOneBy,
        save: mockSave,
      })),
    },
  };
});

// ----------------------- HELPERS -----------------------
const mockGetRepository = AppDataSource.getRepository as jest.Mock;
const mockFindOne = () => (mockGetRepository().findOne as jest.Mock);
const mockFindOneBy = () => (mockGetRepository().findOneBy as jest.Mock);
const mockSave = () => (mockGetRepository().save as jest.Mock);

const createMockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = {};
  return res;
};

const mockNext: NextFunction = jest.fn();

// ----------------------- TEST SUITE -----------------------
describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- getUserById ----------------
  describe('getUserById', () => {
    const req: Partial<Request> = { params: { id: '1' } };

    it('should return user without password if found', async () => {
      mockFindOneBy().mockResolvedValue({ id: 1, email: 'test@mail.com', userName: 'John', passwordHash: 'hashed' });
      const res = createMockResponse();

      await userController.getUserById(req as Request, res, mockNext);

      expect(mockFindOneBy()).toHaveBeenCalledWith({ id: 1 });
      expect(res.json).toHaveBeenCalledWith({
        message: 'User information retrieved successfully',
        status: 200,
        data: { id: 1, email: 'test@mail.com', userName: 'John' },
      });
    });

    it('should call next with error if user not found', async () => {
      mockFindOneBy().mockResolvedValue(null);
      const res = createMockResponse();

      await userController.getUserById(req as Request, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND));
    });
  });

  // ---------------- getMyInfo ----------------
  describe('getMyInfo', () => {
    it('should return requester info if user exists', async () => {
      mockFindOne().mockResolvedValue({ id: 2, email: 'me@mail.com', userName: 'Me', passwordHash: 'hashed' });
      const res = createMockResponse();
      res.locals.requester = { id: 2 };

      await userController.getMyInfo({} as Request, res, mockNext);

      expect(mockFindOne()).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Get my info successfully',
        data: { id: 2, email: 'me@mail.com', userName: 'Me' },
      });
    });

    it('should call next with error if user not found', async () => {
      mockFindOne().mockResolvedValue(null);
      const res = createMockResponse();
      res.locals.requester = { id: 999 };

      await userController.getMyInfo({} as Request, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND));
    });
  });

  // ---------------- updateMyInfo ----------------
  describe('updateMyInfo', () => {
    it('should update and return user if valid', async () => {
      const mockUser = { id: 3, email: 'old@mail.com', userName: 'Old', phoneNumber: '123', passwordHash: 'hashed' };
      const updatedUser = { ...mockUser, email: 'new@mail.com', userName: 'New' };

      mockFindOne().mockResolvedValueOnce(mockUser); // find by id
      mockFindOne().mockResolvedValueOnce(null); // check duplicate email
      mockSave().mockResolvedValue(updatedUser);

      const req = { body: { email: 'new@mail.com', userName: 'New' } } as Partial<Request>;
      const res = createMockResponse();
      res.locals.requester = { id: 3 };

      await userController.updateMyInfo(req as Request, res, mockNext);

      expect(mockSave()).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Update user successfully',
        status: 200,
        data: { id: 3, email: 'new@mail.com', userName: 'New', phoneNumber: '123' },
      });
    });

    it('should call next with error if email already exists', async () => {
      const mockUser = { id: 3, email: 'old@mail.com', userName: 'Old', passwordHash: 'hashed' };
      const existedUser = { id: 4, email: 'dup@mail.com' };

      mockFindOne().mockResolvedValueOnce(mockUser); // find by id
      mockFindOne().mockResolvedValueOnce(existedUser); // duplicate email

      const req = { body: { email: 'dup@mail.com' } } as Partial<Request>;
      const res = createMockResponse();
      res.locals.requester = { id: 3 };

      await userController.updateMyInfo(req as Request, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.EMAIL_ALREADY_EXISTS));
    });

    it('should call next with error if user not found', async () => {
      mockFindOne().mockResolvedValue(null);
      const req = { body: {} } as Partial<Request>;
      const res = createMockResponse();
      res.locals.requester = { id: 999 };

      await userController.updateMyInfo(req as Request, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND));
    });
  });
});
