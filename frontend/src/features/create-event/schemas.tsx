import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const infoSchema = z.object({
  title: z.string().min(5, 'Tiêu đề ít nhất 5 ký tự'),
  eventImage: z
    .any()
    .refine(
      file => file?.size <= MAX_FILE_SIZE,
      `Chưa tải lên ảnh hoặc ảnh quá 5 MB`
    )
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Chỉ chấp nhận định dạng .jpg, .jpeg, .png and .webp'
    ),

  province: z.string().nonempty('Vui lòng chọn Tỉnh/Thành'),
  district: z.string().nonempty('Vui lòng chọn Quận/Huyện'),
  ward: z.string().nonempty('Vui lòng chọn Phường/Xã'),
  street: z.string().min(1, 'Nhập số nhà, đường'),

  category: z.string().nonempty('Vui lòng nhập thể loại'),

  eventInfo: z.string().nonempty('Vui lòng nhập thông tin sự kiện'),

  organizerName: z.string().nonempty('Vui lòng nhập tên ban tổ chức'),
  organizerInfo: z.string().nonempty('Vui lòng nhập thông tin ban tổ chức'),
});

export const tickeTypeSchema = z.object({
  name: z.string().min(1, 'Tên vé không được để trống'),
  price: z.string().regex(/^\d+$/, 'Giá vé phải là số'),
  quantity: z.string().regex(/^\d+$/, 'Số lượng phải là số'),
  startSellDate: z.string().min(1, 'Chọn thời gian bắt đầu'),
  endSellDate: z.string().min(1, 'Chọn thời gian kết thúc'),
  description: z
    .string()
    .max(1000)
    .optional(),
  maxPerUser: z.string().regex(/^\d+$/, 'Số vé tối đa phải là số'),
  minPerUser: z.string().regex(/^\d+$/, 'Số vé tối thiểu phải là số'),
});

export const timeAndTicketTypeSchema = z.object({
  startDate: z.string().nonempty('Chọn ngày bắt đầu'),
  endDate: z.string().nonempty('Chọn ngày kết thúc'),
  ticketTypes: z.array(tickeTypeSchema).min(1, 'Vui lòng thêm hạng vé'),
});

export const settingSchema = z.object({
  messageToReceiver: z.string().optional(),
});

export const paymentSchema = z.object({
  accountHolder: z
    .string()
    .min(1, 'Vui lòng nhập tên chủ tài khoản')
    .max(100),
  accountNumber: z
    .string()
    .min(1, 'Vui lòng nhập số tài khoản')
    .max(100),
  bankName: z
    .string()
    .min(1, 'Vui lòng nhập tên ngân hàng')
    .max(100),
  branch: z
    .string()
    .min(1, 'Vui lòng nhập chi nhánh')
    .max(100),
});

export type InfoType = z.infer<typeof infoSchema>;
export type TicketAndTimeType = z.infer<typeof timeAndTicketTypeSchema>;
export type SettingType = z.infer<typeof settingSchema>;
export type PaymentType = z.infer<typeof paymentSchema>;
export type TicketType = z.infer<typeof tickeTypeSchema>;

export type CreateEventFormData = {
  eventInfo?: InfoType;
  timeAndTicketTypeInfo?: TicketAndTimeType;
  settingInfo?: SettingType;
  paymentInfo?: PaymentType;
};
