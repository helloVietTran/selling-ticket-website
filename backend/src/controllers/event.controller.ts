import { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../config/data-source';
import { EventStatus } from '../types/enum';
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
import { EventQueries } from '../types/query.type';

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

  deleteEvent = async (req: Request, res: Response<BaseResponse<undefined>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;
      const eventId = Number(req.params.eventId);
      const organizerId = Number(req.params.organizerId);

      const userRepo = AppDataSource.getRepository(User);
      const eventRepo = AppDataSource.getRepository(Event);

      // find organizer of user
      const user = await userRepo.findOne({
        where: { id: Number(requester.id) },
        relations: ['organizer']
      });

      if (!user || !user.organizer || user.organizer.organizerId !== organizerId) {
        throw AppError.fromErrorCode(ErrorMap.DELETE_EVENT_FORBIDDEN);
      }

      const event = await eventRepo.findOne({
        where: { eventId },
        relations: ['organizer']
      });

      if (!event || event.organizer.organizerId !== organizerId) {
        throw AppError.fromErrorCode(ErrorMap.ORGANIZER_MISMATCH);
      }

      await eventRepo.remove(event);
      return res.json({
        message: 'Delete your event successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  filterEvents = async (
    req: Request<any, any, any, EventQueries>,
    res: Response<PaginateResponse<Event>>,
    next: NextFunction
  ) => {
    try {
      const { startTime, endTime, category, province, keyword, page, limit } = req.query;

      const pageNumber = parseInt(page || '1', 10);
      const pageSize = parseInt(limit || '10', 10);

      const allowedStatuses = [EventStatus.Published, EventStatus.Ongoing];

      const query = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.venue', 'venue')
        .leftJoinAndSelect('event.organizer', 'organizer')
        .leftJoinAndSelect('event.ticketTypes', 'ticketTypes')
        .leftJoinAndSelect('event.category', 'category')
        .where('event.status IN (:...allowedStatuses)', { allowedStatuses });

      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        query.andWhere('event.startTime BETWEEN :start AND :end', { start, end });
      }

      if (category) {
        const categories = category.split(',');
        query.andWhere('category.categoryName IN (:...categories)', { categories });
      }

      if (province && province !== 'all') {
        query.andWhere('venue.province LIKE :province', { province: `%${province}%` });
      }

      if (keyword) {
        query.andWhere('(event.title LIKE :keyword OR event.eventInfo LIKE :keyword)', { keyword: `%${keyword}%` });
      }

      query
        .orderBy('event.startTime', 'DESC')
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize);

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

  getMyEventsByOrganizerId = async (
    req: Request<{ organizerId: string }, {}, {}, { status?: EventStatus; keyword?: string }>,
    res: Response<PaginateResponse<Event>>,
    next: NextFunction
  ) => {
    try {
      const requester = res.locals.requester as Requester;
      const { organizerId } = req.params;
      const { status, keyword } = req.query;

      const userRepo = AppDataSource.getRepository(User);
      const eventRepo = AppDataSource.getRepository(Event);

      const user = await userRepo.findOne({
        where: { id: Number(requester.id) },
        relations: ['organizer']
      });

      if (!user || !user.organizer || user.organizer.organizerId !== Number(organizerId)) {
        throw AppError.fromErrorCode(ErrorMap.VIEW_EVENTS_FORBIDDEN);
      }

      const query = eventRepo
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.venue', 'venue')
        .leftJoinAndSelect('event.ticketTypes', 'ticketTypes')
        .leftJoinAndSelect('event.category', 'category')
        .where('event.organizerId = :organizerId', { organizerId: Number(organizerId) });

      if (status) {
        query.andWhere('event.status = :status', { status });
      }

      if (keyword) {
        query.andWhere('event.title LIKE :keyword', { keyword: `%${keyword}%` });
      }

      const events = await query.orderBy('event.startTime', 'DESC').getMany();

      return res.status(200).json({
        message: 'Get events by organizer successfully',
        data: events,
        pagination: {
          page: 1,
          limit: events.length,
          totalItems: events.length,
          totalPages: 1
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new EventController();
