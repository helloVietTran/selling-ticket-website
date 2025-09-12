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
import { Input } from "@/components/ui/input";
import { paymentSchema, type PaymentType } from "@/features/create-event/schemas";


export default function Step4Form({
  initial,
  onNext,
  onBack,
}: {
  initial?: Partial<PaymentType>;
  onNext: (data: PaymentType) => void;
  onBack?: () => void;
}) {
  const form = useForm<PaymentType>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      accountHolder: initial?.accountHolder ?? "",
      accountNumber: initial?.accountNumber ?? "",
      bankName: initial?.bankName ?? "",
      branch: initial?.branch ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        <div className="field-container flex flex-col gap-4">
          <FormField
            control={form.control}
            name="accountHolder"
            render={({ field }) => (
              <FormItem className="flex">
                <FormLabel className="w-40 field-label required">Chủ tài khoản:</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} className="field-input"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem className="flex">
                <FormLabel className="w-40 field-label required">Số tài khoản:</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} className="field-input"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem className="flex">
                <FormLabel className="w-40 field-label required">Tên ngân hàng:</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} className="field-input"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem className="flex">
                <FormLabel className="w-40 field-label required">Chi nhánh:</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} className="field-input"/>
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
