import { supabase } from '@/lib/supabase';
import type { PoolRow } from '@/types/supabase';

export const AMENITY_OPTIONS = [
  'Heated',
  'Loungers',
  'Towels Provided',
  'Food Available',
  'Changing Rooms',
  'Hot Tub/Jacuzzi',
  'Sauna',
  'WiFi',
  'Bar Service',
  'Parking',
  'Accessible',
  'Child Friendly',
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const FALLBACK_POOL_IMAGES = {
  indoor: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  outdoor: 'https://images.unsplash.com/photo-1477120292453-dbba2d987c24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  both: 'https://images.unsplash.com/photo-1615394717477-43fe6ee0def3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
} as const;

export interface TimeSlot {
  id: string;
  time: string;
  /** Fraction of the day price charged for this slot. */
  priceFactor: number;
}

/** Access options offered for a pool, derived from its opening hours. */
export const getTimeSlots = (pool: Pick<PoolRow, 'available_from' | 'available_to'>): TimeSlot[] => {
  const from = pool.available_from || '09:00';
  const to = pool.available_to || '18:00';
  const slots: TimeSlot[] = [{ id: 'full-day', time: `Full day (${from} - ${to})`, priceFactor: 1 }];
  if (from < '13:00' && to > '13:00') {
    slots.push({ id: 'morning', time: `Morning (${from} - 13:00)`, priceFactor: 0.6 });
    slots.push({ id: 'afternoon', time: `Afternoon (13:00 - ${to})`, priceFactor: 0.6 });
  }
  return slots;
};

export const poolImage = (pool: Pick<PoolRow, 'images' | 'image_url' | 'indoor_outdoor'>) =>
  pool.images?.[0] || pool.image_url || FALLBACK_POOL_IMAGES[pool.indoor_outdoor || 'indoor'];

export const isOpenOn = (pool: Pick<PoolRow, 'available_days'>, date: Date) => {
  if (!pool.available_days || pool.available_days.length === 0) return true;
  const day = DAYS_OF_WEEK[(date.getDay() + 6) % 7];
  return pool.available_days.includes(day);
};

/** Formats a Date as yyyy-mm-dd in local time (toISOString would shift it to UTC). */
export const toDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseDateString = (value: string | null) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const formatPrice = (amount: number) =>
  `£${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;

export const fetchActivePools = async (): Promise<PoolRow[]> => {
  const { data, error } = await supabase
    .from('pools')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PoolRow[];
};
