/*
  # Update maximum duration to 14 hours for all activities

  1. Changes
    - Update all zones to have max_duration = 14.0 hours
    - This allows for extended bookings and full-day events
    - Applies to all existing and future zones

  2. Security
    - No changes to RLS policies needed
*/

-- Update all zones to have 14 hour maximum duration
UPDATE zones 
SET 
  max_duration = 14.0,
  updated_at = now()
WHERE active = true;

-- Verify the changes
SELECT id, name, min_duration, max_duration 
FROM zones 
WHERE active = true 
ORDER BY id;