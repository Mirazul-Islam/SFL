/*
  # Update zone operating hours to 7:00 AM - 9:00 PM

  1. Changes
    - Update all zones to have available_start = '07:00:00' (7:00 AM)
    - Update all zones to have available_end = '21:00:00' (9:00 PM)
    - Add sandbox zone with walk-in flag

  2. Security
    - No changes to RLS policies needed
*/

-- Update existing zones to new operating hours
UPDATE zones 
SET 
  available_start = '07:00:00',
  available_end = '21:00:00',
  updated_at = now()
WHERE active = true;

-- Add sandbox zone if it doesn't exist
INSERT INTO zones (id, name, capacity, hourly_rate, min_duration, max_duration, available_start, available_end, active) VALUES
('sandbox', 'Sandbox Playground', 'Kids play zone', 5.00, 0.5, 8.0, '07:00:00', '21:00:00', true)
ON CONFLICT (id) DO UPDATE SET
  available_start = '07:00:00',
  available_end = '21:00:00',
  updated_at = now();

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

-- Update sandbox to be walk-in only
UPDATE zones 
SET is_walk_in = true, updated_at = now()
WHERE id = 'sandbox';