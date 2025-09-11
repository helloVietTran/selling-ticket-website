import { z } from 'zod';
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// export const infoSchema = z.object({
//   title: z.string().min(5, 'Tiêu đề ít nhất 5 ký tự'),
//   image: z
//     .any()
//     .refine(file => file?.size <= MAX_FILE_SIZE, `Ảnh không quá 5 MB`)
//     .refine(
//       file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
//       'Chỉ chấp nhận định dạng .jpg, .jpeg, .png and .webp'
//     ),

//   province: z.string().nonempty('Vui lòng chọn Tỉnh/Thành'),
//   district: z.string().nonempty('Vui lòng chọn Quận/Huyện'),
//   ward: z.string().nonempty('Vui lòng chọn Phường/Xã'),
//   street: z.string().min(1, 'Nhập số nhà, đường'),
//   category: z.string().nonempty('Vui lòng nhập thể loại'),

//   eventInfo: z.string().nonempty('Vui lòng nhập thông tin sự kiện'),

//   organizerName: z.string().nonempty('Vui lòng nhập tên ban tổ chức'),
//   organizerInfo: z.string().nonempty('Vui lòng nhập thông tin ban tổ chức'),
// });

export const infoSchema = z.object({
  title: z
    .string()
    .min(5, 'Tiêu đề ít nhất 5 ký tự')
    .optional(),

  image: z
    .any()
    .refine(file => !file || file?.size <= MAX_FILE_SIZE, `Ảnh không quá 5 MB`)
    .refine(
      file => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Chỉ chấp nhận định dạng .jpg, .jpeg, .png and .webp'
    )
    .optional(),

  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  street: z.string().optional(),
  category: z.string().optional(),

  eventInfo: z.string().nonempty(),

  organizerName: z.string().optional(),
  organizerInfo: z.string().optional(),
});

export const ticketSchema = z.object({
  name: z.string().min(1, 'Tên vé không được để trống'),
  price: z.string().regex(/^\d+$/, 'Giá vé phải là số'),
  quantity: z.string().regex(/^\d+$/, 'Số lượng phải là số'),
  startDate: z.string().min(1, 'Chọn thời gian bắt đầu'),
  endDate: z.string().min(1, 'Chọn thời gian kết thúc'),
  description: z
    .string()
    .max(1000)
    .optional(),
});

export const timeAndTicketTypeSchema = z.object({
  startDate: z.string().nonempty('Chọn ngày bắt đầu'),
  endDate: z.string().nonempty('Chọn ngày kết thúc'),

  tickets: z.array(ticketSchema).min(1, 'Vui lòng thêm hạng vé'),
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

export type Step1Data = z.infer<typeof infoSchema>;
export type Step2Data = z.infer<typeof timeAndTicketTypeSchema>;
export type Step3Data = z.infer<typeof settingSchema>;
export type Step4Data = z.infer<typeof paymentSchema>;
export type TicketForm = z.infer<typeof ticketSchema>;

export type FormDataByStep = {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;
};
