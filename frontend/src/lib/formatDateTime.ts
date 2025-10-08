import { format } from 'date-fns';

export function formatDateTime(dateString?: string) {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'HH:mm dd-MM-yyyy');
  } catch {
    return '';
  }
}
