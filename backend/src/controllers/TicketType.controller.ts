import { Request, Response, NextFunction } from 'express';
import { TicketType } from '../models/TicketType.model';
import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/Ticket.model';
import ApiResponse from '../utils/ApiResponse';
import { ErrorMap } from '../config/ErrorMap';
import { IErrorCode } from '../config/ErrorMap';

const ticketTypeRepo = AppDataSource.getRepository(TicketType);
const ticketRepo = AppDataSource.getRepository(Ticket);

class TicketTypeController {
  async getTicketType(req: Request, res: Response, next: NextFunction) {
    try {
      const event = req.body.event;

      const existedEvent = await ticketTypeRepo.findOne({
        where: { event }
      });
      if (!existedEvent) {
        return res.status(404).json(ApiResponse.error(ErrorMap.TICKET_TYPE_NOT_FOUND));
      }
      const ticketId = req.body.ticketId;
      const checkedIn = await ticketRepo.findOne({ where: { ticketId } });
      if (!checkedIn) {
        return res.status(404).json(ApiResponse.error(ErrorMap.TICKET_TYPE_NOT_FOUND));
      }
      const totalTicket = await ticketTypeRepo.sum('totalQuantity', { totalQuantity: existedEvent.totalQuantity });
      const totalsoldTicket = await ticketTypeRepo.sum('totalQuantity', { soldTicket: existedEvent.soldTicket });
      return res.json({
        ticketType: existedEvent.ticketTypeName,
        totalQuantity: existedEvent.totalQuantity,
        soldTicket: existedEvent.soldTicket,
        isChecked_in: checkedIn.checkedIn,
        totalTicket: totalTicket,
        totalsoldTicket: totalsoldTicket
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  async createTicketType(req: Request, res: Response, next: NextFunction) {
    // try {
    //   const {ticketTypeName,stand,totalQuantity,soldTicket,availableQuantity,price,event}=req.body
    //   const newTicketType= ticketTypeRepo.create ({
    //     ticketTypeName:ticketTypeName || " ",
    //     stand:stand || " ",
    //     totalQuantity:totalQuantity || " ",
    //     soldTicket:soldTicket || " ",
    //     availableQuantity:availableQuantity  || " ",
    //     price:price || " ",
    //     event:event || " "
    //   })
    //   await ticketTypeRepo.save(newTicketType);
    //   return res.status(201).json(ApiResponse.success(newTicketType, "Tạo hạng vé thành công"));
    // } catch(error){
    //     return res.status(400).json(ApiResponse.error(ErrorMap.ERROR_CREATE_TICKET_TYPE));
    // }
  }
  async readTicketType(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.body.event;
      const pageCurrent = Number(req.query.page);
      const ticketType = await ticketTypeRepo.findBy({ event: { eventId: eventId } });
      const totalTicketType = await ticketTypeRepo.count({ where: { event: { eventId: eventId } } });
      return res.status(200).json(ApiResponse.paginate(ticketType, totalTicketType, pageCurrent, 4));
    } catch (error) {
      const err: IErrorCode = {
        code: 'TICKETTYPE_FETCH_FAILED',
        message: 'Không thể lấy danh sách hạng vé',
        statusCode: 500
      };
      return res.status(500).json(ApiResponse.error(err));
    }
  }
  async updateTicketType(req: Request, res: Response, next: NextFunction) {
    // try {
    //   const ticketTypeId=parseInt(req.params.id);
    //   const {ticketTypeName,stand,totalQuantity,soldTicket,availableQuantity,price,event}=req.body
    //   const ticketType= await ticketTypeRepo.findOneBy({ ticketTypeId:ticketTypeId });
    //   if (!ticketType) return res.status(404).json({ message: "Ticket Type not found" });
    //   const updateTicketType=  await ticketTypeRepo.update(
    //     {ticketTypeId:ticketTypeId},
    //     {
    //        ticketTypeName: ticketTypeName ?? ticketType.ticketTypeName,
    //        stand: stand ?? ticketType.stand,
    //        totalQuantity: totalQuantity ?? ticketType.totalQuantity,
    //        soldTicket: soldTicket ?? ticketType.soldTicket,
    //        availableQuantity: availableQuantity ?? ticketType.availableQuantity,
    //        price: price ?? ticketType.price,
    //        event: event ?? ticketType.event,
    //     })
    //     return res.json(ApiResponse.success(updateTicketType, "Cập nhật hạng vé thành công"));
    // } catch (error) {
    //         console.error("Lỗi khi cập nhật hạng vé:", error);
    //         const err: IErrorCode = {
    //           code: "TICKETTYPE_UPDATE_FAILED",
    //           message: "Không thể cập nhật hạng vé",
    //           statusCode: 500,
    //         };
    //         return res.status(500).json(ApiResponse.error(err));
    // }
  }
  async deleteTicketType(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketTypeId = parseInt(req.params.id);
      const ticketType = await ticketTypeRepo.findOneBy({ ticketTypeId: ticketTypeId });
      if (ticketType) {
        await ticketTypeRepo.remove(ticketType);
      }
      return res.json(ApiResponse.success(null, 'Xóa hạng vé thành công'));
    } catch (error) {
      console.error('Lỗi khi xóa hạng vé:', error);
      const err: IErrorCode = {
        code: 'TICKETTYPE_DELETE_FAILED',
        message: 'Không thể xóa hạng vé',
        statusCode: 500
      };
      return res.status(500).json(ApiResponse.error(err));
    }
  }
}

export default new TicketTypeController();
