import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatDateTime(dateString?: string) {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'HH:mm dd-MM-yyyy');
  } catch {
    return '';
  }
}

export function formatRangeTime(
  startTime: string | Date,
  endTime: string | Date
): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const timeRange = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;

  const datePart = format(start, "dd 'Tháng' MM, yyyy", { locale: vi });

  return `${timeRange}, ${datePart}`;
}
