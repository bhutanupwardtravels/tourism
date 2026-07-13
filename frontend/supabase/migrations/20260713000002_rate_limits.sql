-- Sliding-window rate limiting for public form submissions.
-- Each row is one "hit" for a bucket (e.g. "tour_request:<ip>"). The app counts
-- recent hits within a window before allowing a new submission.
create table if not exists rate_limit_hits (
    id uuid primary key default gen_random_uuid(),
    bucket text not null,
    created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_bucket_created_idx
    on rate_limit_hits (bucket, created_at desc);

-- Written only via the service-role client (server-side); never exposed to anon.
alter table rate_limit_hits enable row level security;
