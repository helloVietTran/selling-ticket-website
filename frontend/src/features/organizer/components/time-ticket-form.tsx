import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";


import { timeAndTicketTypeSchema, type Step2Data, type TicketForm } from "@/features/organizer/schemas";
import CreateTicketModal from "./create-event-modal";
import TicketItem from "./ticket-item";
import DateTimePicker from "./date-time-picker";


export default function Step2Form({
  initial,
  onNext,
  onBack,
}: {
  initial?: Partial<Step2Data>;
  onNext: (data: Step2Data) => void;
  onBack?: () => void;
}) {
  const form = useForm<Step2Data>({
    resolver: zodResolver(timeAndTicketTypeSchema),
    defaultValues: {
      startDate: initial?.startDate ?? "",
      endDate: initial?.endDate ?? "",
      tickets: initial?.tickets ?? [],
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateTicket = (ticket: TicketForm) => {
    // tạo id local để quản lý
    const localId = `local_${Date.now()}`;

    const normalized = {
      ...ticket,
      price: Number(ticket.price ?? 0),  // ép kiểu các field số
      quantity: Number(ticket.quantity ?? 0),
      _localId: localId,
    };

    append(normalized as any);
    setModalOpen(false);
  };

  const handleSubmit = (values: Step2Data) => {
    const cleaned: Step2Data = {
      ...values,
      tickets: values.tickets.map((t: any) => {
        // bỏ _localId vì chỉ dùng trong UI
        const { _localId, ...rest } = t;
        return rest;
      }),
    };
    onNext(cleaned);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="field-container space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Start time */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="field-label required">Thời gian bắt đầu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-foreground"
                      >
                        {field.value ? new Date(field.value).toLocaleString() : "Chọn"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                      <DateTimePicker field={field} onClose={() => { }} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="min-h-[20px]" />
                </FormItem>
              )}
            />

            {/* End time */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="field-label required">Thời gian kết thúc</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-foreground"
                      >
                        {field.value ? new Date(field.value).toLocaleString() : "Chọn"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                      <DateTimePicker field={field} onClose={() => { }} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="field-label required">Loại vé</FormLabel>

            <div className="flex justify-center mb-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(true)}
                className="bg-transparent hover:bg-transparent  text-emerald-500 font-semibold text-base hover:text-emerald-500 cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                Tạo vé mới
              </Button>
            </div>

            <CreateTicketModal
              open={modalOpen}
              setOpen={setModalOpen}
              onCreate={handleCreateTicket}
            />


            {/* Ticket list */}
            <div className="space-y-2">
              {fields.length === 0 && (
                <div className="text-sm text-gray-400 px-2">Chưa có loại vé nào.</div>
              )}
              {fields.map((f, idx) => (
                <TicketItem
                  key={f.id}
                  name={(f as any).name}
                  onRemove={() => remove(idx)}
                />
              ))}
            </div>
          </div>
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
          <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Tiếp theo
          </Button>
        </div>
      </form>
    </Form>
  );
}


