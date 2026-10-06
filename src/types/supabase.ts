export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type IndoorOutdoor = 'indoor' | 'outdoor' | 'both'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type UserType = 'guest' | 'host' | 'admin'

export interface PoolExtra {
  id: string
  name: string
  price: number
}

export interface PoolDetails {
  size: string
  depth: string
  temperature: string
  maxGuests: number
}

export interface PoolRow {
  id: string
  name: string
  description: string
  location: string
  price: number
  rating: number
  reviews: number
  indoor_outdoor: IndoorOutdoor
  images: string[]
  image_url: string | null
  amenities: string[]
  extras: PoolExtra[]
  pool_details: PoolDetails
  available_from: string
  available_to: string
  available_days: string[]
  is_active: boolean
  host_id: string | null
  /** Set when this listing is the bookable version of a venue in src/lib/venues.ts. */
  venue_slug: string | null
  created_at: string
}

export interface BookingRow {
  id: string
  pool_id: string
  user_id: string
  date: string
  time_slot: string
  guests: number
  extras: string[]
  total_price: number
  status: BookingStatus
  created_at: string
}

export interface ReviewRow {
  id: string
  user_id: string
  pool_id: string
  rating: number
  comment: string
  created_at: string
}

// Profiles are publicly readable (names on reviews and bookings), so they hold no contact details.
export interface ProfileRow {
  id: string
  full_name: string | null
  avatar_url: string | null
  user_type: UserType
  created_at: string
}

export interface WaitlistRow {
  id: string
  name: string
  email: string
  user_type: 'swimmer' | 'pool_owner'
  location: string | null
  created_at: string
}

export interface HostApplicationRow {
  id: string
  pool_name: string
  location: string
  description: string | null
  price: number
  indoor_outdoor: IndoorOutdoor
  amenities: string[]
  available_from: string
  available_to: string
  available_days: string[]
  host_name: string
  host_email: string
  host_phone: string | null
  images: string[]
  venue_slug: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface ContactMessageRow {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  created_at: string
}

type Table<Row, Required extends keyof Row> = {
  Row: Row
  Insert: Partial<Row> & Pick<Row, Required>
  Update: Partial<Row>
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      pools: Table<PoolRow, 'name' | 'location' | 'price'>
      bookings: Table<BookingRow, 'pool_id' | 'user_id' | 'date' | 'time_slot' | 'total_price'>
      reviews: Table<ReviewRow, 'user_id' | 'pool_id' | 'rating' | 'comment'>
      profiles: Table<ProfileRow, 'id'>
      waitlist: Table<WaitlistRow, 'name' | 'email' | 'user_type'>
      host_applications: Table<HostApplicationRow, 'pool_name' | 'location' | 'price' | 'indoor_outdoor' | 'host_name' | 'host_email'>
      contact_messages: Table<ContactMessageRow, 'name' | 'email' | 'message'>
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
