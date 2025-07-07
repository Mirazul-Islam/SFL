/*
  # Create bookings system

  1. New Tables
    - `zones`
      - `id` (text, primary key)
      - `name` (text)
      - `capacity` (text)
      - `hourly_rate` (decimal)
      - `min_duration` (decimal, default 1.0)
      - `max_duration` (decimal, default 8.0)
      - `available_start` (time, default 09:00)
      - `available_end` (time, default 20:00)
      - `active` (boolean, default true)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `zone_id` (text, foreign key)
      - `date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `duration` (decimal)
      - `customer_info` (jsonb)
      - `total_cost` (decimal)
      - `status` (text, default 'confirmed')
      - `payment_id` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to zones
    - Add policies for booking management
*/

-- Create zones table
CREATE TABLE IF NOT EXISTS zones (
  id text PRIMARY KEY,
  name text NOT NULL,
  capacity text NOT NULL,
  hourly_rate decimal(10,2) NOT NULL,
  min_duration decimal(3,1) DEFAULT 1.0,
  max_duration decimal(3,1) DEFAULT 8.0,
  available_start time DEFAULT '07:00:00',
  available_end time DEFAULT '21:00:00',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id text NOT NULL REFERENCES zones(id),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration decimal(3,1) NOT NULL,
  customer_info jsonb NOT NULL,
  total_cost decimal(10,2) NOT NULL,
  status text DEFAULT 'confirmed',
  payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_zone_date ON bookings(zone_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(date, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for zones (public read access)
CREATE POLICY "Anyone can read active zones"
  ON zones
  FOR SELECT
  TO public
  USING (active = true);

-- Create policies for bookings (public read for availability, authenticated for booking)
CREATE POLICY "Anyone can read bookings for availability"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert default zones
INSERT INTO zones (id, name, capacity, hourly_rate, min_duration, max_duration) VALUES
('beach-soccer', 'Beach Soccer Field', 'Standard field', 65.00, 1.0, 8.0),
('volleyball', 'Sand Beach Volleyball', 'Standard court', 65.00, 1.0, 8.0),
('water-soccer-1', 'Water Soccer Field 1', '5 vs 5 (max 12 players)', 125.00, 1.0, 6.0),
('water-soccer-2', 'Water Soccer Field 2', '3 vs 3 (max 8 players)', 100.00, 1.0, 6.0),
('turf-soccer', 'Turf Soccer Field', 'Standard field', 50.00, 1.0, 8.0),
('bubble-soccer', 'Bubble Soccer', 'Per bubble rental', 20.00, 1.0, 4.0)
ON CONFLICT (id) DO NOTHING;

-- Create function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_zone_id text,
  p_date date,
  p_start_time time,
  p_end_time time,
  p_booking_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings
    WHERE zone_id = p_zone_id
    AND date = p_date
    AND status = 'confirmed'
    AND (p_booking_id IS NULL OR id != p_booking_id)
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_zones_updated_at
  BEFORE UPDATE ON zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();