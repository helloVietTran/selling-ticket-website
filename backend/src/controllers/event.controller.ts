import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Event } from "../models/Event.model";
import { EventStatus } from "../types/enum";
import { Brackets } from "typeorm";
import ApiResponse from "../utils/ApiResponse";
import { IErrorCode } from "../config/ErrorCode";

class EventController {
  private eventRepository = AppDataSource.getRepository(Event);

  // Tạo event
  createEvent = async (req: Request, res: Response) => {
    try {
      const { title, description, startTime, endTime, status, capacity, organizer } = req.body;

      if (!title || !startTime || !endTime) {
        const err: IErrorCode = {
          code: "INVALID_INPUT",
          message: "Thiếu dữ liệu bắt buộc",
          statusCode: 400,
        };
        return res.status(400).json(ApiResponse.error(err));
      }

      const newEvent = this.eventRepository.create({
        title,
        description,
        startTime,
        endTime,
        status,
        capacity,
        organizer,
      });

      await this.eventRepository.save(newEvent);

      return res.status(201).json(ApiResponse.success(newEvent, "Tạo sự kiện thành công"));
    } catch (error) {
      console.error("Xảy ra lỗi khi tạo sự kiện:", error);
      const err: IErrorCode = {
        code: "EVENT_CREATE_FAILED",
        message: "Không thể tạo sự kiện",
        statusCode: 500,
      };
      return res.status(500).json(ApiResponse.error(err));
    }
  };

  // Lấy danh sách event
  getEvents = async (req: Request, res: Response) => {
    try {
      const events = await this.eventRepository.find({
        relations: ["venue", "organizer", "ticketTypes"],
      });

      return res
        .status(200)
        .json(ApiResponse.success(events, "Lấy danh sách sự kiện thành công"));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sự kiện:", error);
      const err: IErrorCode = {
        code: "EVENT_FETCH_FAILED",
        message: "Không thể lấy danh sách sự kiện",
        statusCode: 500,
      };
      return res.status(500).json(ApiResponse.error(err));
    }
  };

  // Cập nhật event
  updateEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;

      let event = await this.eventRepository.findOneBy({ eventId: Number(id) });
      if (!event) {
        const err: IErrorCode = {
          code: "EVENT_NOT_FOUND",
          message: "Không tìm thấy sự kiện",
          statusCode: 404,
        };
        return res.status(404).json(ApiResponse.error(err));
      }

      this.eventRepository.merge(event, data);
      const updatedEvent = await this.eventRepository.save(event);

      return res.json(ApiResponse.success(updatedEvent, "Cập nhật sự kiện thành công"));
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      const err: IErrorCode = {
        code: "EVENT_UPDATE_FAILED",
        message: "Không thể cập nhật sự kiện",
        statusCode: 500,
      };
      return res.status(500).json(ApiResponse.error(err));
    }
  };

  // Xóa event
  deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await this.eventRepository.findOneBy({ eventId: Number(id) });
      if (!event) {
        const err: IErrorCode = {
          code: "EVENT_NOT_FOUND",
          message: "Không tìm thấy sự kiện",
          statusCode: 404,
        };
        return res.status(404).json(ApiResponse.error(err));
      }

      await this.eventRepository.remove(event);

      return res.json(ApiResponse.success(null, "Xóa sự kiện thành công"));
    } catch (error) {
      console.error("Lỗi khi xóa sự kiện:", error);
      const err: IErrorCode = {
        code: "EVENT_DELETE_FAILED",
        message: "Không thể xóa sự kiện",
        statusCode: 500,
      };
      return res.status(500).json(ApiResponse.error(err));
    }
  };

  // Tìm kiếm events theo keyword + status
  searchEvents = async (req: Request, res: Response) => {
    try {
      const { keyword, status } = req.query;

      const query = this.eventRepository
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.venue", "venue")
        .leftJoinAndSelect("event.organizer", "organizer")
        .leftJoinAndSelect("event.ticketTypes", "ticketTypes");

      //  Tìm theo keyword
      if (keyword) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where("event.title LIKE :keyword", { keyword: `%${keyword}%` })
              .orWhere("event.description LIKE :keyword", {
                keyword: `%${keyword}%`,
              });
          })
        );
      }

      //  Tìm theo status 
      if (status) {
        const normalizedStatus = String(status).toUpperCase();

        // Kiểm tra status có trong enum không
        const validStatuses = Object.values(EventStatus);
        if (!validStatuses.includes(normalizedStatus as EventStatus)) {
          const err: IErrorCode = {
            code: "INVALID_STATUS",
            message: "Trạng thái tìm kiếm không hợp lệ",
            statusCode: 400,
          };
          return res.status(400).json(ApiResponse.error(err));
        }

        query.andWhere("event.status = :statusParam", {
          statusParam: normalizedStatus,
        });
      }

      const events = await query.orderBy("event.startTime", "ASC").getMany();

      return res
        .status(200)
        .json(ApiResponse.success(events, "Tìm kiếm sự kiện thành công"));
    } catch (error) {
      console.error("Lỗi khi search sự kiện:", error);
      const err: IErrorCode = {
        code: "EVENT_SEARCH_FAILED",
        message: "Không thể tìm kiếm sự kiện",
        statusCode: 500,
      };
      return res.status(500).json(ApiResponse.error(err));
    }
  };

  
}

export default new EventController();
