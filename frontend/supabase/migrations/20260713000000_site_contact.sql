-- Contact details & social links managed from the admin panel (single row,
-- same shape as the `about` table).
create table if not exists site_contact (
    id integer primary key default 1 check (id = 1),
    content jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table site_contact enable row level security;

create policy "public read site_contact" on site_contact for select using (true);
