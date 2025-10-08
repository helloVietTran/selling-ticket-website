import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from '../types/response.type';
import { paymentInput } from '../validators/event.validate';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { AppDataSource } from '../config/data-source';
import { Organizer } from '../models/Organizer.model';
import { Requester } from '../types/index';
import { User } from '../models/User.model';

class organizerController {
  private organizerRepo = AppDataSource.getRepository(Organizer);
  private userRepo = AppDataSource.getRepository(User);

  createOrganizer = async (
    req: Request<{}, {}, paymentInput>,
    res: Response<BaseResponse<any>>,
    next: NextFunction
  ) => {
    try {
      const { organizationName, organizerInfo } = req.body;
      if (!organizationName || !organizerInfo) throw AppError.fromErrorCode(ErrorMap.INVALID_REQUEST);
      const organizer = this.organizerRepo.create({ organizationName, organizerInfo });
      await this.organizerRepo.save(organizer);
      return res.status(201).json({
        message: 'Tạo ban tổ chức thành công',
        data: organizer
      });
    } catch (error) {
      next(error);
    }
  };

  getOneOrganizer = async (
    req: Request<{}, {}, paymentInput>,
    res: Response<BaseResponse<any>>,
    next: NextFunction
  ) => {
    try {
      const organizerId = parseInt((req.params as any).organizerId, 10);
      const organizer = await this.organizerRepo.findOne({
        where: { organizerId: organizerId },
        relations: ['events', 'user']
      });
      if (!organizer) throw AppError.fromErrorCode(ErrorMap.ORGANIZER_NOT_FOUND);
      return res.status(200).json({ message: 'lấy ban tổ chức thành công', data: organizer });
    } catch (error) {
      next(error);
    }
  };
  updateOrganizer = async (
    req: Request<{}, {}, paymentInput>,
    res: Response<BaseResponse<any>>,
    next: NextFunction
  ) => {
    try {
      const { organizationName, organizerInfo } = req.body;
      const organizerId = parseInt((req.params as any).organizerId, 10);
      const organizer = await this.organizerRepo.findOne({
        where: { organizerId: organizerId },
        relations: ['events', 'user']
      });
      if (!organizer) throw AppError.fromErrorCode(ErrorMap.ORGANIZER_NOT_FOUND);
      organizer.organizationName = organizationName ?? organizer.organizationName;
      organizer.organizerInfo = organizerInfo ?? organizer.organizerInfo;
      await this.organizerRepo.save(organizer);
      return res.status(200).json({
        message: 'update organizer successfully',
        data: organizer
      });
    } catch (error) {
      next(error);
    }
  };
  
  getMyOrganizer = async (req: Request, res: Response<BaseResponse<any>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;
     
      const user = await this.userRepo.findOne({
        where: { id: Number(requester.id) },
        relations: ['organizer']
      });

      if (!user || !user.organizer) {
        throw AppError.fromErrorCode(ErrorMap.ORGANIZER_NOT_FOUND);
      }
      console.log(user.organizer.organizerId);
      return res.status(200).json({
        message: 'Lấy thông tin organizer của tôi thành công',
        data: user.organizer
      });
    } catch (err) {
      next(err);
    }
  };
  
}
export default new organizerController();
