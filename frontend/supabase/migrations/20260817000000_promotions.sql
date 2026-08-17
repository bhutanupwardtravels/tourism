-- Promotions: returning-traveller (loyalty) discounts and lead-capture coupon
-- campaigns. All reads/writes go through the service-role key on the server, so
-- RLS is enabled with no public policy on the lead data (same as
-- site_operator_emails / rate_limit_hits) — promo_leads holds personal details.

-- Loyalty configuration. Singleton row, same shape as site_contact / site_faq.
-- content holds { loyaltyEnabled, tiers[], maxPercent, qualifyingStatuses[],
-- stacking, teaserText }. Tiers are thresholds: the highest tier whose
-- minPriorTrips is satisfied wins, so "4% from the 3rd trip onward" needs one
-- row rather than one per trip count.
create table if not exists site_promotions (
    id integer primary key default 1 check (id = 1),
    content jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table site_promotions enable row level security;

-- One row per banner campaign. The banner window (banner_starts_at/ends_at) is
-- separate from the coupon lifecycle (valid_days / eligible_after_days) so a
-- code can outlive the banner that issued it.
create table if not exists promo_campaigns (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    code_prefix text not null default 'BHU',
    discount_percent numeric not null default 0,
    banner_headline text not null default '',
    banner_body text not null default '',
    banner_cta_label text not null default 'Claim your code',
    banner_starts_at timestamptz,
    banner_ends_at timestamptz,
    coupon_valid_days integer not null default 180,
    coupon_eligible_after_days integer not null default 0,
    max_issued integer,
    is_active boolean not null default true,
    priority numeric not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists promo_campaigns_active_idx
    on promo_campaigns (is_active, priority desc, created_at desc);

alter table promo_campaigns enable row level security;

-- A captured lead and its issued code are 1:1, so they live in one row.
create table if not exists promo_leads (
    id uuid primary key default gen_random_uuid(),
    campaign_id uuid references promo_campaigns (id) on delete set null,
    code text not null,
    first_name text not null default '',
    last_name text not null default '',
    email text not null,
    phone text not null default '',
    country text,
    discount_percent numeric not null default 0,
    marketing_consent boolean not null default false,
    consent_at timestamptz,
    consent_text text not null default '',
    source text not null default 'banner',
    issued_at timestamptz not null default now(),
    eligible_from timestamptz,
    expires_at timestamptz,
    redeemed_at timestamptz,
    redeemed_request_id uuid references tour_requests (id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Codes are stored and compared uppercase, so a plain unique index is enough.
create unique index if not exists promo_leads_code_key on promo_leads (code);
-- One code per email per campaign.
create unique index if not exists promo_leads_campaign_email_key
    on promo_leads (campaign_id, lower(email));
create index if not exists promo_leads_email_idx on promo_leads (lower(email));
create index if not exists promo_leads_created_at_idx on promo_leads (created_at desc);
-- Drives the "follow-up due" view in the admin leads table.
create index if not exists promo_leads_unredeemed_idx
    on promo_leads (issued_at) where redeemed_at is null;

alter table promo_leads enable row level security;
