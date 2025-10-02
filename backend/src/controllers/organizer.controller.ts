import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from '../types/response.type';
import { paymentInput } from '../validators/event.validate';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { AppDataSource } from '../config/data-source';
import { Organizer } from '../models/Organizer.model';

class organizerController {
  private organizerRepo = AppDataSource.getRepository(Organizer);

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
}
export default new organizerController();
