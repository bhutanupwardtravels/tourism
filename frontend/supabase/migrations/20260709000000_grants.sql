-- Grant table privileges to the Supabase API roles. The init migration only
-- created tables and RLS policies; without table-level grants, PostgREST
-- requests fail with "permission denied" (42501) even when RLS would allow
-- the row. service_role bypasses RLS but still needs table privileges.

grant usage on schema public to anon, authenticated, service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

-- anon/authenticated only ever read public content (enforced by RLS policies).
grant select on all tables in schema public to anon, authenticated;

-- Cover tables created by future migrations run by the same role.
alter default privileges in schema public
  grant all privileges on tables to service_role;
alter default privileges in schema public
  grant all privileges on sequences to service_role;
alter default privileges in schema public
  grant select on tables to anon, authenticated;
