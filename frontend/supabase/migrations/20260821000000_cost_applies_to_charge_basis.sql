-- Two fixes to how global_costs are priced.
--
-- 1. `applies_to` replaces the `is_indian_national` binary. The old flag forced
--    every cost to belong to exactly one nationality, so an Indian national got
--    the Indian SDF but lost the guide fee and any other charge that applies to
--    everyone. Backfilled from the boolean, so existing rows keep their meaning.
--
-- 2. `charge_basis` marks the costs that are charged once for the whole party
--    (guide, driver) rather than per traveller. Everything defaults to
--    per_person, which is what the code did unconditionally before.

alter table global_costs
    add column if not exists applies_to text not null default 'international',
    add column if not exists charge_basis text not null default 'per_person';

-- One-time backfill: everything else is already 'international' by default.
update global_costs
   set applies_to = 'indian'
 where is_indian_national
   and applies_to = 'international';

alter table global_costs
    drop constraint if exists global_costs_applies_to_check,
    add constraint global_costs_applies_to_check
        check (applies_to in ('everyone', 'indian', 'international'));

alter table global_costs
    drop constraint if exists global_costs_charge_basis_check,
    add constraint global_costs_charge_basis_check
        check (charge_basis in ('per_person', 'per_group'));

-- `is_indian_national` is left in place for one release: the app reads it only
-- as a fallback for rows written before this migration ran. Drop it once every
-- deployment is on the new column.

-- The guide (and a driver, when one is added) is a single person hired for the
-- party, and an Indian national needs one just as much as anyone else. The
-- backfill above would have left it international/per-person, which is the pair
-- of bugs this migration exists to fix, so correct it here.
update global_costs
   set applies_to = 'everyone',
       charge_basis = 'per_group'
 where title in ('Guide Fee', 'Driver Fee');
