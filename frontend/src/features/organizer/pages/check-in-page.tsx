import TicketTypeCard from '@/features/organizer/components/ticktet-type-card';
import CheckinSummary from '../components/check-in-summary';

export default function CheckinPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <CheckinSummary
          totalCheckedIn={1235}
          totalSold={2000}
          inside={1200}
          outside={35}
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold px-2">Chi tiết hạng vé</h2>
          <TicketTypeCard name="Ticket Type 1" checkedIn={250} sold={280} />
          <TicketTypeCard name="Ticket Type 2" checkedIn={180} sold={200} />
        </div>
      </div>
    </div>
  );
}
