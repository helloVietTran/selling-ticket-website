import { useEffect, useRef } from 'react';
import { Camera, Check, Loader2, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import type { UpdateUserPayload } from '@/types';
import { useApi } from '@/api/hooks/useApi';
import { getMyInfo, updateMyInfo } from '@/api/userApi';

const formSchema = z.object({
  userName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  phoneNumber: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  email: z.string().email('Email không hợp lệ'),
  dob: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarFile: z.instanceof(File).nullable().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function AccountInfoCard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    data: userData,
    exec: fetchMyInfo,
    apiStatus: getStatus,
  } = useApi(getMyInfo);


  const {
    exec: executeUpdate,
    apiStatus: updateStatus,
    error: updateError,
  } = useApi(updateMyInfo);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      phoneNumber: '',
      email: '',
      dob: '',
      avatarUrl: '',
      avatarFile: null,
    },
  });

  useEffect(() => {
    fetchMyInfo();
  }, []);

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;

      form.reset({
        userName: user.userName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        avatarUrl: user.avatar || '',
      });
    }
  }, [userData, form.reset]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    form.setValue('avatarUrl', url, { shouldValidate: true });
    form.setValue('avatarFile', file, { shouldValidate: true });
  }

  async function onSubmit(values: FormSchemaType) {

    const payload: UpdateUserPayload = {
      userName: values.userName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      dob: values.dob || '',
      avatarFile: values.avatarFile,
    };

    console.log('Submit payload:', payload);

    const result = await executeUpdate(payload);

    if (result.data) {
      alert('Cập nhật thông tin thành công!');

      fetchMyInfo();
    } else {
      alert('Cập nhật thất bại. Vui lòng thử lại.');
      console.error('Update failed:', result.error || updateError);
    }
  }

  if (getStatus === 'PENDING') {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm bg-transparent text-white border-none pt-0">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="size-20">
                    {form.watch('avatarUrl') ? (
                      <AvatarImage
                        src={form.watch('avatarUrl')}
                        alt="avatar"
                      />
                    ) : (
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 -translate-y-1/4 translate-x-1/4 bg-white text-gray-700 shadow border border-gray-200 rounded-full p-2 hover:scale-105 transition"
                    aria-label="Upload avatar">
                    <Camera size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-bold mb-0">Họ và tên</Label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập họ và tên"
                        className="field-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-bold mb-0">
                      Số điện thoại
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập số điện thoại"
                        className="field-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-bold mb-0">Email</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Nhập email"
                        className="field-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-bold mb-0">
                      Ngày tháng năm sinh
                    </Label>
                    <FormControl>
                      <Input {...field} type="date" className="field-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 mt-4 py-5"
                disabled={updateStatus === 'PENDING'}>
                {updateStatus === 'PENDING' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={16} /> Hoàn thành
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}