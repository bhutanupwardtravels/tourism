-- Operator notification email(s) for tour-request alerts, managed from the
-- admin panel (single row, same shape as `site_contact`). No public read
-- policy — only the service-role client (src/lib/data/operator-emails.ts)
-- needs access; these addresses aren't rendered on the public site.
create table if not exists site_operator_emails (
    id integer primary key default 1 check (id = 1),
    content jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table site_operator_emails enable row level security;
