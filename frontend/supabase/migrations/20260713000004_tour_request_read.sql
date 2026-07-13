-- Read/unread tracking for the admin tour-request notification bell.
-- read_at IS NULL  => unread (needs the admin's attention).
alter table tour_requests
    add column if not exists read_at timestamptz;

-- Partial index keeps the unread count/list fast as the table grows.
create index if not exists tour_requests_unread_idx
    on tour_requests (created_at desc)
    where read_at is null;

-- Backfill: anything already handled (approved/rejected/archived) is considered
-- read, so the bell starts clean. Still-pending requests remain unread.
update tour_requests
    set read_at = now()
    where read_at is null and status <> 'pending';
