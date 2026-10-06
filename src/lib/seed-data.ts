import type { PoolRow, ProfileRow, ReviewRow } from '@/types/supabase';

// Demo content used by the in-browser backend when no Supabase project is configured.

export const DEMO_PASSWORD = 'poolpass123';
export const DEMO_GUEST_EMAIL = 'guest@poolpass.demo';
export const DEMO_HOST_EMAIL = 'host@poolpass.demo';

export const seedProfiles: ProfileRow[] = [
  { id: 'host-emma', full_name: 'Emma Clarke', avatar_url: null, user_type: 'host', created_at: '2022-03-02T10:00:00Z' },
  { id: 'guest-demo', full_name: 'Alex Morgan', avatar_url: null, user_type: 'guest', created_at: '2024-05-12T10:00:00Z' },
];

// No placeholder pools: the public listings start from the real venues in ./venues.ts,
// and pools appear here only when a host creates and publishes one.
export const seedPools: PoolRow[] = [];
export const seedReviews: ReviewRow[] = [];
