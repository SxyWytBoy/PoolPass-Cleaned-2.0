import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
  extras: { id: string; name: string; price: number }[];
  pool_details: {
    size: string;
    depth: string;
    temperature: string;
    maxGuests: number;
  };
  host: {
    id?: string;
    name: string;
    image: string;
    responseTime: string;
    joinedDate: string;
  };
  available_time_slots: { id: string; time: string }[];
  available_from?: string;
  available_to?: string;
  available_days?: string[];
  is_active: boolean;
  created_at: string;
}

const poolDataFallback: ProcessedPoolData = {
  id: "1",
  name: "Luxury Indoor Pool & Spa",
  description: "A stunning heated indoor pool with full spa facilities in the heart of Kensington.",
  location: "Kensington, London",
  price: 45,
  rating: 4.9,
  reviews: 128,
  indoor_outdoor: "indoor",
  images: [
    "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1050&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1050&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1050&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1050&q=80&auto=format&fit=crop",
  ],
  amenities: [
    { name: "Heated Pool", included: true },
    { name: "Loungers", included: true },
    { name: "Towels", included: false },
    { name: "Changing Room", included: true },
    { name: "Jacuzzi", included: true },
    { name: "Sauna", included: false },
    { name: "Parking", included: true },
    { name: "WiFi", included: true },
  ],
  extras: [
    { id: "towels", name: "Towels", price: 5 },
    { id: "sauna", name: "Sauna Session", price: 15 },
    { id: "drinks", name: "Welcome Drinks", price: 8 },
    { id: "instructor", name: "Swimming Instructor (30 min)", price: 25 },
  ],
  pool_details: {
    size: "15m x 5m",
    depth: "1.4m constant",
    temperature: "29°C",
    maxGuests: 8
  },
  host: {
    id: "host-1",
    name: "Emma",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&auto=format&fit=crop",
    responseTime: "Within an hour",
    joinedDate: "March 2022"
  },
  available_time_slots: [
    { id: "full-day", time: "Full Day Access" },
  ],
  available_from: "08:00",
  available_to: "20:00",
  available_days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
  is_active: true,
  created_at: "2023-01-15",
};

export const usePoolData = (id: string | undefined) => {
  const { data: poolData, isLoading } = useQuery({
    queryKey: ['pool', id],
    queryFn: async (): Promise<ProcessedPoolData> => {
      try {
        const { data, error } = await supabase
          .from('pools')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return poolDataFallback;

        // Normalise amenities — stored as string[] in Supabase,
        // but the detail page expects { name, included }[]
        const amenities = Array.isArray(data.amenities)
          ? data.amenities.map((a: string) => ({ name: a, included: true }))
          : [];

        // Build images array — prefer the images[] column, fall back to image_url
        const images: string[] =
          Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : data.image_url
            ? [data.image_url]
            : [];

        return {
          ...poolDataFallback,
          ...data,
          amenities,
          images,
          extras: Array.isArray(data.extras) ? data.extras : poolDataFallback.extras,
          pool_details: data.pool_details || poolDataFallback.pool_details,
          host: poolDataFallback.host,
          available_time_slots: [{ id: "full-day", time: "Full Day Access" }],
        };
      } catch (err) {
        console.error("Error fetching pool:", err);
        return poolDataFallback;
      }
    },
    enabled: !!id,
  });

  return {
    poolData: poolData ?? poolDataFallback,
    isLoading,
  };
};

export { poolDataFallback };
