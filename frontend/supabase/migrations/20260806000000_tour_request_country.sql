-- Country of the requester (ISO 3166-1 alpha-2, e.g. "IN", "US"), captured via
-- the bespoke trip-planner form. Replaces the old binary Indian/International
-- nationality choice so the operator can run country-level analytics later.
alter table tour_requests
    add column if not exists country text;

create index if not exists tour_requests_country_idx on tour_requests (country);
