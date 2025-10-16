import { useParams } from 'react-router-dom';

import CheckinSummary from '@/features/organizer/components/check-in-summary';
import CheckinTable from '@/features/organizer/components/checkin-table';
import SectionHeader from '../components/section-header';
import { TicketCheck } from 'lucide-react';
import { useApi } from '@/api/hooks/useApi';
import { statsTickets } from '@/api/ticketApi';
import { useEffect } from 'react';

export default function CheckinPage() {
  const { eventId } = useParams();
  const { exec, data } = useApi(statsTickets);

  useEffect(() => {
    if (eventId) {
      exec(eventId);
    }
  }, [eventId]);

  const statsTicketData = data?.data;
  return (
    <>
      <div className="mt-16">
        <SectionHeader
          title="Check in"
          eventId={eventId || ''}
          icon={TicketCheck}
        />
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold px-2">Check in</h1>
        {statsTicketData && (
          <CheckinSummary
            totalCheckedIn={statsTicketData.totalCheckedIn}
            totalSold={statsTicketData.totalSold}
            inside={statsTicketData.totalCheckedIn} // fake data
            outside={0}
          />
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold px-2">Chi tiết hạng vé</h2>
          <CheckinTable />
        </div>
      </div>
    </>
  );
}
