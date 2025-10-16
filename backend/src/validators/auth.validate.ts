import { access } from 'fs';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }).nonempty(),
  userName: z
    .string()
    .min(3, { message: 'Tên người dùng phải có ít nhất 3 ký tự' })
    .max(50, { message: 'Tên người dùng không quá 50 ký tự' })
    .nonempty(),
  password: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }).nonempty(),
  confirmPassword: z.string().min(8, { message: 'Mật khẩu nhập lại phải có ít nhất 8 ký tự' })
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(1, { message: 'Mật khẩu là bắt buộc' })
});
export const tokenSchema = z.object({
  accessToken: z.string().nonempty()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TokenInput = z.infer<typeof tokenSchema>;
