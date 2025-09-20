import { NextFunction, Request, Response } from 'express';
import { BaseEntity, Brackets } from 'typeorm';

import { AppDataSource } from '../config/data-source';
import { EventStatus } from '../types/enum';
import ApiResponse from '../utils/ApiResponse';
import { CreateEventInput } from '../validators/event.validate';
import { ErrorMap } from '../config/ErrorMap';

import { Event } from '../models/Event.model';
import { Venue } from '../models/Venue.model';
import { Organizer } from '../models/Organizer.model';
import { Category } from '../models/Category.model';
import { User } from '../models/User.model';
import { EmailSetting } from '../models/EmailSetting.model';
import { TicketType } from '../models/TicketType.model';
import { AppError } from '../config/exception';
import { BaseResponse, PaginateResponse } from '../types/response.type';
import { Requester } from '../types';
import { DeleteEventParams, EventQueries } from '../types/query.type';
import { areIntervalsOverlapping } from 'date-fns';

class EventController {
  private eventRepository = AppDataSource.getRepository(Event);

  async createEvent(req: Request<any, any, CreateEventInput>, res: Response<BaseResponse<Event>>, next: NextFunction) {
    const { event, venue, organizer, ticketTypes, setting } = req.body;
    const requester = res.locals.requester as Requester;

    try {
      const savedEvent = await AppDataSource.transaction(async (manager) => {
        const userRepo = manager.getRepository(User);
        const organizerRepo = manager.getRepository(Organizer);
        const venueRepo = manager.getRepository(Venue);
        const categoryRepo = manager.getRepository(Category);
        const eventRepo = manager.getRepository(Event);
        const ticketTypeRepo = manager.getRepository(TicketType);
        const emailSettingRepo = manager.getRepository(EmailSetting);

        const user = await userRepo.findOne({
          where: { id: Number(requester.id) }
        });

        if (!user) {
          throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
        }

        // create or update organizer
        let savedOrganizer = await organizerRepo.findOne({
          where: { organizationName: organizer.organizerName }
        });

        if (!savedOrganizer) {
          const newOrg = organizerRepo.create({
            organizationName: organizer.organizerName,
            organizerInfo: organizer.organizerInfo
          });

          savedOrganizer = await organizerRepo.save(newOrg);
        }

        user.organizer = savedOrganizer;
        await userRepo.save(user);

        // create venue
        const newVenue = venueRepo.create({
          province: venue.province,
          district: venue.district,
          ward: venue.ward,
          street: venue.street
        });

        // find category
        const savedCategory = await categoryRepo.findOne({
          where: { categoryName: event.category }
        });
        if (!savedCategory) {
          throw AppError.fromErrorCode(ErrorMap.CATEGORY_NOT_FOUND);
        }

        // create email setting
        const emailSetting = emailSettingRepo.create({
          messageToReceiver: setting.messageToReceiver
        });

        // create ticket type list
        const newTicketTypes = ticketTypes.map((tt) =>
          ticketTypeRepo.create({
            ticketTypeName: tt.name ?? '',
            description: tt.description,
            totalQuantity: Number(tt.quantity),
            maxPerUser: Number(tt.maxPerUser),
            minPerUser: Number(tt.minPerUser),
            price: Number(tt.price),
            startSellDate: new Date(tt.startSellDate),
            endSellDate: new Date(tt.endSellDate)
          })
        );

        const newEvent = eventRepo.create({
          title: event.title,
          eventInfo: event.eventInfo,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
          venue: newVenue,
          organizer: savedOrganizer,
          category: savedCategory,
          emailSetting: emailSetting,
          ticketTypes: newTicketTypes
        });

        const savedEvent = await eventRepo.save(newEvent);
        return savedEvent;
      });

      return res.status(201).json({
        message: 'Create event successfully',
        data: savedEvent
      });
    } catch (error) {
      next(error);
    }
  }

