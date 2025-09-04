import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CircleChart from "@/features/organizer/components/circle-chart";

type TicketTypeProps = {
    name: string;
    checkedIn: number;
    sold: number;
};

const TicketTypeCard = ({ name, checkedIn, sold }: TicketTypeProps) => {
    const percent = Math.round((checkedIn / sold) * 100);

    return (
        <Card className="bg-[#282629] text-white border-[#1f1d1f] relative">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <div className="absolute top-4 right-4">
                    <CircleChart
                        percent={percent}
                        size={80}
                        colors={["#10b981", "#facc15"]}
                        fontSize="0.875rem"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-bold text-emerald-400">{checkedIn} vé</p>
                <p className="text-sm text-gray-400">Đã bán {sold}</p>
            </CardContent>
        </Card>
    );
};

export default TicketTypeCard;
