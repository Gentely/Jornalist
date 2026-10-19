-- ============================================================================
-- Journalist | منصة البحوث العلمية — Supabase schema (Auth + DB + Storage)
-- Owner: محمد احمد محمد | mohamed.bahur@gmail.com | Sabratha, Libya
-- Run in: Supabase Dashboard → SQL Editor. Then copy keys into .env.local
-- NOTE: bank account numbers are NEVER stored in the DB or any public table.
--       They live only in components/BankAccountDialog.tsx (front-end modal).
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.researches (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  short_summary text,
  research_group text,
  category text not null,
  university text not null default 'مراجعة أدبية موثقة',
  file_type text not null check (file_type in ('PDF','WORD')),
  price_lyd numeric(10,2) not null check (price_lyd >= 0),
  old_price_lyd numeric(10,2), pages int, word_count int, year int, level text not null default 'مراجعة أدبية',
  rating numeric(2,1) default 0, downloads int not null default 0,
  language text default 'العربية', abstract text, chapters jsonb default '[]',
  cover_path text,          -- Supabase Storage: covers/<slug>.jpg (public)
  file_path  text not null, -- Supabase Storage: research-files/<slug>.pdf|.docx (PRIVATE, signed URLs)
  featured boolean default false, best_seller boolean default false,
  created_at timestamptz not null default now()
);

-- For projects created with an earlier version of this schema.
alter table public.researches add column if not exists slug text unique;
alter table public.researches add column if not exists short_summary text;
alter table public.researches add column if not exists research_group text;
alter table public.researches add column if not exists word_count int;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null, phone text not null, email text not null,
  total_lyd numeric(10,2) not null,
  method text not null check (method in ('bank','whatsapp')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')), -- pending = قيد المراجعة
  receipt_path text,  -- Storage: receipts/<order-id>.jpg (PRIVATE)
  note text, created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  research_id uuid not null references public.researches(id),
  price_lyd numeric(10,2) not null
);

alter table public.profiles   enable row level security;
alter table public.researches enable row level security;
alter table public.orders     enable row level security;
alter table public.order_items enable row level security;

-- Research catalogue: public read
create policy "research public read" on public.researches for select using (true);
create policy "research admin write" on public.researches for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Orders: customers see/create their own; admins see/update all (approve/reject unlocks download)
create policy "orders insert any" on public.orders for insert with check (true);
create policy "orders owner read" on public.orders for select using (user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "orders admin update" on public.orders for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "items follow order" on public.order_items for all using (true) with check (true);
create policy "profiles self" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());

-- Storage buckets (Dashboard → Storage): 
--   covers (public), research-files (private), receipts (private)
-- Download flow: after orders.status = 'approved', the server issues a
-- short-lived signed URL for research-files/<id> so files stay protected.

-- Make the owner admin (after sign-up): 
-- update public.profiles set role='admin' where id = (select id from auth.users where email='mohamed.bahur@gmail.com');
