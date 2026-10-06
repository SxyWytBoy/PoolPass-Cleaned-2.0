import type { BookingStatus } from '@/types/supabase';

export const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-800',
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Awaiting host',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};
