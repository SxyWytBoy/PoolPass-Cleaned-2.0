-- Run this in the Supabase SQL Editor to create the waitlist table

create table public.waitlist (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null unique,
  user_type text not null check (user_type in ('swimmer', 'pool_owner')),
  location text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Allow anyone to insert (so the public form works)
create policy "Allow public inserts"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Only allow authenticated users (you) to read entries
create policy "Allow authenticated reads"
  on public.waitlist
  for select
  to authenticated
  using (true);
