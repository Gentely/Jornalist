-- Production deployment trigger with an idempotent owner-admin safety net.
--
-- The first four migrations reached `main` before the Supabase GitHub
-- integration's Working directory was corrected to ".", so none of them had
-- deployed to production (no tables, no config-declared Storage buckets).
-- Merging this file makes "Deploy to production" apply every pending
-- migration in timestamp order. This file itself only repeats the
-- owner-admin upsert from the previous migration (safe if it already ran)
-- and asks PostgREST to reload its schema cache so the new tables and
-- columns are served immediately after deployment.

insert into public.profiles (id, full_name, phone, role)
select
  users.id,
  coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name'
  ),
  users.raw_user_meta_data ->> 'phone',
  'admin'
from auth.users as users
where lower(users.email) = 'mohamed.bahur@gmail.com'
on conflict (id) do update
  set role = 'admin';

notify pgrst, 'reload schema';
