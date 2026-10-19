-- Promote the site owner's account to admin without manual dashboard edits.
--
-- Effective once the owner has created an account on the site with the
-- business email below (the same email already published on the site).
-- If that Auth user does not exist yet, this statement is a harmless no-op.
-- It also creates the profile row if the signup happened before the baseline
-- trigger existed, instead of only updating an existing row.

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
