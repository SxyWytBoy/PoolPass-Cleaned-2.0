import type { PoolRow, ProfileRow, ReviewRow } from '@/types/supabase';

// Demo content used by the in-browser backend when no Supabase project is configured.

const img = (id: string, w = 1050) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const AVATAR_WOMAN = img('1438761681033-6461ffad8d80', 100);
export const AVATAR_MAN = img('1472099645785-5658abf4ff4e', 100);

export const DEMO_PASSWORD = 'poolpass123';
export const DEMO_GUEST_EMAIL = 'guest@poolpass.demo';
export const DEMO_HOST_EMAIL = 'host@poolpass.demo';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKENDS_PLUS = ['Thursday', 'Friday', 'Saturday', 'Sunday'];

export const seedProfiles: ProfileRow[] = [
  { id: 'host-emma', full_name: 'Emma Clarke', avatar_url: AVATAR_WOMAN, user_type: 'host', created_at: '2022-03-02T10:00:00Z' },
  { id: 'host-james', full_name: 'James Whitfield', avatar_url: AVATAR_MAN, user_type: 'host', created_at: '2022-07-18T10:00:00Z' },
  { id: 'host-priya', full_name: 'Priya Shah', avatar_url: null, user_type: 'host', created_at: '2023-01-09T10:00:00Z' },
  { id: 'guest-demo', full_name: 'Alex Morgan', avatar_url: null, user_type: 'guest', created_at: '2024-05-12T10:00:00Z' },
  { id: 'guest-sarah', full_name: 'Sarah Johnson', avatar_url: AVATAR_WOMAN, user_type: 'guest', created_at: '2023-04-01T10:00:00Z' },
  { id: 'guest-michael', full_name: 'Michael Thompson', avatar_url: AVATAR_MAN, user_type: 'guest', created_at: '2023-04-01T10:00:00Z' },
  { id: 'guest-chloe', full_name: 'Chloe Evans', avatar_url: null, user_type: 'guest', created_at: '2023-06-01T10:00:00Z' },
  { id: 'guest-tom', full_name: 'Tom Hughes', avatar_url: null, user_type: 'guest', created_at: '2023-06-01T10:00:00Z' },
];

const standardExtras = [
  { id: 'towels', name: 'Towel hire', price: 5 },
  { id: 'robe', name: 'Robe and slippers', price: 8 },
];

