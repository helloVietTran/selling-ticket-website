import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { ChartColumn } from 'lucide-react';

import RevenueChart from '@/features/organizer/components/revenue-chart';
import CircleChart from '@/features/organizer/components/circle-chart';
import SectionHeader from '../components/section-header';
import { useApi } from '@/api/hooks/useApi';
import { statsRevenue } from '@/api/revenueApi';
import { formatVND } from '@/lib/formatVND';
import { statsTickets } from '@/api/ticketApi';

export default function RevenuePage() {
  const { eventId } = useParams();

  const { data: predictRevenueData, exec: fetchPredictRevenue } = useApi(
    statsRevenue
  );
  const { data: statsTicketData, exec: fetchStatsTicketData } = useApi(
    statsTickets
  );

  useEffect(() => {
    if (eventId) {
      fetchPredictRevenue(eventId);
      fetchStatsTicketData(eventId);
    }
  }, []);

  const predictRevenue = predictRevenueData?.data;
  const statsTicket = statsTicketData?.data;

  return (
    <>
      <SectionHeader
        title="Tổng quan"
        eventId={eventId || ''}
        icon={ChartColumn}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-[#282629] text-white border-[#1f1d1f]">
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col gap-4">
              <span>Doanh thu</span>
              <p className="text-xl font-bold">
                {predictRevenue?.realityRevenue &&
                  formatVND(predictRevenue?.realityRevenue)}
              </p>
              <p className="text-gray-400">
                Dự kiến:{' '}
                {predictRevenue?.predictRevenue &&
                  formatVND(predictRevenue?.predictRevenue)}
              </p>
            </div>
            {predictRevenue && (
              <CircleChart
                percent={predictRevenue.percentage}
                size={96}
                colors={['#22c55e', '#facc15']}
                fontSize="1rem"
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#282629] text-white border-[#1f1d1f]">
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col gap-4">
              <span>Số lượng vé đã bán</span>
              <p className="text-xl font-bold">{statsTicket?.totalSold}</p>
              <p className="text-gray-400">
                Tổng: {statsTicket?.predictTicketSold} vé
              </p>
            </div>
            {statsTicket && (
              <CircleChart
                percent={statsTicket.percentage}
                size={96}
                colors={['#3b82f6', '#e5e7eb']}
                fontSize="1rem"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <RevenueChart />
    </>
  );
}
