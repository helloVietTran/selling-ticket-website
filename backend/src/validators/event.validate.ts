import { z } from 'zod';
import { parseISO, isAfter } from 'date-fns';

const organizerSchema = z.object({
  organizerName: z.string().min(1, 'Tên ban tổ chức không được để trống'),
  organizerInfo: z.string().min(1, 'Thông tin ban tổ chức không được để trống')
});

const venueSchema = z.object({
  province: z.string().min(1, 'Vui lòng chọn Tỉnh/Thành'),
  district: z.string().min(1, 'Vui lòng chọn Quận/Huyện'),
  ward: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
  street: z.string().min(1, 'Nhập số nhà, đường')
});

const ticketTypeSchema = z
  .object({
    name: z.string().min(1, 'Tên vé không được để trống'),
    price: z.string().regex(/^\d+$/, 'Giá vé phải là số'),
    quantity: z.string().regex(/^\d+$/, 'Số lượng phải là số'),
    description: z.string().max(1000).optional(),
    maxPerUser: z.string().regex(/^\d+$/, 'Số vé tối đa phải là số'),
    minPerUser: z.string().regex(/^\d+$/, 'Số vé tối thiểu phải là số'),
    startSellDate: z.string().min(1, 'Chọn thời gian bắt đầu bán vé'),
    endSellDate: z.string().min(1, 'Chọn thời gian kết thúc bán vé')
  })
  .superRefine((data, ctx) => {
    const start = parseISO(data.startSellDate);
    const end = parseISO(data.endSellDate);

    if (!isAfter(end, start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Thời gian kết thúc bán vé phải lớn hơn thời gian bắt đầu',
        path: ['endSellDate']
      });
    }
  });

const eventSchema = z
  .object({
    title: z.string().min(5, 'Tiêu đề ít nhất 5 ký tự'),
    category: z.string().min(1, 'Vui lòng nhập thể loại'),
    eventInfo: z.string().min(1, 'Vui lòng nhập thông tin sự kiện'),
    startTime: z.string().min(1, 'Chọn ngày bắt đầu'),
    endTime: z.string().min(1, 'Chọn ngày kết thúc')
  })
  .superRefine((data, ctx) => {
    const start = parseISO(data.startTime);
    const end = parseISO(data.endTime);

    if (!isAfter(end, start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
        path: ['endTime']
      });
    }
  });

const settingSchema = z.object({
  messageToReceiver: z.string().optional()
});

const paymentSchema = z.object({
  accountHolder: z.string().min(1, 'Vui lòng nhập tên chủ tài khoản').max(100),
  accountNumber: z.string().min(1, 'Vui lòng nhập số tài khoản').max(100),
  bankName: z.string().min(1, 'Vui lòng nhập tên ngân hàng').max(100),
  branch: z.string().min(1, 'Vui lòng nhập chi nhánh').max(100),
  organizerId: z.string().min(1, 'Vui lòng nhập mã ban tổ chức').optional(),
  organizationName: z.string().min(1, 'Vui lòng nhập tên ban tổ chức').optional(),
  organizerInfo: z.string().min(1, 'Vui lòng nhập thông tin ban tổ chức').optional()
});

export const createEventSchema = z.object({
  organizer: organizerSchema,
  venue: venueSchema,
  event: eventSchema,
  ticketTypes: z.array(ticketTypeSchema).min(1, 'Vui lòng thêm ít nhất 1 hạng vé'),
  setting: settingSchema,
  paymentInfo: paymentSchema
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type paymentInput = z.infer<typeof paymentSchema>;
