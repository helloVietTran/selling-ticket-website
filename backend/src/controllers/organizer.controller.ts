import { Request, Response, NextFunction } from 'express';

import { BaseResponse } from '../types/response.type';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { AppDataSource } from '../config/data-source';
import { Organizer } from '../models/Organizer.model';
import { Requester } from '../types';
import { User } from '../models/User.model';

class organizerController {
  private userRepo = AppDataSource.getRepository(User);

  getMyOrganizerRecord = async (req: Request, res: Response<BaseResponse<Organizer>>, next: NextFunction) => {
    const requester = res.locals.requester as Requester;

    try {
      const user = await this.userRepo.findOne({
        where: { id: +requester.id },
        relations: ['organizer']
      });

      if (!user?.organizer) {
        throw AppError.fromErrorCode(ErrorMap.ORGANIZER_NOT_FOUND);
      }

      res.status(200).json({
        message: 'Organizer record retrieved successfully',
        data: user.organizer
      });
    } catch (error) {
      next(error);
    }
  };
}
export default new organizerController();
