-- Traveler testimonials, admin-managed, shown on the public homepage above FAQ.
create table if not exists testimonials (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    role text not null default '',
    quote text not null,
    avatar text not null default '',
    rating numeric not null default 5,
    is_featured boolean not null default true,
    priority numeric not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists testimonials_priority_idx on testimonials (priority desc);

alter table testimonials enable row level security;
create policy "public read testimonials" on testimonials for select using (true);
