import { Request, Response, NextFunction } from 'express';
import eventController from '../src/controllers/event.controller';
import { AppDataSource } from '../src/config/data-source';
import { Event } from '../src/models/Event.model';
import { EventQueries } from '../src/types/query.type';
import { EventStatus } from '../src/types/enum';

// ----------------------- MOCK MODULE -----------------------
jest.mock('../src/config/data-source', () => {
  const mockFindOne = jest.fn();
  const mockFind = jest.fn();
  const mockSave = jest.fn();
  const mockRemove = jest.fn();
  const mockCreate = jest.fn();
  const mockCreateQueryBuilder = jest.fn();

  const repo = {
    findOne: mockFindOne,
    find: mockFind,
    save: mockSave,
    remove: mockRemove,
    create: mockCreate,
    createQueryBuilder: mockCreateQueryBuilder
  };

  const manager = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    getRepository: jest.fn(() => repo)
  };

  return {
    AppDataSource: {
      manager,
      getRepository: jest.fn(() => repo),
      transaction: jest.fn((fn) => fn(manager))
    }
  };
});

// ----------------------- HELPERS -----------------------

// Mock response
const createMockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = { requester: { id: 1 } };
  return res;
};

// Mock request with params & query
const mockRequest = <P extends object = {}, Q extends object = {}>(
  params: P = {} as P,
  query: Q = {} as Q,
  body: any = {}
): Request<P, any, any, Q> => {
  return { params, query, body } as unknown as Request<P, any, any, Q>;
};

// Repository helpers
const mockGetRepository = AppDataSource.getRepository as jest.Mock;
const mockFindOne = () => mockGetRepository().findOne as jest.Mock;
const mockFind = () => mockGetRepository().find as jest.Mock;
const mockSave = () => mockGetRepository().save as jest.Mock;
const mockRemove = () => mockGetRepository().remove as jest.Mock;
const mockCreate = () => mockGetRepository().create as jest.Mock;
const mockCreateQueryBuilder = () => mockGetRepository().createQueryBuilder as jest.Mock;

const mockNext: NextFunction = jest.fn();

// ----------------------- TEST SUITE -----------------------
describe('EventController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- createEvent ----------------
  describe('createEvent', () => {
    it('should create event successfully', async () => {
      const req = mockRequest(
        {},
        {},
        {
          event: {
            title: 'Event A',
            eventInfo: 'Info',
            category: 'Category A',
            startTime: new Date(),
            endTime: new Date()
          },
          venue: { province: 'A', district: 'B', ward: 'C', street: 'D' },
          organizer: { organizerName: 'Org A', organizerInfo: 'Info' },
          ticketTypes: [
            {
              name: 'VIP',
              description: 'VIP',
              quantity: 10,
              price: 100,
              maxPerUser: 2,
              minPerUser: 1,
              startSellDate: new Date(),
              endSellDate: new Date()
            }
          ],
          setting: { messageToReceiver: 'Welcome' }
        }
      );

      const res = createMockResponse();
      const mockEvent = { eventId: 1, title: 'Event A' };

      (AppDataSource.transaction as jest.Mock).mockImplementation(async (fn) => {
        const mockUserRepo = {
          findOne: jest.fn().mockResolvedValue({ id: 1, organizer: null }),
          save: jest.fn(),
          create: jest.fn((x) => x)
        };
        const mockOrganizerRepo = {
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockResolvedValue({ organizerId: 1, organizationName: 'Org A' }),
          create: jest.fn((x) => x)
        };
        const mockCategoryRepo = {
          findOne: jest.fn().mockResolvedValue({ categoryId: 1, categoryName: 'Category A' })
        };
        const mockEventRepo = {
          create: jest.fn((x) => x),
          save: jest.fn().mockResolvedValue(mockEvent)
        };
        const mockVenueRepo = { create: jest.fn((x) => x) };
        const mockTicketTypeRepo = { create: jest.fn((x) => x) };
        const mockEmailSettingRepo = { create: jest.fn((x) => x) };

        const manager = {
          getRepository: jest.fn().mockImplementation((model) => {
            switch (model.name) {
              case 'User':
                return mockUserRepo;
              case 'Organizer':
                return mockOrganizerRepo;
              case 'Category':
                return mockCategoryRepo;
              case 'Event':
                return mockEventRepo;
              case 'Venue':
                return mockVenueRepo;
              case 'TicketType':
                return mockTicketTypeRepo;
              case 'EmailSetting':
                return mockEmailSettingRepo;
              default:
                return {};
            }
          })
        };

        return await fn(manager);
      });

      await eventController.createEvent(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Create event successfully', data: mockEvent });
    });
  });

  // ---------------- deleteEvent ----------------
  describe('deleteEvent', () => {
    it('should delete event successfully', async () => {
      const req = mockRequest({ eventId: '1', organizerId: '1' });
      const res = createMockResponse();

      const mockEvent = { eventId: 1, organizer: { organizerId: 1 } };
      mockFindOne().mockResolvedValue(mockEvent);
      mockRemove().mockResolvedValue(undefined);

      await eventController.deleteEvent(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Delete your event successfully' });
    });
  });

  // ---------------- filterEvents ----------------
  describe('filterEvents', () => {
    it('should return events with pagination', async () => {
      const req = mockRequest({}, { page: '1', limit: '10' }) as Request<any, any, any, EventQueries>;
      const res = createMockResponse();

      const mockEvents = [{ eventId: 1, title: 'Mock Event' }];
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockEvents, 1])
      };
      mockCreateQueryBuilder().mockReturnValue(qb);

      await eventController.filterEvents(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Get event successfully',
        data: mockEvents,
        pagination: { page: 1, limit: 10, totalPages: 1, totalItems: 1 }
      });
    });
  });

  // ---------------- getEventsByOrganizer ----------------
  describe('getEventsByOrganizer', () => {
    it('should return organizer events', async () => {
      const req = mockRequest<{ organizerId: string }, { status?: EventStatus }>(
        { organizerId: '1' },
        { status: undefined }
      );
      const res = createMockResponse();

      const mockEvents = [{ eventId: 1, title: 'Event A' }];
      mockFind().mockResolvedValue(mockEvents);

      await eventController.getEventsByOrganizer(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Get events by organizer successfully',
        data: mockEvents,
        pagination: { page: 1, limit: mockEvents.length, totalItems: mockEvents.length, totalPages: 1 }
      });
    });
  });

  // ---------------- getEventById ----------------
  describe('getEventById', () => {
    it('should return single event', async () => {
      const req = mockRequest<{ eventId: string }>({ eventId: '1' });
      const res = createMockResponse();

      const mockEvent = { eventId: 1, title: 'Event A' };
      mockFindOne().mockResolvedValue(mockEvent);

      await eventController.getEventById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Get event by id successfully',
        data: mockEvent
      });
    });
  });
});
