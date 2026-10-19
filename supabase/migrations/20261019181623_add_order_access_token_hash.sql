-- ============================================================================
-- Journalist — guest order tracking/download access tokens
--
-- The server order API returns a high-entropy access token to the customer
-- exactly once and stores only its SHA-256 hex digest here. A visitor who
-- checks out without an account can therefore prove ownership of one order
-- when requesting its status or a signed download URL, without exposing all
-- guest orders through the browser Data API.
-- ============================================================================

alter table public.orders
  add column if not exists access_token_hash text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_access_token_hash_format'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_access_token_hash_format
      check (
        access_token_hash is null
        or access_token_hash ~ '^[a-f0-9]{64}$'
      );
  end if;
end;
$$;

create index if not exists orders_access_token_hash_idx
  on public.orders (access_token_hash)
  where access_token_hash is not null;

comment on column public.orders.access_token_hash is
  'SHA-256 hex digest of the one-time order tracking token issued by the server API. Never store or return the plain token.';

-- Browser clients must not read token hashes through PostgREST. Authenticated
-- users keep column-level SELECT for the non-secret order fields they could
-- already access under RLS; the trusted server uses service_role and explicit
-- DTO mapping.
revoke select on public.orders from authenticated;
grant select (
  id,
  user_id,
  customer_name,
  phone,
  email,
  total_lyd,
  method,
  status,
  receipt_path,
  note,
  created_at
) on public.orders to authenticated;

-- Direct browser inserts (still allowed for a deliberately receipt-less local
-- integration) cannot set server-owned fields. The production checkout API
-- runs with service_role and is responsible for both values.
drop policy if exists "orders insert pending" on public.orders;
create policy "orders insert pending"
  on public.orders
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and access_token_hash is null
    and receipt_path is null
    and (
      user_id is null
      or user_id = auth.uid()
      or private.is_admin()
    )
  );
