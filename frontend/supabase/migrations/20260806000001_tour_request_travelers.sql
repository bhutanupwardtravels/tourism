-- Traveler breakdown and arrival/departure dates captured by the bespoke
-- trip-planner form. Previously collected client-side but silently dropped
-- before reaching the database.
alter table tour_requests
    add column if not exists adults integer,
    add column if not exists children_6_12 integer,
    add column if not exists children_under_6 integer,
    add column if not exists arrival_date date,
    add column if not exists departure_date date;
