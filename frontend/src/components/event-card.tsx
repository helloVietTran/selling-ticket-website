import { Calendar } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

type EventCardProps = {
    title: string;
    price: string;
    date: string;
    img: string;
    href?: string;
};

const EventCard: React.FC<EventCardProps> = ({ title, price, date, img, href = "#" }) => {
    return (
        <Link
            to={href}
            className=" shadow-md hover:-translate-y-1 transition-transform duration-300 cursor-pointer text-white no-underline"
        >
            <img src={img} alt={title} className="w-full h-44 object-cover rounded-lg" />
            <div className="p-4">
                <div className="font-bold text-base mb-2">{title}</div>
                <div className="text-green-500 font-semibold mb-2">Từ {price}</div>
                <div className="flex items-center text-sm text-gray-300">
                    <span className="mr-2 "><Calendar className="size-5" /></span>
                    {date}
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
