-- Persist the bespoke day-by-day itinerary submitted via the custom builder.
-- Stored as jsonb (camelCase payload, matching the app's other jsonb columns).
alter table tour_requests
    add column if not exists custom_itinerary jsonb;
