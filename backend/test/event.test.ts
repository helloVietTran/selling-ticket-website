import eventController from "../src/controllers/event.controller";
import { AppDataSource } from "../src/config/data-source";
import { Event } from "../src/models/Event.model";
import { User } from "../src/models/User.model";
import { AppError } from "../src/config/exception";
import { ErrorMap } from "../src/config/ErrorMap";
import { EventStatus } from "../src/types/enum";

jest.mock("../src/config/data-source", () => {
  const mockRepo = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  return {
    AppDataSource: {
      getRepository: jest.fn(() => mockRepo),
      transaction: jest.fn((cb) =>
        cb({
          getRepository: jest.fn(() => mockRepo),
        })
      ),
    },
  };
});

describe("EventController", () => {
  let mockRes: any;
  let mockNext: jest.Mock;
  let mockRepo: any;

  beforeEach(() => {
    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      locals: {},
    };
    mockNext = jest.fn();
    mockRepo = AppDataSource.getRepository(Event);
    jest.clearAllMocks();
  });

  // --- CREATE EVENT ---
  describe("createEvent", () => {
    it("should create event successfully", async () => {
      const mockEvent = { eventId: 1, title: "My Event" };
      mockRepo.save.mockResolvedValue(mockEvent);

      const req: any = {
        body: {
          event: { title: "My Event", eventInfo: "", startTime: Date.now(), endTime: Date.now(), category: "Music" },
          venue: { province: "A", district: "B", ward: "C", street: "D" },
          organizer: { organizerName: "Org", organizerInfo: "" },
          ticketTypes: [],
          setting: { messageToReceiver: "msg" },
        },
      };
      mockRes.locals.requester = { id: 1 };

      await eventController.createEvent(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Create event successfully",
        data: mockEvent,
      });
    });

    it("should call next with error if user not found", async () => {
      // giả lập transaction ném lỗi
      (AppDataSource.transaction as jest.Mock).mockImplementationOnce(() => {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      });

      const req: any = { body: {}, locals: { requester: { id: 99 } } };

      await eventController.createEvent(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND));
    });
  });

  // --- DELETE EVENT ---
  describe("deleteEvent", () => {
    it("should delete event successfully", async () => {
      const mockUser = { id: 1, organizer: { organizerId: 10 } };
      const mockEvent = { eventId: 1, organizer: { organizerId: 10 } };

      mockRepo.findOne.mockResolvedValueOnce(mockUser); // user
      mockRepo.findOne.mockResolvedValueOnce(mockEvent); // event

      const req: any = { params: { eventId: "1", organizerId: "10" } };
      mockRes.locals.requester = { id: 1 };

      await eventController.deleteEvent(req, mockRes, mockNext);

      expect(mockRepo.remove).toHaveBeenCalledWith(mockEvent);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Delete your event successfully",
      });
    });

    it("should call next if event not found", async () => {
      mockRepo.findOne.mockResolvedValueOnce({ id: 1, organizer: { organizerId: 10 } }); // user
      mockRepo.findOne.mockResolvedValueOnce(null); // event not found

      const req: any = { params: { eventId: "99", organizerId: "10" } };
      mockRes.locals.requester = { id: 1 };

      await eventController.deleteEvent(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.EVENT_NOT_FOUND));
    });
  });

  // --- FILTER EVENTS ---
  describe("filterEvents", () => {
    it("should return events with pagination", async () => {
      const mockEvents = [{ eventId: 1, title: "Filtered Event" }];
      mockRepo.createQueryBuilder().getManyAndCount.mockResolvedValue([mockEvents, 1]);

      const req: any = { query: { page: "1", limit: "10" } };

      await eventController.filterEvents(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Get event successfully",
        data: mockEvents,
        pagination: {
          page: 1,
          limit: 10,
          totalItems: 1,
          totalPages: 1,
        },
      });
    });
  });

  // --- GET EVENTS BY ORGANIZER ---
  describe("getEventsByOrganizer", () => {
    it("should return events for organizer", async () => {
      const mockUser = { id: 1, organizer: { organizerId: 5 } };
      const mockEvents = [{ eventId: 1, title: "By Organizer" }];

      mockRepo.findOne.mockResolvedValue(mockUser); // user
      mockRepo.find.mockResolvedValue(mockEvents); // events

      const req: any = { params: { organizerId: "5" }, query: {} };
      mockRes.locals.requester = { id: 1 };

      await eventController.getEventsByOrganizer(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Get events by organizer successfully",
        data: mockEvents,
        pagination: {
          page: 1,
          limit: 1,
          totalItems: 1,
          totalPages: 1,
        },
      });
    });

    it("should call next if user has no organizer", async () => {
      mockRepo.findOne.mockResolvedValue({ id: 1, organizer: null });

      const req: any = { params: { organizerId: "5" }, query: {} };
      mockRes.locals.requester = { id: 1 };

      await eventController.getEventsByOrganizer(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.VIEW_EVENTS_FORBIDDEN));
    });
  });

  // --- GET EVENT BY ID ---
  describe("getEventById", () => {
    it("should return event if found", async () => {
      const mockEvent = { eventId: 1, title: "One Event" };
      mockRepo.findOne.mockResolvedValue(mockEvent);

      const req: any = { params: { eventId: "1" } };

      await eventController.getEventById(req, mockRes, mockNext);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { eventId: 1 },
        relations: ["venue", "organizer", "ticketTypes", "category", "emailSetting"],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Get event by id successfully",
        data: mockEvent,
      });
    });

    it("should call next with error if not found", async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const req: any = { params: { eventId: "99" } };

      await eventController.getEventById(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.EVENT_NOT_FOUND));
    });
  });
});
