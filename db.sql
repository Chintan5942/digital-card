-- Enable pgcrypto (for gen_random_uuid) if not already enabled
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  firstName text,
  lastName text,
  businessName text,
  businessWebsite text,
  linkedin text,
  github text,
  youtube text,
  twitter text,
  instagram text,
  phone text,
  email text,
  bio text,
  location text,
  services text,
  theme text,
  avatarDataUrl text,
  qrDataUrl text,
  profileUrl text,
  avatarDataUrl text
);

-- Optional: speed up ordering/filtering by createdAt

-- Row Level Security (RLS) – keep or adjust as needed
alter table public.profiles enable row level security;

-- Allow reads for everyone using the anon key
create policy "profiles_select" on public.profiles
  for select using (true);

-- Allow inserts (and upserts) for everyone using the anon key
create policy "profiles_insert" on public.profiles
  for insert with check (true);

-- Allow updates (needed for upsert on conflict slug)
create policy "profiles_update" on public.profiles
  for update using (true) with check (true);
