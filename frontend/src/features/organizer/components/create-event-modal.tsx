import React from "react";
import { useForm, } from "react-hook-form";
import { zodResolver as zodResolverLocal } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

import { ticketSchema, type TicketForm } from "@/features/organizer/schemas";
import DateTimePicker from "./date-time-picker";

type CreateTicketModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onCreate: (ticket: TicketForm) => void;
};

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ open, setOpen, onCreate }) => {
    const form = useForm<TicketForm>({
        resolver: zodResolverLocal(ticketSchema),
        defaultValues: {
            name: "",
            price: "0",
            quantity: "1",
            startDate: "",
            endDate: "",
            description: "",
        },
    });

    const handleSubmit = (values: TicketForm) => {
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
                    <DialogTitle className=" text-center font-medium mb-2">Tạo loại vé mới</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="field-label required">Giá vé</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} className="field-input no-spinner" />
                                        </FormControl>
                                        <FormMessage />
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        {/* Thời gian */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thời gian bắt đầu</FormLabel>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thời gian kết thúc</FormLabel>
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
                                        <FormMessage />
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white w-full">
                                Lưu
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};



export default CreateTicketModal;