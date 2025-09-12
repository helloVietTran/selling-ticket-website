import { z } from "zod";

//  Đăng ký
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    userName: z.string().min(6, "Tên tài khoản tối thiểu 6 ký tự"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    roles: z.array(z.string()).optional(), // roles có thể để trống
  }),
});

//  Đăng nhập
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  }),
});

// Type để dùng trong controller
export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];