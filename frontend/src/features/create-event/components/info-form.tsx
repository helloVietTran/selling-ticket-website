import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import subVn from "sub-vn";

import { Button } from "@/components/ui/button";
import { infoSchema, type InfoType } from "@/features/create-event/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "./rich-text-editor";
import { uploadImage } from "@/api/resourceApi";

export default function InfoForm({
  initial,
  onNext,
  onBack,
}: {
  initial?: Partial<InfoType>;
  onNext: (data: InfoType) => void;
  onBack?: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<InfoType>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      title: initial?.title ?? "",
      eventImage: undefined,

      category: initial?.category ?? "",
      eventInfo: initial?.eventInfo ?? `
        <p><strong>Giới thiệu sự kiện:</strong></p>
        <p>[Tóm tắt ngắn gọn về sự kiện: Nội dung chính của sự kiện...]</p>
        <p><strong>Chi tiết sự kiện:</strong></p>
        <ul>
          <li><strong>Chương trình chính:</strong> ...</li>
          <li><strong>Khách mời:</strong> ...</li>
          <li><strong>Trải nghiệm đặc biệt:</strong> ...</li>
        </ul>
        <p><strong>Điều khoản và điều kiện:</strong></p>
        <p>[TnC] sự kiện</p>
      `,

      venue: {
        province: initial?.venue?.province ?? "",
        district: initial?.venue?.district ?? "",
        ward: initial?.venue?.ward ?? "",
        street: initial?.venue?.street ?? "",
      },
      organizer: {
        organizerName: initial?.organizer?.organizerName ?? "",
        organizerInfo: initial?.organizer?.organizerInfo ?? "",
      }
    },
  });

  const [provinceCode, setProvinceCode] = useState<string>(form.getValues("venue.province") || "");
  const [districtCode, setDistrictCode] = useState<string>(form.getValues("venue.district") || "");

  const provinces = subVn.getProvinces();
  const districts = provinceCode ? subVn.getDistrictsByProvinceCode(provinceCode) : [];
  const wards = districtCode ? subVn.getWardsByDistrictCode(districtCode) : [];

  // cleanup preview URL when changes or unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: any): Promise<void> => {
    const file = e.target.files?.[0] ?? undefined;

    if (preview && typeof field.value !== 'string') URL.revokeObjectURL(preview);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }

    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await uploadImage(formData);

        if (res.data?.url) {
          field.onChange(res.data.url);
          console.log("Uploaded image URL:", res.data.url);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    } else {
      setPreview(null);
      field.onChange("");
    }
  };


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onNext(values);
        })}
      >
        {/* Upload image */}
        <div className="field-container">
          <FormField
            control={form.control}
            name="eventImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required">Ảnh sự kiện</FormLabel>
                <FormControl>
                  <div className="relative w-full max-w-3xl mx-auto">
                    <label
                      htmlFor="event-image"
                      className="flex flex-col items-center justify-center w-full aspect-[16/9] rounded-lg border border-dashed border-gray-400 bg-gray-500/80 cursor-pointer overflow-hidden relative"
                    >
                      {preview ? (
                        <div className="absolute inset-0">
                          <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center text-white">
                          <ImagePlus className="w-10 h-10 text-emerald-400 mb-2" />
                          <p className="text-base">Thêm ảnh nền sự kiện</p>
                        </div>
                      )}

                      <input
                        id="event-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadImage(e, field)}
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />

          {/* Tiêu đề */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required mt-5">Tên sự kiện</FormLabel>
                <FormControl>
                  <Input className="field-input" {...field} />
                </FormControl>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="field-container grid grid-cols-2 gap-4">
          {/* Province */}
          <FormField
            control={form.control}
            name="venue.province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required">Tỉnh/Thành</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setProvinceCode(value);
                    // reset district + ward when province change
                    form.setValue("venue.district", "");
                    form.setValue("venue.ward", "");
                    setDistrictCode("");
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full field-input">
                      <SelectValue placeholder="Chọn Tỉnh/Thành" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((p: any) => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />

          {/* District */}
          <FormField
            control={form.control}
            name="venue.district"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required">Quận/Huyện</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setDistrictCode(value);
                    form.setValue("venue.ward", "");
                  }}
                  disabled={!provinceCode}
                >
                  <FormControl>
                    <SelectTrigger className="w-full field-input">
                      <SelectValue placeholder="Chọn Quận/Huyện" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((d: any) => (
                      <SelectItem key={d.code} value={d.code}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />

          {/* Ward */}
          <FormField
            control={form.control}
            name="venue.ward"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label">Phường/Xã</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!districtCode}
                >
                  <FormControl>
                    <SelectTrigger className="w-full field-input">
                      <SelectValue placeholder="Chọn Phường/Xã" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wards.map((w: any) => (
                      <SelectItem key={w.code} value={w.code}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />

          {/* Street */}
          <FormField
            control={form.control}
            name="venue.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required">Số nhà, đường</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Số nhà, đường" maxLength={80} className="field-input" />
                </FormControl>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <div className="field-container">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required">Thể loại sự kiện</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="field-input w-full">
                      <SelectValue placeholder="Chọn thể loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">Âm nhạc</SelectItem>
                      <SelectItem value="sport">Thể thao</SelectItem>
                      <SelectItem value="art">Nghệ thuật</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Event Info */}
        <div className="field-container">
          <FormField
            control={form.control}
            name="eventInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required">Thông tin sự kiện</FormLabel>
                <FormControl>
                  <RichTextEditor content={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Organizer */}
        <div className="field-container space-y-6">
          <FormField
            control={form.control}
            name="organizer.organizerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required">Tên ban tổ chức</FormLabel>
                <FormControl>
                  <Input className="field-input w-full" placeholder="Nhập tên ban tổ chức" {...field} />
                </FormControl>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizer.organizerInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label required">Thông tin ban tổ chức</FormLabel>
                <FormControl>
                  <Textarea className="field-input w-full" placeholder="Nhập thông tin ban tổ chức" rows={3} {...field} />
                </FormControl>
                <FormMessage className="text-sm font-semibold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          {onBack && (
            <Button type="button" onClick={onBack} variant="ghost" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300">
              Quay lại
            </Button>
          )}
          <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Tiếp theo
          </Button>
        </div>
      </form>
    </Form>
  );
}
