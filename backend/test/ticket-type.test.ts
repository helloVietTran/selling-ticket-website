import { Request, Response, NextFunction } from 'express';
import { AppError } from '../src/config/exception';
import { ErrorMap } from '../src/config/ErrorMap';
import { TicketType } from '../src/models/TicketType.model';
import { User } from '../src/models/User.model';

// ---------------- MOCKS ----------------
const mockFindBy = jest.fn();
const mockFindOne = jest.fn();
const mockSum = jest.fn();
const mockSave = jest.fn();

var mockGetRepository = jest.fn(() => ({
  findBy: mockFindBy,
  findOne: mockFindOne,
  sum: mockSum,
  save: mockSave,
}));

const mockConnect = jest.fn();
const mockStartTransaction = jest.fn();
const mockRollback = jest.fn();
var mockCommit = jest.fn();
const mockRelease = jest.fn();
const mockManagerFindOneBy = jest.fn();
const mockManagerSave = jest.fn();

var mockQueryRunner = {
  connect: mockConnect,
  startTransaction: mockStartTransaction,
  rollbackTransaction: mockRollback,
  commitTransaction: mockCommit,
  release: mockRelease,
  manager: {
    findOneBy: mockManagerFindOneBy,
    save: mockManagerSave,
  },
};

import ticketTypeController from '../src/controllers/ticket-type.controller';
// Mock AppDataSource
jest.mock('../src/config/data-source', () => ({
  AppDataSource: {
    getRepository: mockGetRepository,
    createQueryRunner: jest.fn(() => mockQueryRunner),
  },
}));

// ---------------- RESPONSE MOCK ----------------
const createMockResponse = (): jest.Mocked<Response> & { locals: any } => {
  const res = {} as jest.Mocked<Response> & { locals: any };
  res.locals = {}; 
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext: NextFunction = jest.fn();

// ---------------- TEST SUITE ----------------
describe('TicketTypeController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- getTicketTypesByEventId --------
  describe('getTicketTypesByEventId', () => {
    it('Trả về 200 với danh sách ticket types', async () => {
      const req = { params: { eventId: '1' } } as unknown as Request;
      const res = createMockResponse();
      const mockTickets = [{ ticketTypeId: 1, name: 'VIP' }];
      mockFindBy.mockResolvedValue(mockTickets);
      await ticketTypeController.getTicketTypesByEventId(req, res, mockNext);
      expect(mockFindBy).toHaveBeenCalledWith({ event: { eventId: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Lấy danh sách thành công',
        data: mockTickets,
      });
    });

    it('Trả về AppError nếu không có eventId', async () => {
      const req = { params: {} as any } as unknown as Request;
      const res = createMockResponse();
      const result = await ticketTypeController.getTicketTypesByEventId(req, res, mockNext);
      expect(result).toEqual(AppError.fromErrorCode(ErrorMap.EVENT_NOT_EXISTS));
    });
  });

  // -------- bookingTicket --------
  describe('bookingTicket', () => {
    const req = {
      body: { ticketTypes: [{ ticketTypeId: 1, quantity: 2 }] },
    } as unknown as Request;
    it('Tạo booking thành công', async () => {
      const res = createMockResponse();
      res.locals.requester = { id: 1 };
      const mockValidate = jest.fn().mockResolvedValue(undefined);
      TicketType.prototype.validate = mockValidate;
      const fakeUser = new User();
      const fakeTicketType = new TicketType();
      fakeTicketType.price = 100;
      fakeTicketType.soldTicket = 0;
      mockManagerFindOneBy.mockResolvedValueOnce(fakeUser); // 1. find User
      mockManagerFindOneBy.mockResolvedValueOnce(fakeTicketType); // 2. find TicketType
      mockManagerSave.mockResolvedValueOnce(fakeTicketType);
      mockManagerSave.mockResolvedValueOnce({
        bookingItems: [{}],
      });
      await ticketTypeController.bookingTicket(req, res, mockNext);  
      mockValidate.mockRestore();
      expect(mockManagerFindOneBy).toHaveBeenCalledWith(User, { id: 1 });
      expect(mockManagerFindOneBy).toHaveBeenCalledWith(TicketType, { ticketTypeId: 1 });
      expect(mockManagerSave).toHaveBeenCalledTimes(2);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Booking created successfully. Please proceed to payment.',
        })
      );
    });
    it('Gọi next khi ticketTypes rỗng', async () => {
      const res = createMockResponse();
      res.locals.requester = { id: 1 };
      const badReq = { body: { ticketTypes: [] } } as unknown as Request;
      await ticketTypeController.bookingTicket(badReq, res, mockNext);
      expect(mockRollback).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.INVALID_REQUEST));
    });
  });

  // -------- statisticalTicketType --------
  describe('statisticalTicketType', () => {
    it('Trả về 201 với dữ liệu thống kê', async () => {
      const req = { params: { eventId: '5' } } as unknown as Request;
      const res = createMockResponse();
      const fakeEvent = {
        event: { eventId: 5 },
        ticketTypeName: 'VIP',
        totalQuantity: 100,
        soldTicket: 20,
      };
      mockFindOne.mockResolvedValue(fakeEvent);
      mockSum.mockResolvedValueOnce(100).mockResolvedValueOnce(20);
      await ticketTypeController.statisticalTicketType(req, res, mockNext);
      expect(mockFindOne).toHaveBeenCalled();
      expect(mockSum).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'statistical featch successfully',
        })
      );
    });

    it('Gọi next khi không tìm thấy event', async () => {
      const req = { params: { eventId: '9' } } as unknown as Request;
      const res = createMockResponse();
      mockFindOne.mockResolvedValue(null);
      await ticketTypeController.statisticalTicketType(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.TICKET_TYPE_NOT_FOUND));
    });
  });
});
