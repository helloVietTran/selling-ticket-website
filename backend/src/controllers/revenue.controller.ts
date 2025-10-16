import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { TransactionHistory } from '../models/TransactionHistory.model';
import { BaseResponse, PredictRevenue, WeeklyRevenueResponse } from '../types/response.type';

import { TicketType } from '../models/TicketType.model';
import { Ticket } from '../models/Ticket.model';
import { Between } from 'typeorm';

class RevenueController {
  private transactionRepo = AppDataSource.getRepository(TransactionHistory);
  private ticketRepo = AppDataSource.getRepository(Ticket);
  private ticketTypeRepo = AppDataSource.getRepository(TicketType);

  getWeeklyRevenue = async (req: Request, res: Response<BaseResponse<WeeklyRevenueResponse>>, next: NextFunction) => {
    try {
      const eventId = parseInt(req.params.eventId);

      // thống kê 7 ngày kể cả hôm nay
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 6);

      const transactions = await this.transactionRepo.find({
        where: {
          eventId,
          createdAt: Between(sevenDaysAgo, now)
        }
      });

      const tickets = await this.ticketRepo.find({
        where: {
          eventId,
          createdAt: Between(sevenDaysAgo, now)
        }
      });

      const revenueByDate: Record<string, { revenue: number; tickets: number }> = {};

      for (const t of transactions) {
        const dateKey = t.createdAt.toISOString().slice(0, 10);
        if (!revenueByDate[dateKey]) revenueByDate[dateKey] = { revenue: 0, tickets: 0 };
        revenueByDate[dateKey].revenue += t.amount;
      }

      for (const tk of tickets) {
        const dateKey = tk.createdAt.toISOString().slice(0, 10);
        if (!revenueByDate[dateKey]) revenueByDate[dateKey] = { revenue: 0, tickets: 0 };
        revenueByDate[dateKey].tickets += 1;
      }

      const dailyRevenue = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(sevenDaysAgo);
        d.setDate(sevenDaysAgo.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        return {
          date: key,
          revenue: revenueByDate[key]?.revenue ?? 0,
          ticketsSold: revenueByDate[key]?.tickets ?? 0
        };
      });

      const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
      const totalTicketsSold = tickets.length;

      const response: WeeklyRevenueResponse = {
        eventId,
        totalRevenue,
        totalTicketsSold,
        dailyRevenue
      };

      return res.status(200).json({
        message: 'Weekly revenue stats successfully',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  statsRevenue = async (
    req: Request<{ eventId: string }>,
    res: Response<BaseResponse<PredictRevenue>>,
    next: NextFunction
  ) => {
    try {
      const eventId = Number(req.params.eventId);

      const ticketTypes = await this.ticketTypeRepo.find({
        where: { event: { eventId } },

        order: { startSellDate: 'ASC' }
      });

      const predictRevenue = ticketTypes.reduce((acc, tt) => {
        return acc + tt.totalQuantity * tt.price;
      }, 0);

      const realityRevenue = ticketTypes.reduce((acc, tt) => {
        return acc + tt.soldTicket * tt.price;
      }, 0);

      const percentage = predictRevenue > 0 ? ((realityRevenue / predictRevenue) * 100).toFixed(2) : '0.00';

      return res.json({
        message: 'Success',
        data: {
          realityRevenue,
          predictRevenue,
          percentage: percentage
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new RevenueController();
