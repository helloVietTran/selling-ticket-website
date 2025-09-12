import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { settingSchema, type SettingType } from "@/features/create-event/schemas";
import { Mail } from "lucide-react";


export default function Step3Form({
  initial,
  onNext,
  onBack,
}: {
  initial?: Partial<SettingType>;
  onNext: (data: SettingType) => void;
  onBack?: () => void;
}) {
  const form = useForm<SettingType>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      messageToReceiver: initial?.messageToReceiver ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)}>
        <div className="field-container">
          <FormField
            control={form.control}
            name="messageToReceiver"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="field-label text-lg">
                  <Mail className="mr-1 size-5" />
                  <span>Tin nhắn được gửi cho người dùng khi đặt vé thành công</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Nhập tin nhắn xác nhận..."
                      className="min-h-[160px] resize-none field-input"
                      maxLength={500}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {field.value?.length ?? 0} / 500
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end mt-6">
          {onBack && (
            <Button
              type="button"
              onClick={onBack}
              variant="ghost"
              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300"
            >
              Quay lại
            </Button>
          )}
          <Button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Tiếp theo
          </Button>
        </div>
      </form>
    </Form>
  );
}
