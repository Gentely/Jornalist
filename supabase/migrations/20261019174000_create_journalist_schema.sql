-- ============================================================================
-- Journalist | منصة البحوث العلمية — baseline database schema
--
-- This is the canonical production migration. When the Supabase GitHub
-- integration has "Deploy to production" enabled for the main branch, it is
-- applied automatically after this file is merged. Do not copy it manually
-- into SQL Editor.
--
-- Bank account numbers are never stored in the database. They remain only in
-- the front-end payment dialog.
-- ============================================================================

-- Private helpers used by RLS policies. This schema is intentionally not one
-- of the Data API schemas.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer'
    check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table public.researches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  short_summary text,
  research_group text,
  category text not null,
  university text not null default 'مراجعة أدبية موثقة',
  file_type text not null check (file_type in ('PDF', 'WORD')),
  price_lyd numeric(10, 2) not null check (price_lyd >= 0),
  old_price_lyd numeric(10, 2) check (old_price_lyd >= 0),
  pages integer check (pages > 0),
  word_count integer check (word_count >= 0),
  year integer check (year between 1900 and 2100),
  level text not null default 'مراجعة أدبية',
  rating numeric(2, 1) not null default 0
    check (rating between 0 and 5),
  downloads integer not null default 0 check (downloads >= 0),
  language text not null default 'العربية',
  abstract text,
  chapters jsonb not null default '[]'::jsonb
    check (jsonb_typeof(chapters) = 'array'),
  cover_path text,
  file_path text not null,
  featured boolean not null default false,
  best_seller boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text not null,
  total_lyd numeric(10, 2) not null check (total_lyd >= 0),
  method text not null check (method in ('bank', 'whatsapp')),
  -- pending = قيد المراجعة
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  receipt_path text,
  note text,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  research_id uuid not null references public.researches (id) on delete restrict,
  price_lyd numeric(10, 2) not null check (price_lyd >= 0),
  constraint order_items_order_research_unique unique (order_id, research_id)
);

create index researches_research_group_idx
  on public.researches (research_group);
create index researches_featured_idx
  on public.researches (featured) where featured;
create index orders_user_id_idx
  on public.orders (user_id);
create index orders_status_created_at_idx
  on public.orders (status, created_at desc);
create index order_items_research_id_idx
  on public.order_items (research_id);

-- Backfill a profile for any Auth user that already exists when this baseline
-- migration is first deployed.
insert into public.profiles (id, full_name, phone)
select
  users.id,
  coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name'
  ),
  users.raw_user_meta_data ->> 'phone'
from auth.users as users
on conflict (id) do nothing;

-- Authorization helpers for RLS policies. These run as the migration owner so
-- policies can verify ownership/admin status without recursive RLS lookups.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = auth.uid()
      and profile.role = 'admin'
  );
$$;

create or replace function private.can_access_order(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin() or exists (
    select 1
    from public.orders as customer_order
    where customer_order.id = p_order_id
      and customer_order.user_id = auth.uid()
  );
$$;

create or replace function private.can_add_order_item(
  p_order_id uuid,
  p_research_id uuid,
  p_price_lyd numeric
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.orders as customer_order
    join public.researches as research
      on research.id = p_research_id
    where customer_order.id = p_order_id
      and research.price_lyd = p_price_lyd
      and (
        private.is_admin()
        or (
          customer_order.status = 'pending'
          and (
            customer_order.user_id is null
            or customer_order.user_id = auth.uid()
          )
        )
      )
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.can_access_order(uuid) from public;
revoke all on function private.can_add_order_item(uuid, uuid, numeric) from public;

grant execute on function private.is_admin()
  to anon, authenticated, service_role;
grant execute on function private.can_access_order(uuid)
  to anon, authenticated, service_role;
grant execute on function private.can_add_order_item(uuid, uuid, numeric)
  to anon, authenticated, service_role;

-- Automatically create the matching public profile for every new Auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Trigger functions do not need to be directly executable by API roles.
revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Least-privilege Data API grants. RLS below narrows these table privileges to
-- the correct rows for browser clients.
revoke all on public.profiles from anon, authenticated;
revoke all on public.researches from anon, authenticated;
revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;

grant select, insert, update on public.profiles to authenticated;

grant select on public.researches to anon, authenticated;
grant insert, update, delete on public.researches to authenticated;

grant insert on public.orders to anon, authenticated;
grant select, update on public.orders to authenticated;

grant insert on public.order_items to anon, authenticated;
grant select, update, delete on public.order_items to authenticated;

grant all privileges on public.profiles to service_role;
grant all privileges on public.researches to service_role;
grant all privileges on public.orders to service_role;
grant all privileges on public.order_items to service_role;

alter table public.profiles enable row level security;
alter table public.researches enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles: a customer may access only their own row and cannot promote
-- themselves. An existing admin may keep their admin role while editing their
-- own profile; changing another user's role is done from the dashboard/server.
create policy "profiles select self"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "profiles insert self as customer"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid() and role = 'customer');

create policy "profiles update self"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and (role = 'customer' or private.is_admin())
  );

-- Research catalogue: public read, admin-only writes.
create policy "research public read"
  on public.researches
  for select
  to anon, authenticated
  using (true);

create policy "research admin insert"
  on public.researches
  for insert
  to authenticated
  with check (private.is_admin());

create policy "research admin update"
  on public.researches
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "research admin delete"
  on public.researches
  for delete
  to authenticated
  using (private.is_admin());

-- Orders may be created by a guest or signed-in customer, but browser clients
-- can create only pending orders, never pre-approved ones. Guests deliberately
-- have no SELECT access to orders/order_items, so a direct browser checkout
-- must generate the order UUID before INSERT (or use a server endpoint)
-- instead of relying on INSERT ... RETURNING.
create policy "orders insert pending"
  on public.orders
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and (
      user_id is null
      or user_id = auth.uid()
      or private.is_admin()
    )
  );

create policy "orders owner or admin read"
  on public.orders
  for select
  to authenticated
  using (user_id = auth.uid() or private.is_admin());

create policy "orders admin update"
  on public.orders
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

-- Order items cannot be listed publicly, cannot use a tampered item price,
-- and can be changed after insertion only by an admin.
create policy "order items insert for pending order"
  on public.order_items
  for insert
  to anon, authenticated
  with check (
    private.can_add_order_item(order_id, research_id, price_lyd)
  );

create policy "order items owner or admin read"
  on public.order_items
  for select
  to authenticated
  using (private.can_access_order(order_id));

create policy "order items admin update"
  on public.order_items
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "order items admin delete"
  on public.order_items
  for delete
  to authenticated
  using (private.is_admin());

-- Storage buckets are declared in supabase/config.toml. Covers are readable
-- by visitors; paid research files and transfer receipts stay admin-only at
-- the client API level. Future signed-upload/signed-download endpoints can
-- use the server-side secret key without weakening these policies.
drop policy if exists "journalist covers public read" on storage.objects;
drop policy if exists "journalist covers admin manage" on storage.objects;
drop policy if exists "journalist research files admin manage" on storage.objects;
drop policy if exists "journalist receipts admin manage" on storage.objects;

create policy "journalist covers public read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'covers');

create policy "journalist covers admin manage"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'covers' and private.is_admin())
  with check (bucket_id = 'covers' and private.is_admin());

create policy "journalist research files admin manage"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'research-files' and private.is_admin())
  with check (bucket_id = 'research-files' and private.is_admin());

create policy "journalist receipts admin manage"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'receipts' and private.is_admin())
  with check (bucket_id = 'receipts' and private.is_admin());
