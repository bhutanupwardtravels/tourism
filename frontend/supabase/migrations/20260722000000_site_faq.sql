-- FAQ content managed from the admin panel (single row, same shape as
-- `site_contact`).
create table if not exists site_faq (
    id integer primary key default 1 check (id = 1),
    content jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table site_faq enable row level security;

create policy "public read site_faq" on site_faq for select using (true);
