import { z } from 'zod';
 
export const updateUserSchema = z.object({
    email: z.email("Phải đúng định dạng email").optional(),
    phoneNumber: z.string().nonempty("Số điện thoại không được để trống").optional(),
    userName: z.string().nonempty("Tên người dùng không được để trống").min(5, "Tên người dùng phải hơn 5 kí tự").optional(),
    dob: z.string().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;