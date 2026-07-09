-- Bhutan Tourism initial schema (migrated from MongoDB collections).
-- Nested/embedded document structures are kept as jsonb; queried and
-- sorted fields get real columns.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- destinations
create table if not exists destinations (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    description text not null default '',
    image text not null default '',
    region text not null default '',
    coordinates jsonb,
    priority numeric not null default 99,
    is_entry_point boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists destinations_region_idx on destinations (region);
create index if not exists destinations_priority_idx on destinations (priority desc);

-- ---------------------------------------------------------------- experience_types
create table if not exists experience_types (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    description text not null default '',
    image text not null default '',
    display_order numeric not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- experiences
-- category holds either an experience_types id or a plain title (legacy data);
-- destinations holds an array of destination ids or slugs (legacy data).
create table if not exists experiences (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    category text,
    description text not null default '',
    image text not null default '',
    duration text,
    difficulty text,
    coordinates jsonb,
    destination_slug text,
    destinations jsonb not null default '[]'::jsonb,
    gallery jsonb not null default '[]'::jsonb,
    start_date text,
    end_date text,
    priority numeric not null default 0,
    price numeric,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists experiences_priority_idx on experiences (priority desc);

-- ---------------------------------------------------------------- hotels
-- destination / destination_id / destination_slug mirror the legacy Mongo
-- fields; the data layer resolves whichever is present against destinations.
create table if not exists hotels (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique,
    location text,
    description text not null default '',
    image text not null default '',
    destination text,
    destination_slug text,
    destination_id text,
    rating numeric not null default 5,
    amenities jsonb not null default '[]'::jsonb,
    price_range text,
    rooms numeric,
    coordinates jsonb,
    gallery jsonb not null default '[]'::jsonb,
    priority numeric not null default 0,
    price numeric,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- tours
create table if not exists tours (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    description text not null default '',
    image text not null default '',
    duration text not null default '',
    price numeric not null default 0,
    priority numeric not null default 0,
    category text,
    highlights jsonb not null default '[]'::jsonb,
    days jsonb not null default '[]'::jsonb,
    selected_cost_ids jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists tours_category_idx on tours (category);
create index if not exists tours_priority_idx on tours (priority desc);

-- ---------------------------------------------------------------- global_costs
create table if not exists global_costs (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    price numeric not null default 0,
    type text not null default 'fixed',
    is_indian_national boolean not null default false,
    traveler_category text not null default 'adult',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- tour_requests
create table if not exists tour_requests (
    id uuid primary key default gen_random_uuid(),
    first_name text not null,
    last_name text not null,
    email text not null,
    phone text not null,
    destination text,
    travel_date text not null default '',
    travelers text not null default '',
    message text not null default '',
    tour_id text,
    tour_name text,
    status text not null default 'pending',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists tour_requests_status_idx on tour_requests (status);
create index if not exists tour_requests_created_idx on tour_requests (created_at desc);

-- ---------------------------------------------------------------- about (single row)
create table if not exists about (
    id integer primary key default 1 check (id = 1),
    content jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- helpers
-- Atomic priority bump used by the plan-my-trip flow.
create or replace function increment_priority(p_table text, p_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
    affected integer;
begin
    if p_table not in ('tours', 'experiences', 'destinations', 'hotels') then
        raise exception 'increment_priority: table % not allowed', p_table;
    end if;

    execute format(
        'update %I set priority = coalesce(priority, 0) + 1, updated_at = now() where id = $1',
        p_table
    ) using p_id;

    get diagnostics affected = row_count;
    return affected > 0;
end;
$$;

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------- RLS
-- All app reads/writes go through the service-role key on the server, which
-- bypasses RLS. These policies only allow anonymous read of public content
-- if the anon key is ever used client-side; tour_requests stays private.
alter table destinations enable row level security;
alter table experience_types enable row level security;
alter table experiences enable row level security;
alter table hotels enable row level security;
alter table tours enable row level security;
alter table global_costs enable row level security;
alter table tour_requests enable row level security;
alter table about enable row level security;

create policy "public read destinations" on destinations for select using (true);
create policy "public read experience_types" on experience_types for select using (true);
create policy "public read experiences" on experiences for select using (true);
create policy "public read hotels" on hotels for select using (true);
create policy "public read tours" on tours for select using (true);
create policy "public read global_costs" on global_costs for select using (true);
create policy "public read about" on about for select using (true);
