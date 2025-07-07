/*
  # Fix operating hours for all zones

  1. Updates
    - Update all existing zones to use correct operating hours (07:00 - 21:00)
    - Add sandbox zone with walk-in configuration
    - Add is_walk_in column for proper zone type handling

  2. Operating Hours
    - available_start: 07:00:00 (7:00 AM)
    - available_end: 21:00:00 (9:00 PM)
    - Applies to all zones consistently
*/

-- Update all existing zones to correct operating hours
UPDATE zones 
SET 
  available_start = '07:00:00',
  available_end = '21:00:00',
  updated_at = now()
WHERE active = true;

-- Add is_walk_in column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'zones' AND column_name = 'is_walk_in'
  ) THEN
    ALTER TABLE zones ADD COLUMN is_walk_in boolean DEFAULT false;
  END IF;
END $$;

-- Add sandbox zone with proper walk-in configuration
INSERT INTO zones (id, name, capacity, hourly_rate, min_duration, max_duration, available_start, available_end, active, is_walk_in) VALUES
('sandbox', 'Sandbox Playground', 'Kids play zone', 5.00, 0.5, 8.0, '07:00:00', '21:00:00', true, true)
ON CONFLICT (id) DO UPDATE SET
  available_start = '07:00:00',
  available_end = '21:00:00',
  is_walk_in = true,
  updated_at = now();

-- Ensure all other zones are not walk-in
UPDATE zones 
SET is_walk_in = false, updated_at = now()
WHERE id != 'sandbox' AND (is_walk_in IS NULL OR is_walk_in = true);

-- Verify the changes
SELECT id, name, available_start, available_end, is_walk_in 
FROM zones 
WHERE active = true 
ORDER BY id;