import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../config/data-source";
import { Event } from "../models/Event.model";



class EventController {
    private eventRepository = AppDataSource.getRepository(Event);

    // Tạo
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, description, startTime, endTime, status, capacity, venue, organizer } = req.body;

            const newEvent = this.eventRepository.create({
                title,
                description,
                startTime,
                endTime,
                status,
                capacity,
                venue,
                organizer,
            });

            await this.eventRepository.save(newEvent);

            res.status(201).json({ message: "Event created successfully", event: newEvent });
        } catch (error) {
            console.error("Error creating event:", error);
            next(error);
        }
    }


    async getAll(req: Request, res: Response, next: NextFunction) {
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
    }
}

export default new EventController();



