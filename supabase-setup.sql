-- Run this in your Supabase SQL Editor (supabase.com → project → SQL Editor)

-- 1. Create the claims table
create table public.claims (
  id uuid default gen_random_uuid() primary key,
  piece_id text not null,
  guest_name text not null,
  qty integer default 1,
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security (required by Supabase)
alter table public.claims enable row level security;

-- 3. Allow anyone to read, insert, and delete (it's a party page, no auth needed)
create policy "Anyone can read claims"
  on public.claims for select
  using (true);

create policy "Anyone can insert claims"
  on public.claims for insert
  with check (true);

create policy "Anyone can delete claims"
  on public.claims for delete
  using (true);

-- 4. Enable real-time (so guests see updates live)
alter publication supabase_realtime add table public.claims;
