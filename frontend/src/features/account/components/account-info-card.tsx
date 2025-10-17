import { useEffect, useRef } from 'react'; // gọi api, cập nhật dữ liệu
import { Camera, Check, Loader2, User } from 'lucide-react'; // icon
import { useForm } from 'react-hook-form'; // form
import { z } from 'zod'; // validate schema
import { zodResolver } from '@hookform/resolvers/zod'; // tích hợp zod với react-hook-form
// ui components
import { Card, CardContent } from '@/components/ui/card'; // card
import { Button } from '@/components/ui/button'; // button
import { Input } from '@/components/ui/input'; // input
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; //  avatar
import { Label } from '@/components/ui/label'; // label
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'; // form ui

import type { UpdateUserPayload } from '@/types'; // type khi update database
import { useApi } from '@/api/hooks/useApi';// custom hook gọi api
import { getMyInfo, updateMyInfo } from '@/api/userApi';// api user
// validate form schema
const formSchema = z.object({
  userName: z.string().min(1, 'Vui lòng nhập họ và tên'), 
  phoneNumber: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  email: z.string().email('Email không hợp lệ'),
  dob: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarFile: z.instanceof(File).nullable().optional(),
}); // file có thể null

// infer type từ schema

type FormSchemaType = z.infer<typeof formSchema>; // lấy type từ schema
// component

export default function AccountInfoCard() { // khai báo components chính hiển thị thông tin tài khoản
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ref để click vào input file

  // gọi api lấy thông tin user
  const {
    data: userData,
    exec: fetchMyInfo,
    apiStatus: getStatus,
  } = useApi(getMyInfo);
// gọi api cập nhật thông tin user

  const {
    exec: executeUpdate,
    apiStatus: updateStatus,
    error: updateError,
  } = useApi(updateMyInfo);
// khởi tạo form với react-hook-form và zod
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
// lấy dữ liệu người dùng khi component mount
  useEffect(() => {
    fetchMyInfo();
  }, []);
// khi userData thay đổi, reset form với dữ liệu mới
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;

      form.reset({
        userName: user.userName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '', // định dạng yyyy-mm-dd
        avatarUrl: user.avatar || '', // avatarUrl từ database
      });
    }
  }, [userData, form.reset]);
// xử lý khi chọn file ảnh
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0]; // lấy file đầu tiên
    if (!file) return;

    const url = URL.createObjectURL(file); // tạo url tạm thời để hiển thị ảnh
    // cập nhật giá trị vào form
    form.setValue('avatarUrl', url, { shouldValidate: true }); // hiển thị ảnh ngay
    form.setValue('avatarFile', file, { shouldValidate: true }); // lưu file để gửi lên server
  }
// xử lý submit form
  async function onSubmit(values: FormSchemaType) {
// tạo đối tượng chứa dữ liệu để gửi lên server
    const payload: UpdateUserPayload = {
      userName: values.userName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      dob: values.dob || '',
      avatarFile: values.avatarFile,
    };
// debug đối tượng chứa dữ liệu
    console.log('Submit payload:', payload);

    const result = await executeUpdate(payload); // gọi api cập nhật
// nếu thành công, thông báo và tải lại thông tin

    if (result.data) {
      alert('Cập nhật thông tin thành công!');

      fetchMyInfo();
    } else {
      alert('Cập nhật thất bại. Vui lòng thử lại.');
      console.error('Update failed:', result.error || updateError);
    }
  }
// hiển thị loader khi đang tải dữ liệu
  if (getStatus === 'PENDING') {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }
// hiển thị form
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm bg-transparent text-white border-none pt-0">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> {/* chỉ gọi khi onSubmit hợp lệ */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="size-20">
                    {form.watch('avatarUrl') ? ( // nếu có avatarUrl thì hiển thị ảnh, không thì hiển thị icon user
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
                    onClick={() => fileInputRef.current?.click()} // click vào input file khi nhấn nút camera
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
                  /> {/*input file ẩn */}
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
                    <FormMessage /> {/* hiển thị lỗi nếu có */}
                  </FormItem> /* form item cho userName */
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