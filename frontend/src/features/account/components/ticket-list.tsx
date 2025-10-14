import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, Loader2 } from 'lucide-react';
import PageTitle from '@/components/page-title';
import { useApi } from '@/api/hooks/useApi';
import { getMyTickets } from '@/api/ticketApi';
import { useEffect } from 'react';
import { formatDateTime } from '@/lib/formatDateTime';

export default function MyTicketList() {
  const statusColor: Record<string, string> = {
    AVAILABLE: 'bg-green-600',
    EXPIRED: 'bg-gray-500',
    CANCELED: 'bg-red-600',
  };

  const statusText: Record<string, string> = {
    AVAILABLE: 'Còn hiệu lực',
    EXPIRED: 'Đã sử dụng',
    CANCELED: 'Đã hủy',
  };

  const { exec, data, apiStatus } = useApi(getMyTickets);

  useEffect(() => {
    exec();
  }, [])


  if (apiStatus === 'PENDING') {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <PageTitle icon={<Ticket className="w-6 h-6 text-green-400" />}>
        Vé của tôi
      </PageTitle>

      <div className="grid md:grid-cols-2 gap-6">
        {data?.data && data?.data.map(ticket => (
          <Card
            key={ticket.ticketId}
            className="bg-[#323234] border border-[#2a2a2c]">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-white">
                {ticket.eventName}
                <Badge className={`${statusColor[ticket.ticketStatus]} text-white`}>
                  {statusText[ticket.ticketStatus]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDateTime(ticket.eventStartTime)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                Mã vé: <span className="font-mono">{ticket.ticketId}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
