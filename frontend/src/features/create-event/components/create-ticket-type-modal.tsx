import React from "react";
import { useForm, } from "react-hook-form";
import { zodResolver as zodResolverLocal } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

import { tickeTypeSchema, type TicketType } from "@/features/create-event/schemas";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DateTimePicker from "./date-time-picker";

type CreateTicketTypeModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onCreate: (ticket: TicketType) => void;
};

const CreateTicketTypeModal: React.FC<CreateTicketTypeModalProps> = ({ open, setOpen, onCreate }) => {
    const form = useForm<TicketType>({
        resolver: zodResolverLocal(tickeTypeSchema),
        defaultValues: {
            name: "",
            price: "1",
            quantity: "1",
            description: "",
            maxPerUser: "1",
            minPerUser: "1",
        },
    });

    const handleSubmit = (values: TicketType) => {
        onCreate(values);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" className="hidden" />
            </DialogTrigger>

            <DialogContent className="bg-[#2d2f34] bg-gradient-to-br from-[#2d2f34] to-[#1f2023] backdrop-blur-md text-white border-none">
                <DialogHeader>
                    <DialogTitle className=" text-center font-medium mb-2">Tạo hạng vé mới</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <div className="space-y-4">
                        {/* Ticket type name*/}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="field-label required">Tên vé</FormLabel>
                                    <FormControl>
                                        <Input className="field-input" placeholder="Tên vé" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500 min-h-[20px]" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Start time */}
                            <FormField
                                control={form.control}
                                name="startSellDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="field-label required">Thời gian bắt đầu bán vé</FormLabel>
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
                                name="endSellDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="field-label required">Thời gian kết thúc bán vé</FormLabel>
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="field-label required">Giá vé</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="1" {...field} className="field-input no-spinner" />
                                        </FormControl>
                                        <FormMessage className="text-rose-500 min-h-[20px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="field-label required">Tổng số vé</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="field-input no-spinner" />
                                        </FormControl>
                                        <FormMessage className="text-rose-500 min-h-[20px]" />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="maxPerUser"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="field-label required">Số vé tối đa mỗi người</FormLabel>
                                        <Input type="number" min={1} {...field} className="field-input no-spinner" />
                                        <FormMessage className="text-rose-500 min-h-[20px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minPerUser"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="field-label required">Số vé tối thiểu mỗi lần mua</FormLabel>
                                        <Input type="number" min={1} {...field} className="field-input no-spinner" />
                                        <FormMessage className="text-rose-500 min-h-[20px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Ticket description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="field-label required">Thông tin vé</FormLabel>
                                    <FormControl>
                                        <Textarea className="field-input resize-none" placeholder="Mô tả..." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500 min-h-[20px]" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                onClick={() => form.handleSubmit(handleSubmit)()}
                                type="button"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full">
                                Lưu
                            </Button>
                        </DialogFooter>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
};



export default CreateTicketTypeModal;