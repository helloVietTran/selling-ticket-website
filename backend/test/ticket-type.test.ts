import { Request, Response, NextFunction } from 'express';
import { AppError } from '../src/config/exception';
import { ErrorMap } from '../src/config/ErrorMap';

import { TicketType } from '../src/models/TicketType.model';
import { User } from '../src/models/User.model';
import { Booking } from '../src/models/Booking.model';
import { BookingItem } from '../src/models/BookingItem.model';

(TicketType.prototype as any).validate = jest.fn();
// ---------------- MOCKS ----------------

const mockFind = jest.fn();
const mockSum = jest.fn();
const mockSave = jest.fn();

const mockGetRepository = jest.fn(() => ({
  find: mockFind,
  sum: mockSum,
  save: mockSave
}));

const mockConnect = jest.fn();
const mockStartTransaction = jest.fn();
const mockRollbackTransaction = jest.fn();
const mockCommitTransaction = jest.fn();
const mockRelease = jest.fn();

const mockManagerFindOneBy = jest.fn();
const mockManagerSave = jest.fn();

const mockQueryRunner = {
  connect: mockConnect,
  startTransaction: mockStartTransaction,
  rollbackTransaction: mockRollbackTransaction,
  commitTransaction: mockCommitTransaction,
  release: mockRelease,
  manager: {
    findOneBy: mockManagerFindOneBy,
    save: mockManagerSave
  }
};

jest.mock('../src/config/data-source', () => ({
  AppDataSource: {
    getRepository: mockGetRepository,
    createQueryRunner: jest.fn(() => mockQueryRunner)
  }
}));

import ticketTypeController from '../src/controllers/ticket-type.controller';
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
describe('TicketTypeController (updated)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- getTicketTypesByEventId --------
  describe('getTicketTypesByEventId', () => {
    it('Trả về danh sách ticket types thành công', async () => {
      const req = { params: { eventId: '1' } } as unknown as Request;
      const res = createMockResponse();
      const mockTickets = [{ ticketTypeId: 1, name: 'VIP' }];
      mockFind.mockResolvedValue(mockTickets);

      await ticketTypeController.getTicketTypesByEventId(req, res, mockNext);

      expect(mockFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Lấy danh sách thành công',
        data: mockTickets
      });
    });

    it('Trả về AppError nếu thiếu eventId', async () => {
      const req = { params: {} } as unknown as Request;
      const res = createMockResponse();
      const result = await ticketTypeController.getTicketTypesByEventId(req, res, mockNext);
      expect(result).toEqual(AppError.fromErrorCode(ErrorMap.EVENT_NOT_EXISTS));
    });
  });

  // -------- bookingTicketType --------
  describe('bookingTicketType', () => {
    const req = {
      body: {
        eventId: 1,
        ticketTypes: [{ ticketTypeId: 1, quantity: 2 }]
      }
    } as unknown as Request;

    it('Tạo booking thành công', async () => {
  const res = createMockResponse();
  res.locals.requester = { id: 1 };

  // ✅ req có eventId và ticketTypes đúng định dạng
  const req = {
    body: {
      eventId: 10,
      ticketTypes: [{ ticketTypeId: 1, quantity: 2 }]
    }
  } as unknown as Request;

  const fakeUser = new User();
  const fakeTicketType = new TicketType();
  fakeTicketType.price = 100;
  fakeTicketType.soldTicket = 0;
  fakeTicketType.totalQuantity = 10;


  // ✅ Mock findOneBy (User rồi TicketType)
  mockManagerFindOneBy
    .mockResolvedValueOnce(fakeUser) // find User
    .mockResolvedValueOnce(fakeTicketType); // find TicketType

  // ✅ Mock save
  const fakeBooking = new Booking();
  fakeBooking.bookingItems = [new BookingItem()];
  mockManagerSave.mockResolvedValueOnce(fakeTicketType);
  mockManagerSave.mockResolvedValueOnce(fakeBooking);

  await ticketTypeController.bookingTicketType(req, res, mockNext);

  expect(mockConnect).toHaveBeenCalled();
  expect(mockStartTransaction).toHaveBeenCalled();
  expect(mockManagerFindOneBy).toHaveBeenCalledWith(User, { id: 1 });
  expect(mockManagerFindOneBy).toHaveBeenCalledWith(TicketType, { ticketTypeId: 1 });

  // ✅ validate() phải được gọi ít nhất 1 lần

  expect(mockManagerSave).toHaveBeenCalledTimes(2);
  expect(mockCommitTransaction).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      message: 'Booking created successfully. Please proceed to payment.'
    })
  );
});

    it('Gọi next khi không có ticketTypes', async () => {
      const badReq = { body: { ticketTypes: [] } } as unknown as Request;
      const res = createMockResponse();
      res.locals.requester = { id: 1 };

      await ticketTypeController.bookingTicketType(badReq, res, mockNext);
      expect(mockRollbackTransaction).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  // -------- statsTicketType --------
  describe('statsTicketType', () => {
    it('Trả về dữ liệu thống kê thành công', async () => {
      const req = { params: { eventId: '5' } } as unknown as Request;
      const res = createMockResponse();

      const fakeTickets = [
        { ticketTypeName: 'VIP', totalQuantity: 100, soldTicket: 50, event: { eventId: 5 } }
      ];
      mockFind.mockResolvedValue(fakeTickets);
      mockSum.mockResolvedValueOnce(100).mockResolvedValueOnce(50);

      await ticketTypeController.statsTicketType(req, res, mockNext);

      expect(mockFind).toHaveBeenCalled();
      expect(mockSum).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Stats successfully'
        })
      );
    });

    it('Gọi next khi không tìm thấy ticket type', async () => {
      const req = { params: { eventId: '10' } } as unknown as Request;
      const res = createMockResponse();
      mockFind.mockResolvedValue([]);

      await ticketTypeController.statsTicketType(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.TICKET_TYPE_NOT_FOUND));
    });
  });
});
