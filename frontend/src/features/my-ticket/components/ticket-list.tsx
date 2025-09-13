import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, MapPin } from 'lucide-react';
import PageTitle from '@/components/page-title';

export default function MyTicketList() {
  const tickets = [
    {
      id: 'TCK-001',
      eventName: 'Concert BlackPink 2025',
      date: '20/10/2025',
      location: 'SVĐ Quốc gia Mỹ Đình',
      status: 'valid',
    },
    {
      id: 'TCK-002',
      eventName: 'TechConf Vietnam',
      date: '15/11/2025',
      location: 'Trung tâm Hội nghị Quốc gia',
      status: 'used',
    },
  ];

  const statusColor: Record<string, string> = {
    valid: 'bg-green-600',
    used: 'bg-gray-500',
    canceled: 'bg-red-600',
  };

  const statusText: Record<string, string> = {
    valid: 'Còn hiệu lực',
    used: 'Đã sử dụng',
    canceled: 'Đã hủy',
  };

  return (
    <div className="space-y-6">
      <PageTitle icon={<Ticket className="w-6 h-6 text-green-400" />}>
        Vé của tôi
      </PageTitle>

      <div className="grid md:grid-cols-2 gap-6">
        {tickets.map(ticket => (
          <Card
            key={ticket.id}
            className="bg-[#323234] border border-[#2a2a2c]">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-white">
                {ticket.eventName}
                <Badge className={`${statusColor[ticket.status]} text-white`}>
                  {statusText[ticket.status]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{ticket.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{ticket.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                Mã vé: <span className="font-mono">{ticket.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