  // /:eventId/organizer/:organizerId
  deleteEvent = async (req: Request, res: Response<BaseResponse<undefined>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;
      const eventId = Number(req.params.id);
      const organizerId = Number(req.params.organizerId);

      const userRepo = AppDataSource.getRepository(User);
      const eventRepo = AppDataSource.getRepository(Event);

      // yêu cầu: lấy user và liên kết với bảng organizer

      const user = await userRepo.findOne({
        where: { id: Number(requester.id) },
        relations: ["organizer"],
      });

      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }

      // nếu không có  organizer hoặc organizerId không khớp sẽ Lỗi
      if (!user.organizer || user.organizer.organizerId !== organizerId) {
        throw AppError.fromErrorCode(ErrorMap.DELETE_EVENT_FORBIDDEN)
      }


      const event = await eventRepo.findOne({
        where: { eventId },
        relations: ["organizer"],
      });
      if (!event) {
        throw AppError.fromErrorCode(ErrorMap.EVENT_NOT_FOUND);
      }

      if (event.organizer.organizerId !== organizerId) {
        throw AppError.fromErrorCode(ErrorMap.ORGANIZER_MISMATCH);
      }
      // nếu đúng cho phép xóa
      await eventRepo.remove(event);
      return res.json({
        message: 'Delete your event successfully'
      });
    } catch (error) {
      next(error);
    }
  };


  // lọc theo nhiều tiêu chí
  // sắp xếp theo startTime mới nhất
  filterEvents = async (req: Request<any, any, any, EventQueries>, res: Response<PaginateResponse<Event>>, next: NextFunction) => {
    try {
      const { startTime, endTime, category, district, keyword, page, limit, status } = req.query;

      const pageNumber = page ? parseInt(page as string, 10) : 1;
      const pageSize = limit ? parseInt(limit as string, 10) : 10;

      const query = this.eventRepository
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.venue", "venue")
        .leftJoinAndSelect("event.organizer", "organizer")
        .leftJoinAndSelect("event.ticketTypes", "ticketTypes")
        .leftJoinAndSelect("event.category", "category");

      // Lọc theo khoảng thời gian
      if (startTime && endTime) {
        const start = new Date(startTime as string);
        const end = new Date(endTime as string);

        query.andWhere('event.startTime BETWEEN :start AND :end', {
          start,
          end
        });
      }
      // Lọc theo category
      if (category) {
        query.andWhere("category.categoryId = :categoryId", { categoryId: Number(category) });
      }

      if (district) {
        query.andWhere("venue.district LIKE :district", { district: `%${district}%` });
      }

      if (keyword) {
        query.andWhere(
          '(event.title LIKE :keyword OR event.eventInfo LIKE :keyword)',
          { keyword: `%${keyword}%` }
        );
      }
      if (status) {
        query.andWhere("event.status = :status", { status });
      }
      query.orderBy("event.startTime", "DESC");

      query.skip((pageNumber - 1) * pageSize).take(pageSize);
      const [events, totalItems] = await query.getManyAndCount();


      return res.status(200).json({
        message: 'Get event successfully',
        data: events,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getEventsByOrganizer = async (req: Request<{}, {}, {}, { status: EventStatus }>, res: Response<PaginateResponse<Event>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;
      const { status } = req.query;


      const eventRepo = AppDataSource.getRepository(Event);
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({
        where: { id: Number(requester.id) },
        relations: ["organizer"],
      });

      if (!user || !user.organizer) {
        throw AppError.fromErrorCode(ErrorMap.VIEW_EVENTS_FORBIDDEN)
      }

      const events = await eventRepo.find({
        where: {
          organizer: { organizerId: user.organizer.organizerId },
          ...(status && { status }),
        },
        relations: ["venue", "ticketTypes", "category"],
        order: { startTime: "DESC" },
      });

      return res.status(200).json({
        message: "Get events by organizer successfully",
        data: events,
        pagination: {
          page: 1,
          limit: events.length,
          totalItems: events.length,
          totalPages: 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };



 
}

export default new EventController();
