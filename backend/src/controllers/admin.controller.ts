import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { AppDataSource } from '../config/data-source';
import { EventStatus, Role } from '../types/enum';
import { Event } from '../models/Event.model';
import { BaseResponse } from '../types/response.type';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { Requester } from '../types/index';
import { User } from '../models/User.model';
import { config } from '../config/config';

export class AdminController {
  private eventRepo = AppDataSource.getRepository(Event);
  private userRepo = AppDataSource.getRepository(User);

  acceptEvent = async (req: Request, res: Response<BaseResponse<{}>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;
      const userRole = requester.roles;
      const eventId = req.params.eventId;
      if (!eventId) {
        throw AppError.fromErrorCode(ErrorMap.NOT_FOUND_EVENT_ID);
      }
      if (userRole == Role.Admin) {
        const selectedEvent = await this.eventRepo.findOne({
          where: { eventId: Number(eventId) }
        });
        if (!selectedEvent) {
          throw AppError.fromErrorCode(ErrorMap.EVENT_NOT_EXISTS);
        }
        selectedEvent.status = EventStatus.Published;
        const updateEvent = await this.eventRepo.save(selectedEvent);
        return res.status(200).json({
          message: 'update status successfully',
          data: updateEvent
        });
      } else {
        throw AppError.fromErrorCode(ErrorMap.NOT_ENOUGH_PERMISSION);
      }
    } catch (error) {
      next(error);
    }
  };

  initAdmin = async () => {
    try {
      const existingAdmin = await this.userRepo.findOne({
        where: { roles: Role.Admin }
      });

      if (existingAdmin) {
        console.log('Admin already exists');
        return;
      }
      const hashedPassword = await bcrypt.hash(config.admin.password, 10);

      // admin@nhom1.com
      // 12345678a
      const adminUser = this.userRepo.create({
        email: config.admin.email,
        userName: 'Admin',
        passwordHash: hashedPassword,
        roles: Role.Admin
      });

      await this.userRepo.save(adminUser);
      console.log('Admin user created successfully');
    } catch (error) {
      throw error;
    }
  };
}
export default new AdminController();