export const seedPools: PoolRow[] = [
  {
    id: '1',
    name: 'Luxury Indoor Pool & Spa',
    description:
      'A heated indoor pool with full spa facilities, tucked behind a Georgian townhouse in Kensington. Swim lengths under a glass roof, then unwind in the jacuzzi and sauna. Changing rooms with showers and hairdryers are included.',
    location: 'Kensington, London',
    price: 45,
    rating: 4.9,
    reviews: 3,
    indoor_outdoor: 'indoor',
    images: [img('1575429198097-0414ec08e8cd'), img('1551123847-4041291bec0c'), img('1572331165267-854da2b10ccc'), img('1520250497591-112f2f40a3f4')],
    image_url: img('1575429198097-0414ec08e8cd'),
    amenities: ['Heated', 'Loungers', 'Changing Rooms', 'Hot Tub/Jacuzzi', 'Sauna', 'WiFi'],
    extras: [...standardExtras, { id: 'sauna', name: 'Private sauna session', price: 15 }, { id: 'instructor', name: 'Swimming instructor (30 min)', price: 25 }],
    pool_details: { size: '15m x 5m', depth: '1.4m constant', temperature: '29°C', maxGuests: 8 },
    available_from: '08:00',
    available_to: '20:00',
    available_days: ALL_DAYS,
    is_active: true,
    host_id: 'host-emma',
    created_at: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Rooftop Infinity Pool',
    description:
      'An infinity-edge rooftop pool twelve floors above Manchester city centre. The water is heated all year and the bar serves cocktails and light bites until sunset. Daybeds can be reserved as an extra.',
    location: 'Manchester City Centre',
    price: 60,
    rating: 4.7,
    reviews: 2,
    indoor_outdoor: 'outdoor',
    images: [img('1542314831-068cd1dbfeeb'), img('1582268611958-ebfd161ef9cf'), img('1496307653780-42ee777d4833')],
    image_url: img('1542314831-068cd1dbfeeb'),
    amenities: ['Heated', 'Loungers', 'Bar Service', 'Food Available', 'Towels Provided', 'Changing Rooms'],
    extras: [{ id: 'daybed', name: 'Reserved daybed', price: 20 }, { id: 'drinks', name: 'Two welcome cocktails', price: 18 }],
    pool_details: { size: '20m x 6m', depth: '1.2m - 1.6m', temperature: '30°C', maxGuests: 20 },
    available_from: '10:00',
    available_to: '21:00',
    available_days: ALL_DAYS,
    is_active: true,
    host_id: 'host-james',
    created_at: '2023-03-04T10:00:00Z',
  },
  {
    id: '3',
    name: 'Country House Pool & Gardens',
    description:
      'A walled-garden pool at a Cotswold stone manor, with a covered terrace for rainy afternoons. Bring a picnic or order a cream tea from the house kitchen. Families are very welcome.',
    location: 'Cotswolds',
    price: 38,
    rating: 4.8,
    reviews: 2,
    indoor_outdoor: 'both',
    images: [img('1504280390367-361c6d9f38f4'), img('1465146344425-f00d5f5c8f07'), img('1501854140801-50d01698950b')],
    image_url: img('1504280390367-361c6d9f38f4'),
    amenities: ['Heated', 'Loungers', 'Changing Rooms', 'Food Available', 'Parking', 'Child Friendly'],
    extras: [...standardExtras, { id: 'creamtea', name: 'Cream tea for two', price: 12 }],
    pool_details: { size: '12m x 6m', depth: '0.9m - 1.8m', temperature: '28°C', maxGuests: 10 },
    available_from: '09:00',
    available_to: '18:00',
    available_days: WEEKENDS_PLUS,
    is_active: true,
    host_id: 'host-priya',
    created_at: '2023-04-21T10:00:00Z',
  },
  {
    id: '4',
    name: 'Boutique Hotel Swim Club',
    description:
      'A tiled basement pool with a sauna and steam room in a seafront boutique hotel, two minutes from Brighton Palace Pier. Day guests can use the spa and the hotel bar.',
    location: 'Brighton',
    price: 55,
    rating: 4.6,
    reviews: 1,
    indoor_outdoor: 'indoor',
    images: [img('1520250497591-112f2f40a3f4'), img('1531297484001-80022131f5a1'), img('1458668383970-8ddd3927deed')],
    image_url: img('1520250497591-112f2f40a3f4'),
    amenities: ['Heated', 'Sauna', 'Bar Service', 'Towels Provided', 'Changing Rooms', 'Accessible', 'WiFi'],
    extras: [{ id: 'massage', name: '30 min massage', price: 40 }, ...standardExtras],
    pool_details: { size: '10m x 4m', depth: '1.3m constant', temperature: '30°C', maxGuests: 6 },
    available_from: '07:00',
    available_to: '22:00',
    available_days: ALL_DAYS,
    is_active: true,
    host_id: 'host-james',
    created_at: '2023-06-10T10:00:00Z',
  },
  {
    id: '5',
    name: 'Modern Loft with Private Pool',
    description:
      'A converted warehouse loft in the Baltic Triangle with its own private pool, so your group has the whole space. Ideal for small celebrations, with a sound system and kitchenette.',
    location: 'Liverpool',
    price: 35,
    rating: 4.5,
    reviews: 1,
    indoor_outdoor: 'indoor',
    images: [img('1463130456064-df74d816d25c'), img('1615394717477-43fe6ee0def3'), img('1572331165267-854da2b10ccc')],
    image_url: img('1463130456064-df74d816d25c'),
    amenities: ['Heated', 'WiFi', 'Changing Rooms', 'Parking'],
    extras: standardExtras,
    pool_details: { size: '8m x 4m', depth: '1.2m constant', temperature: '29°C', maxGuests: 6 },
    available_from: '10:00',
    available_to: '22:00',
    available_days: ALL_DAYS,
    is_active: true,
    host_id: 'host-emma',
    created_at: '2023-08-02T10:00:00Z',
  },
  {
    id: '6',
    name: 'Countryside Retreat Pool',
    description:
      'A heated outdoor pool overlooking the fells near Windermere. Swim with a view of the lake, then light the barbecue on the stone terrace. Dogs are welcome on the lawn.',
    location: 'Lake District',
    price: 42,
    rating: 4.9,
    reviews: 2,
    indoor_outdoor: 'outdoor',
    images: [img('1598902108854-10e335adac99'), img('1506744038136-46273834b3fb'), img('1500375592092-40eb2168fd21'), img('1477120292453-dbba2d987c24')],
    image_url: img('1598902108854-10e335adac99'),
    amenities: ['Heated', 'Loungers', 'Parking', 'Food Available', 'Child Friendly', 'Towels Provided'],
    extras: [{ id: 'bbq', name: 'BBQ pack for four', price: 30 }, ...standardExtras],
    pool_details: { size: '14m x 5m', depth: '1.0m - 1.8m', temperature: '28°C', maxGuests: 12 },
    available_from: '09:00',
    available_to: '19:00',
    available_days: ALL_DAYS,
    is_active: true,
    host_id: 'host-priya',
    created_at: '2023-09-14T10:00:00Z',
  },
];

