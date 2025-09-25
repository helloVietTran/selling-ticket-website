// src/controllers/revenue.controller.ts
import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { TransactionHistory } from '../models/TransactionHistory.model';
import { BaseResponse, RevenueResponse } from '../types/response.type';
import { Requester } from '../types';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';

export class RevenueController {
  getMyRevenue = async (
    req: Request,
    res: Response<BaseResponse<RevenueResponse>>,
    next: NextFunction
  ) => {
    try {
      const requester = res.locals.requester as Requester;

      if (!requester?.id) {
        throw AppError.fromErrorCode(ErrorMap.UNAUTHORIZED);
      }

      const qb = AppDataSource.getRepository(TransactionHistory)
    .createQueryBuilder('th')
    .innerJoin('th.event', 'e')
    .innerJoin('e.organizer', 'o')
    .innerJoin('o.user', 'u') // organizer → user
    .where('u.id = :userId', { userId: requester.id })
    .select([
      // doanh thu tuần trước
      `COALESCE(SUM(CASE WHEN th.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN th.amount ELSE 0 END), 0) AS revenueLastWeek`,
      // doanh thu tháng trước
      `COALESCE(SUM(CASE WHEN th.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN th.amount ELSE 0 END), 0) AS revenueLastMonth`,
    ]);

      const raw =
        (await qb.getRawOne<{
          revenueLastWeek: string;
          revenueLastMonth: string;
        }>()) ?? { revenueLastWeek: '0', revenueLastMonth: '0' };

      const result: RevenueResponse = {
        revenueLastWeek: parseFloat(raw.revenueLastWeek) || 0,
        revenueLastMonth: parseFloat(raw.revenueLastMonth) || 0,
      };

      return res.status(200).json({
        message: 'Get my revenue successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new RevenueController();
