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
import { Link } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthModal } from '@/context/auth-modal-context';

// Schema validate
const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginModal() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { modalType, openRegister, closeModal } = useAuthModal();
  const open = modalType === 'login';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log('Login form data:', data);
    // Gọi API login ở đây
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold font-raleway text-gray-500 mb-2">
            Đăng nhập
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email / Phone */}
          <div>
            <Input
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              className={`rounded ${
                errors.emailOrPhone ? 'border-red-500' : ''
              }`}
              {...register('emailOrPhone')}
            />
            {errors.emailOrPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.emailOrPhone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              className={`rounded pr-10 ${
                errors.password ? 'border-red-500' : ''
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-gray-200 text-black hover:bg-gray-300 cursor-pointer"
          >
            Tiếp tục
          </Button>

          <p className="text-sm text-center">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              className="text-emerald-500 hover:underline"
              onClick={() => {
                closeModal();
                openRegister();
              }}
            >
              Đăng ký ngay
            </button>
          </p>

          <div className="text-sm flex justify-between px-1">
            <a href="#" className="text-gray-500 hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-gray-400 text-sm">Hoặc</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2 rounded-lg cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Đăng nhập với Google
          </Button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Bằng việc tiếp tục, bạn đã đọc và đồng ý với{' '}
            <Link to="#" className="text-green-600 hover:underline">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link to="#" className="text-green-600 hover:underline">
              Chính sách bảo mật
            </Link>{' '}
            của Website
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
