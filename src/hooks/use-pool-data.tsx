import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { AMENITY_OPTIONS, FALLBACK_POOL_IMAGES, getTimeSlots, TimeSlot } from '@/lib/pools';
import type { PoolDetails, PoolExtra, PoolRow, ProfileRow } from '@/types/supabase';

export interface ProcessedPoolData {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  indoor_outdoor: 'indoor' | 'outdoor' | 'both';
  images: string[];
  amenities: { name: string; included: boolean }[];
  extras: PoolExtra[];
  pool_details: PoolDetails;
  host: {
    id?: string;
    name: string;
    image: string;
    responseTime: string;
    joinedDate: string;
  };
  available_time_slots: TimeSlot[];
  available_from: string;
  available_to: string;
  available_days: string[];
  is_active: boolean;
  created_at: string;
}

const DEFAULT_DETAILS: PoolDetails = {
  size: 'Ask the host',
  depth: 'Ask the host',
  temperature: 'Ask the host',
  maxGuests: 6,
};

type PoolWithHost = PoolRow & {
  profiles: Pick<ProfileRow, 'full_name' | 'avatar_url' | 'created_at'> | null;
};

export const processPool = (data: PoolWithHost): ProcessedPoolData => {
  const offered = Array.isArray(data.amenities) ? data.amenities : [];
  // Show everything the pool offers, then the common amenities it does not.
  const amenities = [
    ...offered.map((name) => ({ name, included: true })),
    ...AMENITY_OPTIONS.filter((a) => !offered.includes(a))
      .slice(0, Math.max(0, 8 - offered.length))
      .map((name) => ({ name, included: false })),
  ];

  const images =
    Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : data.image_url
      ? [data.image_url]
      : [FALLBACK_POOL_IMAGES[data.indoor_outdoor || 'indoor']];

  const hostName = data.profiles?.full_name?.split(' ')[0] || 'your host';

  return {
    id: data.id,
    name: data.name,
    description: data.description || 'The host has not added a description yet.',
    location: data.location,
    price: Number(data.price) || 0,
    rating: Number(data.rating) || 0,
    reviews: Number(data.reviews) || 0,
    indoor_outdoor: data.indoor_outdoor || 'indoor',
    images,
    amenities,
    extras: Array.isArray(data.extras) ? data.extras : [],
    pool_details: { ...DEFAULT_DETAILS, ...(data.pool_details || {}) },
    host: {
      id: data.host_id ?? undefined,
      name: hostName,
      image: data.profiles?.avatar_url || '',
      responseTime: 'Within a few hours',
      joinedDate: data.profiles?.created_at ? format(new Date(data.profiles.created_at), 'MMMM yyyy') : '',
    },
    available_time_slots: getTimeSlots(data),
    available_from: data.available_from || '09:00',
    available_to: data.available_to || '18:00',
    available_days: data.available_days || [],
    is_active: data.is_active !== false,
    created_at: data.created_at,
  };
};

export const usePoolData = (id: string | undefined) => {
  const { data: poolData, isLoading, isError } = useQuery({
    queryKey: ['pool', id],
    queryFn: async (): Promise<ProcessedPoolData | null> => {
      const { data, error } = await supabase
        .from('pools')
        .select('*, profiles:host_id (full_name, avatar_url, created_at)')
        .eq('id', id as string)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return processPool(data as unknown as PoolWithHost);
    },
    enabled: !!id,
  });

  return {
    poolData: poolData ?? null,
    isLoading,
    isError,
  };
};
