import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { TransactionHistory } from '../models/TransactionHistory.model';

export class RevenueController {
    getRevenue = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const qb = AppDataSource.getRepository(TransactionHistory)
        .createQueryBuilder('th')
        .select([
          // Doanh thu 7 ngày gần nhất
          `COALESCE(SUM(CASE WHEN th.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN th.amount ELSE 0 END), 0) AS revenueLastWeek`,
          // Doanh thu 1 tháng gần nhất
          `COALESCE(SUM(CASE WHEN th.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN th.amount ELSE 0 END), 0) AS revenueLastMonth`,
        ]);

      const raw =
        (await qb.getRawOne<{
          revenueLastWeek: string;
          revenueLastMonth: string;
        }>()) ?? { revenueLastWeek: '0', revenueLastMonth: '0' };

      const result = {
        revenueLastWeek: parseFloat(raw.revenueLastWeek) || 0,
        revenueLastMonth: parseFloat(raw.revenueLastMonth) || 0,
      };

      return res.json({ success: true, data: result });
    } catch (error) {
        next(Error);
    }
  }
}

export default new RevenueController();