import { NextFunction, Request, Response } from 'express';
import { Brackets } from 'typeorm';

import { AppDataSource } from '../config/data-source';
import { EventStatus, Requester } from '../types/types';
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

class EventController {
  private eventRepository = AppDataSource.getRepository(Event);

  async createEvent(req: Request<any, any, CreateEventInput>, res: Response, next: NextFunction) {
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

      return res.status(201).json(ApiResponse.success(savedEvent));
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách event
  getEvents = async (req: Request, res: Response) => {
    try {
      const events = await this.eventRepository.find({
        relations: ['venue', 'organizer', 'ticketTypes', 'category']
      });

      return res.status(200).json(ApiResponse.success(events, 'Lấy danh sách sự kiện thành công'));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
      return res.status(500).json(
        ApiResponse.error({
          code: 'EVENT_FETCH_FAILED',
          message: 'Không thể lấy danh sách sự kiện',
          statusCode: 500
        })
      );
    }
  };

  updateEvent = async (req: Request, res: Response) => {
    // try {
    //   const { id } = req.params;
    //   const { organizerId, venueId, categoryId, ...fields } = req.body;
    //   const event = await this.eventRepository.findOne({
    //     where: { eventId: Number(id) },
    //     relations: ['venue', 'organizer', 'category', 'ticketTypes']
    //   });
    //   if (!event) {
    //     return res.status(404).json(
    //       ApiResponse.error({
    //         code: 'EVENT_NOT_FOUND',
    //         message: 'Không tìm thấy sự kiện',
    //         statusCode: 404
    //       })
    //     );
    //   }
    //   // Helper function để load quan hệ
    //   const loadRelation = async <T>(repo: any, id: number, errorCode: string, errorMsg: string) => {
    //     const entity = await repo.findOneBy({ id });
    //     if (!entity) throw { code: errorCode, message: errorMsg, statusCode: 400 };
    //     return entity;
    //   };
    //   // Cập nhật quan hệ nếu có
    //   if (organizerId)
    //     event.organizer = await loadRelation(
    //       AppDataSource.getRepository(Organizer),
    //       organizerId,
    //       'INVALID_ORGANIZER',
    //       'Organizer không tồn tại'
    //     );
    //   if (venueId !== undefined)
    //     event.venue = venueId
    //       ? ((await AppDataSource.getRepository(Venue).findOneBy({ id: venueId })) ?? undefined)
    //       : undefined;
    //   if (categoryId !== undefined)
    //     event.category = categoryId
    //       ? ((await AppDataSource.getRepository(Category).findOneBy({ categoryId })) ?? undefined)
    //       : undefined;
    //   // Cập nhật các field còn lại
    //   Object.assign(event, fields);
    //   const updatedEvent = await this.eventRepository.save(event);
    //   return res.json(ApiResponse.success(updatedEvent, 'Cập nhật sự kiện thành công'));
    // } catch (error: any) {
    //   console.error('Lỗi khi cập nhật sự kiện:', error);
    //   // Nếu error do quan hệ không hợp lệ
    //   if (error.code && error.statusCode) {
    //     return res.status(error.statusCode).json(ApiResponse.error(error));
    //   }
    //   return res.status(500).json(
    //     ApiResponse.error({
    //       code: 'EVENT_UPDATE_FAILED',
    //       message: 'Không thể cập nhật sự kiện',
    //       statusCode: 500
    //     })
    //   );
    // }
  };

  deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await this.eventRepository.findOneBy({ eventId: Number(id) });
      if (!event) {
        return res.status(404).json(
          ApiResponse.error({
            code: 'EVENT_NOT_FOUND',
            message: 'Không tìm thấy sự kiện',
            statusCode: 404
          })
        );
      }

      await this.eventRepository.remove(event);
      return res.json(ApiResponse.success(null, 'Xóa sự kiện thành công'));
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      return res.status(500).json(
        ApiResponse.error({
          code: 'EVENT_DELETE_FAILED',
          message: 'Không thể xóa sự kiện',
          statusCode: 500
        })
      );
    }
  };

  searchEvents = async (req: Request, res: Response) => {
    try {
      const { keyword, status } = req.query;

      const query = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.venue', 'venue')
        .leftJoinAndSelect('event.organizer', 'organizer')
        .leftJoinAndSelect('event.ticketTypes', 'ticketTypes')
        .leftJoinAndSelect('event.category', 'category');

      if (keyword) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('event.title LIKE :keyword', { keyword: `%${keyword}%` }).orWhere(
              'event.description LIKE :keyword',
              { keyword: `%${keyword}%` }
            );
          })
        );
      }

      if (status) {
        const normalizedStatus = String(status).toUpperCase();
        if (!Object.values(EventStatus).includes(normalizedStatus as EventStatus)) {
          return res.status(400).json(
            ApiResponse.error({
              code: 'INVALID_STATUS',
              message: 'Trạng thái tìm kiếm không hợp lệ',
              statusCode: 400
            })
          );
        }
        query.andWhere('event.status = :statusParam', { statusParam: normalizedStatus });
      }

      const events = await query.orderBy('event.startTime', 'ASC').getMany();
      return res.status(200).json(ApiResponse.success(events, 'Tìm kiếm sự kiện thành công'));
    } catch (error) {
      console.error('Lỗi khi search sự kiện:', error);
      return res.status(500).json(
        ApiResponse.error({
          code: 'EVENT_SEARCH_FAILED',
          message: 'Không thể tìm kiếm sự kiện',
          statusCode: 500
        })
      );
    }
  };

  filterEvents = async (req: Request, res: Response) => {
    try {
      const { startTime, endTime, categoryId, venueId } = req.query;

      const query = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.venue', 'venue')
        .leftJoinAndSelect('event.organizer', 'organizer')
        .leftJoinAndSelect('event.ticketTypes', 'ticketTypes')
        .leftJoinAndSelect('event.category', 'category');

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
      if (categoryId) {
        query.andWhere('category.categoryId = :categoryId', { categoryId });
      }

      // Lọc theo venue
      if (venueId) {
        query.andWhere('venue.id = :venueId', { venueId });
      }

      const events = await query.orderBy('event.startTime', 'ASC').getMany();

      return res.status(200).json(ApiResponse.success(events, 'Lọc sự kiện thành công'));
    } catch (error) {
      console.error('Lỗi khi lọc sự kiện:', error);
      return res.status(500).json(
        ApiResponse.error({
          code: 'EVENT_FILTER_FAILED',
          message: 'Không thể lọc sự kiện',
          statusCode: 500
        })
      );
    }
  };
}

export default new EventController();
