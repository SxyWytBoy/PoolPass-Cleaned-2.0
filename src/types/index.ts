
export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  user_type: 'guest' | 'host' | 'admin';
  created_at: string;
};

export type Pool = {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  indoor_outdoor: 'indoor' | 'outdoor' | 'both';
  images: string[];
  tabImages?: {
    rooftop?: string[];
    countryhouse?: string[];
  };
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
  host_id: string;
  created_at: string;
  reviewsData?: Review[]; // Added this to allow for reviews data to be included
};

export type Review = {
  id: string;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  pool_id: string;
  user_id: string;
  created_at: string;
};

export type Booking = {
  id: string;
  pool_id: string;
  user_id: string;
  date: string;
  time_slot: string;
  extras: string[];
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
};
