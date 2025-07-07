/*
  # Add blocked time slots system

  1. New Tables
    - `blocked_times`
      - `id` (uuid, primary key)
      - `zone_id` (text, nullable - null means all zones)
      - `day_of_week` (integer, 0=Sunday, 1=Monday, etc.)
      - `start_time` (time)
      - `end_time` (time)
      - `reason` (text)
      - `active` (boolean, default true)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on blocked_times table
    - Add policies for public read access

  3. Data
    - Insert Friday 12-3 PM block for all zones
*/

-- Create blocked_times table
CREATE TABLE IF NOT EXISTS blocked_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id text REFERENCES zones(id), -- null means applies to all zones
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  reason text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blocked_times_day_zone ON blocked_times(day_of_week, zone_id, active);

-- Enable RLS
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read active blocked times"
  ON blocked_times
  FOR SELECT
  TO public
  USING (active = true);

-- Insert Friday 12-3 PM block for all zones (day_of_week = 5 for Friday)
INSERT INTO blocked_times (zone_id, day_of_week, start_time, end_time, reason, active) VALUES
(NULL, 5, '12:00:00', '15:00:00', 'Weekly maintenance and staff break', true);

-- Create function to check if a time slot is blocked
CREATE OR REPLACE FUNCTION is_time_slot_blocked(
  p_zone_id text,
  p_date date,
  p_start_time time,
  p_end_time time
)
RETURNS boolean AS $$
DECLARE
  day_of_week_num integer;
BEGIN
  -- Get day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
  day_of_week_num := EXTRACT(DOW FROM p_date);
  
  -- Check if there's any blocked time that overlaps with the requested time
  RETURN EXISTS (
    SELECT 1 FROM blocked_times
    WHERE active = true
    AND day_of_week = day_of_week_num
    AND (zone_id IS NULL OR zone_id = p_zone_id) -- NULL means applies to all zones
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    )
  );
END;
$$ LANGUAGE plpgsql;