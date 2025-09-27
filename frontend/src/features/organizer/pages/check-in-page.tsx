import CheckinSummary from '@/features/organizer/components/check-in-summary';
import CheckinTable from '@/features/organizer/components/checkin-table';

export default function CheckinPage() {

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold px-2">Check in</h1>
        <CheckinSummary
          totalCheckedIn={1235}
          totalSold={2000}
          inside={1200}
          outside={35}
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold px-2">Chi tiết hạng vé</h2>
          <CheckinTable />
        </div>
      </div>
    </div>
  );
}
