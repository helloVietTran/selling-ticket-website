// src/controllers/revenue.controller.ts
import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { TransactionHistory } from '../models/TransactionHistory.model';
import { BaseResponse, RevenueResponse } from '../types/response.type';
import { Requester } from '../types';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { User } from '../models/User.model';

function formatDate(d: Date | string): string {
  const date = new Date(d);
  return date.toISOString().split('T')[0];
}

class RevenueController {
  private userRepo = AppDataSource.getRepository(User);

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

      const user = await this.userRepo.findOne({
        where: { id: Number(requester.id) },
        relations: ['organizer']
      });
     
      if (!user || !user.organizer) {
        throw AppError.fromErrorCode(ErrorMap.ORGANIZER_NOT_FOUND);
      }
      const organizerId = user.organizer.organizerId;
      const repo = AppDataSource.getRepository(TransactionHistory);

      const weeklyRaw = await repo
        .createQueryBuilder('th')
        .where('th.organizer_id = :organizerId', { organizerId: organizerId })
        .andWhere('th.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)')
        .select([
          `DATE(th.created_at) AS date`,
          `COALESCE(SUM(th.amount), 0) AS revenue`,
        ])
        .groupBy('DATE(th.created_at)')
        .orderBy('DATE(th.created_at)', 'ASC')
        .getRawMany<{ date: string; revenue: string }>();

      const weeklyRevenue: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = formatDate(date);
        weeklyRevenue[key] = 0;
      }
      weeklyRaw.forEach((row) => {
        const key = formatDate(row.date);
        weeklyRevenue[key] = parseFloat(row.revenue) || 0;
      });

      const totalWeeklyRevenue = Object.values(weeklyRevenue).reduce(
        (sum, val) => sum + val,
        0
      );

      const monthlyRaw = await repo
        .createQueryBuilder('th')
        .where('th.organizer_id = :organizerId', { organizerId: organizerId })
        .andWhere('th.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)')
        .select([
          `DATE(th.created_at) AS date`,
          `COALESCE(SUM(th.amount), 0) AS revenue`,
        ])
        .groupBy('DATE(th.created_at)')
        .orderBy('DATE(th.created_at)', 'ASC')
        .getRawMany<{ date: string; revenue: string }>();

      const monthlyRevenue: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = formatDate(date);
        monthlyRevenue[key] = 0;
      }
      monthlyRaw.forEach((row) => {
        const key = formatDate(row.date);
        monthlyRevenue[key] = parseFloat(row.revenue) || 0;
      });

      const totalMonthlyRevenue = Object.values(monthlyRevenue).reduce(
        (sum, val) => sum + val,
        0
      );

      return res.status(200).json({
        message: 'Get my revenue successfully',
        data: {
          weeklyRevenue,
          totalWeeklyRevenue,
          monthlyRevenue,
          totalMonthlyRevenue,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new RevenueController();
