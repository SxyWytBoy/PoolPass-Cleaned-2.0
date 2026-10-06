-- PoolPass database schema for Supabase.
-- Run the whole file once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- It is safe to re-run: tables, policies and triggers are created only if missing or replaced.
--
-- Without Supabase configured, the app runs on its built-in browser demo backend instead.

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user, created automatically on sign-up)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  user_type text not null default 'guest' check (user_type in ('guest', 'host', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, user_type)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    case when new.raw_user_meta_data ->> 'user_type' = 'host' then 'host' else 'guest' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Pools
-- ---------------------------------------------------------------------------
create table if not exists public.pools (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references public.profiles (id) on delete set null,
  name text not null,
  description text not null default '',
  location text not null default '',
  price numeric(8, 2) not null check (price >= 0),
  rating numeric(2, 1) not null default 0,
  reviews integer not null default 0,
  indoor_outdoor text not null default 'outdoor' check (indoor_outdoor in ('indoor', 'outdoor', 'both')),
  images text[] not null default '{}',
  image_url text,
  amenities text[] not null default '{}',
  extras jsonb not null default '[]'::jsonb,
  pool_details jsonb not null default '{"size": "", "depth": "", "temperature": "", "maxGuests": 6}'::jsonb,
  available_from text not null default '09:00',
  available_to text not null default '18:00',
  available_days text[] not null default '{}',
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- Links a listing to a real hotel in src/lib/venues.ts. Only admins can set it (see trigger below).
alter table public.pools add column if not exists venue_slug text;
create unique index if not exists pools_venue_slug_key on public.pools (venue_slug) where venue_slug is not null;

create index if not exists pools_host_id_idx on public.pools (host_id);
create index if not exists pools_is_active_idx on public.pools (is_active);

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references public.pools (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  time_slot text not null,
  guests integer not null default 1 check (guests > 0),
  extras text[] not null default '{}',
  total_price numeric(10, 2) not null check (total_price >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_pool_id_idx on public.bookings (pool_id);

-- ---------------------------------------------------------------------------
-- Reviews (pool rating is kept up to date by a trigger)
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references public.pools (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now(),
  unique (pool_id, user_id)
);

create or replace function public.refresh_pool_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  target uuid := coalesce(new.pool_id, old.pool_id);
begin
  update public.pools p
  set rating = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r.pool_id = target), 0),
      reviews = (select count(*) from public.reviews r where r.pool_id = target)
  where p.id = target;
  return null;
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_pool_rating();

-- ---------------------------------------------------------------------------
-- Waitlist, host applications and contact messages (public forms)
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  user_type text not null check (user_type in ('swimmer', 'pool_owner')),
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.host_applications (
  id uuid primary key default gen_random_uuid(),
  pool_name text not null,
  location text not null,
  description text,
  price numeric(8, 2) not null,
  indoor_outdoor text not null check (indoor_outdoor in ('indoor', 'outdoor', 'both')),
  amenities text[] not null default '{}',
  available_from text not null default '09:00',
  available_to text not null default '18:00',
  available_days text[] not null default '{}',
  host_name text not null,
  host_email text not null,
  host_phone text,
  images text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.host_applications add column if not exists venue_slug text;

-- Stop hosts linking their listing to a real hotel they don't represent:
-- venue_slug keeps its old value unless an admin (or the service role) changes it.
create or replace function public.protect_venue_slug()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is not null
     and not exists (select 1 from public.profiles p where p.id = auth.uid() and p.user_type = 'admin') then
    if tg_op = 'INSERT' then
      new.venue_slug := null;
    else
      new.venue_slug := old.venue_slug;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists pools_protect_venue_slug on public.pools;
create trigger pools_protect_venue_slug
  before insert or update on public.pools
  for each row execute function public.protect_venue_slug();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.pools enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.waitlist enable row level security;
alter table public.host_applications enable row level security;
alter table public.contact_messages enable row level security;

-- Profiles: names are shown on reviews and bookings, so anyone can read them.
drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public" on public.profiles for select using (true);
drop policy if exists "Users create their own profile" on public.profiles;
create policy "Users create their own profile" on public.profiles for insert to authenticated
  with check (id = auth.uid() and user_type in ('guest', 'host'));
drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile" on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and user_type = (select p.user_type from public.profiles p where p.id = auth.uid()));

-- Pools: live listings are public; hosts manage their own.
drop policy if exists "Live pools are public" on public.pools;
create policy "Live pools are public" on public.pools for select using (is_active or host_id = auth.uid());
drop policy if exists "Hosts create pools" on public.pools;
create policy "Hosts create pools" on public.pools for insert to authenticated
  with check (host_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.user_type = 'host'));
drop policy if exists "Hosts update their pools" on public.pools;
create policy "Hosts update their pools" on public.pools for update to authenticated
  using (host_id = auth.uid()) with check (host_id = auth.uid());
drop policy if exists "Hosts delete their pools" on public.pools;
create policy "Hosts delete their pools" on public.pools for delete to authenticated
  using (host_id = auth.uid());

-- Bookings: guests see and create their own; hosts see bookings for their pools.
drop policy if exists "Guests and hosts read bookings" on public.bookings;
create policy "Guests and hosts read bookings" on public.bookings for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.pools p where p.id = pool_id and p.host_id = auth.uid()));
drop policy if exists "Guests create bookings" on public.bookings;
create policy "Guests create bookings" on public.bookings for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending'
    and exists (select 1 from public.pools p where p.id = pool_id and p.is_active));
drop policy if exists "Guests and hosts update bookings" on public.bookings;
create policy "Guests and hosts update bookings" on public.bookings for update to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.pools p where p.id = pool_id and p.host_id = auth.uid()));

-- Reviews: public to read; guests who booked a pool can review it once.
drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public" on public.reviews for select using (true);
drop policy if exists "Guests who booked can review" on public.reviews;
create policy "Guests who booked can review" on public.reviews for insert to authenticated
  with check (user_id = auth.uid()
    and exists (select 1 from public.bookings b where b.pool_id = reviews.pool_id and b.user_id = auth.uid()));

-- Public forms: anyone can submit; only the dashboard (service role) can read.
drop policy if exists "Allow public inserts" on public.waitlist;
create policy "Allow public inserts" on public.waitlist for insert to anon, authenticated with check (true);
drop policy if exists "Anyone can apply to host" on public.host_applications;
create policy "Anyone can apply to host" on public.host_applications for insert to anon, authenticated with check (status = 'pending');
drop policy if exists "Hosts read their own applications" on public.host_applications;
create policy "Hosts read their own applications" on public.host_applications for select to authenticated
  using (lower(host_email) = lower(auth.jwt() ->> 'email'));
drop policy if exists "Anyone can send a message" on public.contact_messages;
create policy "Anyone can send a message" on public.contact_messages for insert to anon, authenticated with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for pool photos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pool-images', 'pool-images', true)
on conflict (id) do nothing;

drop policy if exists "Pool images are public" on storage.objects;
create policy "Pool images are public" on storage.objects for select using (bucket_id = 'pool-images');
drop policy if exists "Anyone can upload pool images" on storage.objects;
create policy "Anyone can upload pool images" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'pool-images');
