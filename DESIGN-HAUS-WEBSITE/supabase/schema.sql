-- ==============================================================================
-- DESIGN HAUS — Comprehensive Supabase Database Schema & Storage Configuration
-- Brand: DESIGN HAUS by Er. Nadeem Keli (Bankapur, Karnataka)
-- ==============================================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------------------
-- 1. ADMIN AUTHORIZATION ROSTER
-- ------------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Security Definer function to check admin rights with high performance
create or replace function public.is_designhaus_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

grant execute on function public.is_designhaus_admin() to authenticated;

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE (PORTFOLIO & STUDIES)
-- ------------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  category text not null check (category in ('exterior', 'interior', 'residential', 'commercial', 'other')),
  typology text default 'Residential Architecture',
  location text default 'Bankapur / Haveri, Karnataka',
  description text default '',
  image_url text not null,
  gallery_urls text[] default array[]::text[],
  is_featured boolean default false,
  is_published boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 3. SERVICES TABLE (MANAGEMENT)
-- ------------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category_number text not null,
  description text not null,
  image_url text not null,
  is_visible boolean default true,
  order_index integer default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 4. LEADS & ENQUIRIES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text default '',
  service text not null,
  location text default '',
  budget text default '',
  message text default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'closed', 'archived')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 5. TESTIMONIALS & REVIEWS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  project_title text not null,
  quote text not null,
  location text default 'Karnataka, India',
  rating integer default 5 check (rating between 1 and 5),
  is_published boolean default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.leads enable row level security;
alter table public.testimonials enable row level security;

-- Admin Users Policies
create policy "Admins can view admin roster"
  on public.admin_users for select
  to authenticated
  using (public.is_designhaus_admin());

-- Projects Policies
create policy "Public can view published projects"
  on public.projects for select
  to anon, authenticated
  using (is_published = true or public.is_designhaus_admin());

create policy "Admins manage projects"
  on public.projects for all
  to authenticated
  using (public.is_designhaus_admin())
  with check (public.is_designhaus_admin());

-- Services Policies
create policy "Public can view visible services"
  on public.services for select
  to anon, authenticated
  using (is_visible = true or public.is_designhaus_admin());

create policy "Admins manage services"
  on public.services for all
  to authenticated
  using (public.is_designhaus_admin())
  with check (public.is_designhaus_admin());

-- Leads Policies
create policy "Visitors can submit enquiries"
  on public.leads for insert
  to anon, authenticated
  with check (
    char_length(name) between 2 and 120 and
    char_length(phone) between 7 and 30 and
    char_length(service) between 2 and 150 and
    char_length(message) <= 3000
  );

create policy "Admins can view enquiries"
  on public.leads for select
  to authenticated
  using (public.is_designhaus_admin());

create policy "Admins can update enquiries"
  on public.leads for update
  to authenticated
  using (public.is_designhaus_admin())
  with check (public.is_designhaus_admin());

create policy "Admins can delete enquiries"
  on public.leads for delete
  to authenticated
  using (public.is_designhaus_admin());

-- Testimonials Policies
create policy "Public can view published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_published = true or public.is_designhaus_admin());

create policy "Admins manage testimonials"
  on public.testimonials for all
  to authenticated
  using (public.is_designhaus_admin())
  with check (public.is_designhaus_admin());

-- ------------------------------------------------------------------------------
-- 7. STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "Public can view project images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

create policy "Admins can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_designhaus_admin());

create policy "Admins can update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_designhaus_admin())
  with check (bucket_id = 'project-images' and public.is_designhaus_admin());

create policy "Admins can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_designhaus_admin());

-- ------------------------------------------------------------------------------
-- 8. INITIAL ADMIN ONBOARDING INSTRUCTIONS
-- ------------------------------------------------------------------------------
-- 1. Create your admin user in Supabase Authentication -> Users (e.g. nadeemkeli3938@gmail.com).
-- 2. Copy the resulting User UUID.
-- 3. Run the following command with the actual UUID:
--    insert into public.admin_users (user_id, email) values ('PASTE-USER-UUID-HERE', 'nadeemkeli3938@gmail.com');
