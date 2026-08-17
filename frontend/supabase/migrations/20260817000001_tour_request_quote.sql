-- Persist the trip quote on the request. Until now the estimate was computed
-- only in the browser (custom-itinerary-builder) and thrown away at submit, so
-- an approved request carried no price anywhere. Discounts need something
-- durable to apply to, and the operator needs to see what was promised.
--
-- These are always recomputed server-side in submitTourRequest; the client's
-- numbers are never trusted.
alter table tour_requests add column if not exists quote_subtotal numeric;
alter table tour_requests add column if not exists quote_total numeric;
alter table tour_requests add column if not exists quote_currency text default 'USD';

-- 'none' | 'loyalty' | 'coupon' — which discount actually won (best-of, never stacked).
alter table tour_requests add column if not exists discount_kind text;
alter table tour_requests add column if not exists discount_percent numeric default 0;
alter table tour_requests add column if not exists discount_amount numeric default 0;
alter table tour_requests add column if not exists coupon_code text;
-- Approved prior requests for this email at submit time — the loyalty tier basis.
alter table tour_requests add column if not exists prior_trip_count integer;

-- The loyalty lookup counts prior requests for an email case-insensitively.
-- A plain index on lower(email) can't be used by PostgREST (which can only
-- filter on real columns), and `ilike` without pg_trgm falls back to a seq
-- scan — so expose the normalised value as a stored generated column and index
-- that. The data layer filters on `email_lower` directly.
alter table tour_requests
    add column if not exists email_lower text generated always as (lower(email)) stored;

create index if not exists tour_requests_email_lower_idx on tour_requests (email_lower);
