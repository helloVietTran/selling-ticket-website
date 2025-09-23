import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.email('Phải đúng định dạng email'),
  phoneNumber: z.string().nonempty('Số điện thoại không được để trống'),
  userName: z.string().nonempty('Tên người dùng không được để trống').min(5, 'Tên người dùng phải hơn 5 kí tự'),
  dob: z.string()
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