const review = (id: string, pool_id: string, user_id: string, rating: number, comment: string, created_at: string): ReviewRow => ({
  id, pool_id, user_id, rating, comment, created_at,
});

export const seedReviews: ReviewRow[] = [
  review('r1', '1', 'guest-sarah', 5, 'Absolutely stunning pool. The facilities were immaculate and Emma was incredibly accommodating.', '2025-10-15T10:00:00Z'),
  review('r2', '1', 'guest-michael', 5, 'The water temperature was perfect and the jacuzzi was a real treat after a long week.', '2025-09-28T10:00:00Z'),
  review('r3', '1', 'guest-chloe', 5, 'Quiet, spotless and so easy to book. We will be back for a birthday swim.', '2025-08-11T10:00:00Z'),
  review('r4', '2', 'guest-tom', 5, 'The view across the city at sunset is unreal. Cocktails were excellent.', '2025-07-20T10:00:00Z'),
  review('r5', '2', 'guest-sarah', 4, 'Brilliant spot, though it got busy after 5pm. Book a daybed.', '2025-06-02T10:00:00Z'),
  review('r6', '3', 'guest-michael', 5, 'Our kids loved it and the cream tea was the best we have had.', '2025-08-30T10:00:00Z'),
  review('r7', '3', 'guest-chloe', 5, 'Beautiful gardens and a warm, clean pool. Priya thought of everything.', '2025-07-04T10:00:00Z'),
  review('r8', '4', 'guest-tom', 5, 'Lovely little spa. The steam room is great after a swim in the sea.', '2025-05-16T10:00:00Z'),
  review('r9', '5', 'guest-sarah', 5, 'Perfect for a small party. Having the place to ourselves made it.', '2025-04-22T10:00:00Z'),
  review('r10', '6', 'guest-michael', 5, 'Swimming with the fells in view is something else. Dog-friendly too.', '2025-09-05T10:00:00Z'),
  review('r11', '6', 'guest-tom', 5, 'Warm water even on a cool day. The barbecue pack was generous.', '2025-08-19T10:00:00Z'),
];
