import { useRef } from 'react';
import { Camera, User, Check } from 'lucide-react';
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

interface AccountInfoData {
  fullName?: string;
  phoneCountry?: string;
  phoneNumber?: string;
  email?: string;
  dob?: string;
  gender?: string;
  avatar?: string;
}

interface Props {
  initialData?: AccountInfoData;
}

const formSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  phoneNumber: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  email: z.string().email('Email không hợp lệ'),
  dob: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarFile: z
    .instanceof(File)
    .nullable()
    .optional(),
});

export default function AccountInfoCard({ initialData }: Props) {
  const data: AccountInfoData = initialData || mockData;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: data.fullName || '',
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
      dob: data.dob || '',
      avatarUrl: data.avatar || '',
      avatarFile: null,
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    form.setValue('avatarUrl', url);
    form.setValue('avatarFile', file);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      fullName: values.fullName,
      phone: `+84 ${values.phoneNumber}`,
      email: values.email,
      dob: values.dob,
      avatarFile: values.avatarFile,
    };

    console.log('Submit payload:', payload);
    alert('Cập nhật thông tin thành công!');
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
                      <AvatarImage src={form.watch('avatarUrl')} alt="avatar" />
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
                name="fullName"
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
                className="w-full bg-green-600 hover:bg-green-500 mt-4 py-5">
                <span className="flex items-center justify-center gap-2">
                  <Check size={16} /> Hoàn thành
                </span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export const mockData: AccountInfoData = {
  fullName: 'Nguyễn Văn A',
  phoneCountry: '+84',
  phoneNumber: '912345678',
  email: 'nguyenvana@example.com',
  dob: '1990-05-21',
  gender: 'male',
  avatar: 'https://i.pravatar.cc/150?img=12',
};
