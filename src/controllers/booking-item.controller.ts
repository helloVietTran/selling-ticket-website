import { Request, Response, NextFunction } from "express";
import { TicketType } from "../models/TicketType.model";
import { AppDataSource } from "../config/data-source";
import ApiResponse from "../utils/ApiResponse"
import { ErrorMap } from "../config/ErrorCode";
import { IErrorCode } from "../config/ErrorCode";
import { BookingItem } from "../models/BookingItem.model";

const ticketTypeRepo = AppDataSource.getRepository(TicketType);
const bookingItemRepo= AppDataSource.getRepository(BookingItem);

class bookingItemController {
    async creatBookingItem(req:Request,res:Response,next:NextFunction){
        try {
            const {bookingId,eventId,ticketTypeId}=req.body;
            if(!eventId) return res.status(400).json({message:"Ko có sự kiện đã tìm"})
            const quantity=await ticketTypeRepo.count({ where:{ event: { eventId: eventId }},});
            const newBookingItem= bookingItemRepo.create ({
                quantity:quantity,
                booking:bookingId,
                ticketType:ticketTypeId
            })
            await bookingItemRepo.save(newBookingItem);
            return res.status(201).json(ApiResponse.success(newBookingItem, "Tạo đơn thành công"));
        } catch (error) {
            const err: IErrorCode = {
                      code: "CREATE_BOOKING_ITEM_FAILED",
                      message: "Không thể tạo đơn vé",   
                      statusCode: 500,
                    };      
                  return res.status(500).json(ApiResponse.error(err));
        }
    }
}

export default new bookingItemController();