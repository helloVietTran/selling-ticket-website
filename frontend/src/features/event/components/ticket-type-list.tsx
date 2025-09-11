import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TicketType {
    name: string;
    price: string;
}

interface Ticket {
    id: string;
    time: string;
    soldOut?: boolean;
    types: TicketType[];
}

interface TicketTypeListProps {
    tickets: Ticket[];
}

export default function TicketTypeList({ tickets }: TicketTypeListProps) {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggleDetails = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <Card className="bg-neutral-900 text-white rounded-2xl shadow-md border border-neutral-800 w-full max-w-3xl">
            <div className="px-6 text-lg font-semibold">
                Thông tin vé
            </div>

            {tickets.map((ticket) => (
                <div key={ticket.id} className="border-t border-neutral-800">
                    {/* Ticket Item */}
                    <div
                        className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-neutral-800/60"
                        onClick={() => toggleDetails(ticket.id)}
                    >
                        <div className="flex items-center gap-3">
                            <ChevronRight
                                className={`w-5 h-5 transition-transform ${openId === ticket.id ? "rotate-90" : ""
                                    }`}
                            />
                            <span>{ticket.time}</span>
                        </div>
                        {ticket.soldOut ? (
                            <Button
                                disabled
                                className="bg-white text-black font-semibold cursor-not-allowed"
                            >
                                Hết vé
                            </Button>
                        ) : (
                            <Button className="bg-emerald-500 hover:bg-emerald-600 font-semibold text-white">
                                Mua vé ngay
                            </Button>
                        )}
                    </div>

                    {/* Ticket Details */}
                    {openId === ticket.id && (
                        <CardContent className="bg-neutral-800 px-6 py-4 space-y-3">
                            {ticket.types.map((type, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between text-sm text-neutral-200"
                                >
                                    <span>{type.name}</span>
                                    <span className="font-semibold text-emerald-400">
                                        {type.price}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    )}
                </div>
            ))}
        </Card>
    );
}
