-- QubeLinx Supabase schema
-- Run in Supabase SQL editor when connecting a production backend.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null default '',
  avatar_url text,
  auth_provider text not null default 'email',
  email_verified boolean not null default false,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  bio text not null default '',
  profile_image text,
  location text,
  website text,
  theme text not null default 'minimal',
  background_settings jsonb not null default '{}'::jsonb,
  appearance jsonb not null default '{}'::jsonb,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9-]{3,30}$')
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null default '',
  type text not null default 'standard'
    check (type in ('standard', 'social', 'featured', 'divider', 'text')),
  description text,
  thumbnail text,
  icon text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  position integer not null default 0,
  unique (profile_id, platform)
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  link_id uuid references public.links(id) on delete set null,
  event_type text not null check (event_type in ('page_view', 'link_click')),
  created_at timestamptz not null default now(),
  meta jsonb not null default '{}'::jsonb
);

create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists links_profile_position_idx on public.links (profile_id, position);
create index if not exists analytics_profile_created_idx
  on public.analytics_events (profile_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.social_links enable row level security;
alter table public.analytics_events enable row level security;

create policy "Public profiles are readable"
  on public.profiles for select
  using (true);

create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public active links readable"
  on public.links for select
  using (
    is_active = true
    or exists (
      select 1 from public.profiles p
      where p.id = links.profile_id and p.user_id = auth.uid()
    )
  );

create policy "Users manage own links"
  on public.links for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = links.profile_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = links.profile_id and p.user_id = auth.uid()
    )
  );

create policy "Public social links readable"
  on public.social_links for select using (true);

create policy "Users manage own social links"
  on public.social_links for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = social_links.profile_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = social_links.profile_id and p.user_id = auth.uid()
    )
  );

create policy "Owners read analytics"
  on public.analytics_events for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = analytics_events.profile_id and p.user_id = auth.uid()
    )
  );

create policy "Anyone can insert analytics events"
  on public.analytics_events for insert
  with check (true);

-- Storage bucket for profile images (create via dashboard):
-- bucket: avatars, public: true
