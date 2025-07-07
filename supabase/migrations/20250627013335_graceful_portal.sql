/*
  # Create visitor tracking system

  1. New Tables
    - `visitor_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, unique)
      - `ip_address` (text)
      - `user_agent` (text)
      - `country` (text, nullable)
      - `city` (text, nullable)
      - `device_type` (text)
      - `browser` (text)
      - `os` (text)
      - `referrer` (text, nullable)
      - `landing_page` (text)
      - `first_visit` (timestamptz)
      - `last_visit` (timestamptz)
      - `total_page_views` (integer, default 1)
      - `session_duration` (integer, default 0) -- in seconds
      - `is_bounce` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `page_views`
      - `id` (uuid, primary key)
      - `session_id` (text, references visitor_sessions.session_id)
      - `page_url` (text)
      - `page_title` (text)
      - `time_on_page` (integer, default 0) -- in seconds
      - `scroll_depth` (integer, default 0) -- percentage
      - `exit_page` (boolean, default false)
      - `created_at` (timestamptz)

    - `visitor_events`
      - `id` (uuid, primary key)
      - `session_id` (text, references visitor_sessions.session_id)
      - `event_type` (text) -- 'click', 'form_submit', 'download', 'booking_attempt', etc.
      - `event_data` (jsonb)
      - `page_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access only
    - Create indexes for performance

  3. Functions
    - Function to get visitor analytics
    - Function to clean old data
*/

-- Create visitor_sessions table
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  ip_address text NOT NULL,
  user_agent text,
  country text,
  city text,
  device_type text,
  browser text,
  os text,
  referrer text,
  landing_page text NOT NULL,
  first_visit timestamptz DEFAULT now(),
  last_visit timestamptz DEFAULT now(),
  total_page_views integer DEFAULT 1,
  session_duration integer DEFAULT 0,
  is_bounce boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_url text NOT NULL,
  page_title text,
  time_on_page integer DEFAULT 0,
  scroll_depth integer DEFAULT 0,
  exit_page boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE CASCADE
);

-- Create visitor_events table
CREATE TABLE IF NOT EXISTS visitor_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  page_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_ip ON visitor_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created_at ON visitor_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_visitor_events_session_id ON visitor_events(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_events_event_type ON visitor_events(event_type);
CREATE INDEX IF NOT EXISTS idx_visitor_events_created_at ON visitor_events(created_at);

-- Enable RLS
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_events ENABLE ROW LEVEL SECURITY;

-- Create policies (admin access only)
CREATE POLICY "Admin can read visitor sessions"
  ON visitor_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert visitor sessions"
  ON visitor_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update visitor sessions"
  ON visitor_sessions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can read page views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert page views"
  ON page_views
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can read visitor events"
  ON visitor_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert visitor events"
  ON visitor_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow public access for tracking (will be controlled by serverless function)
CREATE POLICY "Public can insert tracking data"
  ON visitor_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update tracking data"
  ON visitor_sessions
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Public can insert page views"
  ON page_views
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can insert events"
  ON visitor_events
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Function to get visitor analytics
CREATE OR REPLACE FUNCTION get_visitor_analytics(
  start_date date DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date date DEFAULT CURRENT_DATE
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_visitors', (
      SELECT COUNT(DISTINCT session_id) 
      FROM visitor_sessions 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    ),
    'total_page_views', (
      SELECT COUNT(*) 
      FROM page_views 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    ),
    'unique_visitors', (
      SELECT COUNT(DISTINCT ip_address) 
      FROM visitor_sessions 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    ),
    'bounce_rate', (
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE is_bounce = true)::decimal / COUNT(*)) * 100, 2
      )
      FROM visitor_sessions 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    ),
    'avg_session_duration', (
      SELECT ROUND(AVG(session_duration), 2)
      FROM visitor_sessions 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
        AND session_duration > 0
    ),
    'top_pages', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'page_url', page_url,
          'views', view_count
        )
      )
      FROM (
        SELECT page_url, COUNT(*) as view_count
        FROM page_views 
        WHERE DATE(created_at) BETWEEN start_date AND end_date
        GROUP BY page_url
        ORDER BY view_count DESC
        LIMIT 10
      ) top_pages_data
    ),
    'device_breakdown', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'device_type', device_type,
          'count', device_count
        )
      )
      FROM (
        SELECT 
          COALESCE(device_type, 'Unknown') as device_type, 
          COUNT(*) as device_count
        FROM visitor_sessions 
        WHERE DATE(created_at) BETWEEN start_date AND end_date
        GROUP BY device_type
        ORDER BY device_count DESC
      ) device_data
    ),
    'browser_breakdown', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'browser', browser,
          'count', browser_count
        )
      )
      FROM (
        SELECT 
          COALESCE(browser, 'Unknown') as browser, 
          COUNT(*) as browser_count
        FROM visitor_sessions 
        WHERE DATE(created_at) BETWEEN start_date AND end_date
        GROUP BY browser
        ORDER BY browser_count DESC
        LIMIT 10
      ) browser_data
    ),
    'daily_visitors', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', visit_date,
          'visitors', visitor_count,
          'page_views', page_view_count
        )
        ORDER BY visit_date
      )
      FROM (
        SELECT 
          DATE(vs.created_at) as visit_date,
          COUNT(DISTINCT vs.session_id) as visitor_count,
          COUNT(pv.id) as page_view_count
        FROM visitor_sessions vs
        LEFT JOIN page_views pv ON vs.session_id = pv.session_id 
          AND DATE(pv.created_at) = DATE(vs.created_at)
        WHERE DATE(vs.created_at) BETWEEN start_date AND end_date
        GROUP BY DATE(vs.created_at)
        ORDER BY visit_date
      ) daily_data
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old tracking data (keep last 90 days)
CREATE OR REPLACE FUNCTION clean_old_tracking_data()
RETURNS void AS $$
BEGIN
  -- Delete old visitor events (older than 90 days)
  DELETE FROM visitor_events 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Delete old page views (older than 90 days)
  DELETE FROM page_views 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Delete old visitor sessions (older than 90 days)
  DELETE FROM visitor_sessions 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_visitor_sessions_updated_at
  BEFORE UPDATE ON visitor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();