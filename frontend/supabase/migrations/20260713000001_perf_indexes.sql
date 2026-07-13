-- Performance indexes for the columns the data layer filters and orders by.
-- Complements the base indexes from the init migration (slug uniques,
-- destinations.region/priority, tours.category/priority, tour_requests.*).

-- hotels: destination lookups (getHotelsByDestination) resolve against any of
-- destination / destination_id / destination_slug, and lists order by priority.
create index if not exists hotels_destination_slug_idx on hotels (destination_slug);
create index if not exists hotels_destination_id_idx   on hotels (destination_id);
create index if not exists hotels_destination_idx       on hotels (destination);
create index if not exists hotels_priority_idx          on hotels (priority desc);

-- experiences: category filter (.in), destination_slug lookup, and the jsonb
-- `destinations` array containment used by getExperiencesByDestination.
create index if not exists experiences_category_idx         on experiences (category);
create index if not exists experiences_destination_slug_idx on experiences (destination_slug);
create index if not exists experiences_destinations_gin     on experiences using gin (destinations);
