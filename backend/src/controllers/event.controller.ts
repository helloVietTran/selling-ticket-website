import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../config/data-source";
import { Event } from "../models/Event.model";

class EventController {
    private eventRepository = AppDataSource.getRepository(Event);

    // Tạo event
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, description, startTime, endTime, status, capacity, organizer, } = req.body;

            const newEvent = this.eventRepository.create({
                title, description, startTime, endTime, status, capacity, organizer
            });

            await this.eventRepository.save(newEvent);

            return res.status(201).json({
                message: "Event created successfully",
                event: newEvent,
            });
        } catch (error) {
            console.error("Error creating event:", error);
            next(error);
        }
    };

    // Lấy danh sách event
    getEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const events = await this.eventRepository.find({
                relations: ["venue", "organizer", "ticketTypes"],
            });
            return res.status(200).json({
                message: "Fetched events successfully",
                count: events.length,
                events,
            });
        } catch (error) {
            console.error("Error fetching events:", error);
            next(error);
        }
    };

    // Cập nhật event
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = req.body;

            let event = await this.eventRepository.findOneBy({ eventId: Number(id) });
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            this.eventRepository.merge(event, data);
            const updatedEvent = await this.eventRepository.save(event);

            res.json({ message: "Event updated successfully", event: updatedEvent });
        } catch (error) {
            console.error("Error updating event:", error);
            next(error);
        }
    };

    // Xóa event
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const event = await this.eventRepository.findOneBy({ eventId: Number(id) });
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            await this.eventRepository.remove(event);

            res.json({ message: "Event deleted successfully" });
        } catch (error) {
            console.error("Error deleting event:", error);
            next(error);
        }
    };
}

export default new EventController();
