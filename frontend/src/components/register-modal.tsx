'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthModal } from '@/context/auth-modal-context';

// Schema validate với zod
const registerSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu xác nhận không khớp',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterModal() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { modalType, closeModal, openLogin } = useAuthModal();
  const open = modalType === 'register';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log('Register form data:', data);
    // Gọi API đăng ký ở đây
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md rounded-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold font-raleway text-gray-500 mb-2">
            Đăng ký
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <Input
              type="email"
              placeholder="Nhập email"
              className="rounded"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-rose-600 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              className="rounded pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu"
              className="rounded pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(p => !p)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-rose-600 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-gray-200 text-black hover:bg-gray-300 cursor-pointer">
            Đăng ký
          </Button>

          <p className="text-sm text-center">
            Đã có tài khoản?{' '}
            <button
              type="button"
              className="text-emerald-500 hover:underline"
              onClick={() => {
                closeModal();
                openLogin();
              }}>
              Đăng nhập ngay
            </button>
          </p>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-gray-400 text-sm">Hoặc</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2 rounded-lg cursor-pointer">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Đăng ký với Google
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
