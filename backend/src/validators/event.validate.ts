import { z } from 'zod';
import { EventStatus } from '../types/enum';

// Tạo sự kiện
export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(5, { message: 'Tiêu đề phải có ít nhất 5 ký tự' }),
    description: z.string().optional(),
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Ngày bắt đầu không hợp lệ'
    }),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Ngày kết thúc không hợp lệ'
    }),
    status: z.nativeEnum(EventStatus).optional(), // có default
    capacity: z.number().int().positive({ message: 'Sức chứa phải là số dương' }).optional()
  })
});

// Tạo sự kiện, có thể chọn nhiều trường
export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    startTime: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Ngày bắt đầu không hợp lệ'
      })
      .optional(),
    endTime: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Ngày kết thúc không hợp lệ'
      })
      .optional(),
    status: z.nativeEnum(EventStatus).optional(),
    capacity: z.number().int().positive().optional()
  })
});

// Type để dùng trong controller
export type CreateEventInput = z.infer<typeof createEventSchema>['body'];
export type UpdateEventInput = z.infer<typeof updateEventSchema>['body'];
