const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'splash-fun-land-admin-secret-key-2024';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify admin authentication
const verifyAdmin = (event) => {
  const cookies = event.headers.cookie || '';
  const tokenMatch = cookies.match(/admin_token=([^;]+)/);
  
  if (!tokenMatch) {
    throw new Error('Not authenticated');
  }

  try {
    const decoded = jwt.verify(tokenMatch[1], JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify admin authentication
    verifyAdmin(event);

    const { start_date, end_date, type } = event.queryStringParameters || {};

    if (type === 'overview') {
      // Get overview analytics using the database function
      const { data, error } = await supabase
        .rpc('get_visitor_analytics', {
          start_date: start_date || null,
          end_date: end_date || null
        });

      if (error) {
        console.error('Analytics function error:', error);
        
        // Fallback to direct query if the function fails
        const fallbackData = await getFallbackAnalytics(start_date, end_date);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(fallbackData)
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    if (type === 'realtime') {
      // Get real-time data (last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data: realtimeData, error: realtimeError } = await supabase
        .from('visitor_sessions')
        .select(`
          session_id,
          ip_address,
          country,
          city,
          device_type,
          browser,
          landing_page,
          created_at,
          page_views (
            page_url,
            created_at
          )
        `)
        .gte('created_at', twentyFourHoursAgo)
        .order('created_at', { ascending: false })
        .limit(100);

      if (realtimeError) {
        console.error('Realtime data error:', realtimeError);
        throw realtimeError;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          active_visitors: realtimeData.length,
          recent_visitors: realtimeData
        })
      };
    }

    if (type === 'events') {
      // Get recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('visitor_events')
        .select(`
          event_type,
          event_data,
          page_url,
          created_at,
          visitor_sessions (
            ip_address,
            country,
            device_type
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) throw eventsError;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(eventsData)
      };
    }

    // Default: return basic stats
    const { data: basicStats, error: statsError } = await supabase
      .from('visitor_sessions')
      .select('session_id')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (statsError) throw statsError;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        visitors_today: basicStats.length
      })
    };

  } catch (error) {
    console.error('Analytics error:', error);
    
    if (error.message === 'Not authenticated' || error.message === 'Invalid token') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to get analytics',
        details: error.message
      })
    };
  }
};

// Fallback function to get analytics data directly from tables
async function getFallbackAnalytics(startDate, endDate) {
  try {
    // Set default date range if not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Format dates for queries
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    
    // Get total visitors
    const { data: visitors, error: visitorsError } = await supabase
      .from('visitor_sessions')
      .select('session_id')
      .gte('created_at', startIso)
      .lte('created_at', endIso);
      
    if (visitorsError) throw visitorsError;
    
    // Get unique visitors by IP
    const { data: uniqueVisitors, error: uniqueError } = await supabase
      .from('visitor_sessions')
      .select('ip_address')
      .gte('created_at', startIso)
      .lte('created_at', endIso);
      
    if (uniqueError) throw uniqueError;
    
    const uniqueIps = new Set(uniqueVisitors.map(v => v.ip_address));
    
    // Get page views
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')
      .select('page_url')
      .gte('created_at', startIso)
      .lte('created_at', endIso);
      
    if (pageViewsError) throw pageViewsError;
    
    // Get bounce rate
    const { data: bounceData, error: bounceError } = await supabase
      .from('visitor_sessions')
      .select('is_bounce')
      .gte('created_at', startIso)
      .lte('created_at', endIso);
      
    if (bounceError) throw bounceError;
    
    const bounceCount = bounceData.filter(s => s.is_bounce).length;
    const bounceRate = bounceData.length > 0 ? Math.round((bounceCount / bounceData.length) * 100) : 0;
    
    // Get average session duration
    const { data: durationData, error: durationError } = await supabase
      .from('visitor_sessions')
      .select('session_duration')
      .gte('created_at', startIso)
      .lte('created_at', endIso)
      .gt('session_duration', 0);
      
    if (durationError) throw durationError;
    
    const totalDuration = durationData.reduce((sum, s) => sum + s.session_duration, 0);
    const avgDuration = durationData.length > 0 ? Math.round(totalDuration / durationData.length) : 0;
    
    // Get top pages
    const pageUrlCounts = {};
    pageViews.forEach(pv => {
      pageUrlCounts[pv.page_url] = (pageUrlCounts[pv.page_url] || 0) + 1;
    });
    
    const topPages = Object.entries(pageUrlCounts)
      .map(([page_url, views]) => ({ page_url, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    // Get device breakdown
    const { data: deviceData, error: deviceError } = await supabase
      .from('visitor_sessions')
      .select('device_type')
      .gte('created_at', startIso)
      .lte('created_at', endIso);
      
    if (deviceError) throw deviceError;
    
    const deviceCounts = {};
    deviceData.forEach(d => {
      const deviceType = d.device_type || 'Unknown';
      deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
    });
    
    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device_type, count]) => ({ device_type, count }))
      .sort((a, b) => b.count - a.count);
    
    // Get browser breakdown
    const { data: browserData, error: browserError } = await supabase
      .from('visitor_sessions')
      .select('browser')
      .gte('created_at', startIso)
      .lte('created_at', endIso);
      
    if (browserError) throw browserError;
    
    const browserCounts = {};
    browserData.forEach(b => {
      const browser = b.browser || 'Unknown';
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
    });
    
    const browserBreakdown = Object.entries(browserCounts)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count);
    
    // Return compiled analytics data
    return {
      total_visitors: visitors.length,
      total_page_views: pageViews.length,
      unique_visitors: uniqueIps.size,
      bounce_rate: bounceRate,
      avg_session_duration: avgDuration,
      top_pages: topPages,
      device_breakdown: deviceBreakdown,
      browser_breakdown: browserBreakdown,
      daily_visitors: [] // Daily breakdown would require more complex queries
    };
    
  } catch (error) {
    console.error('Fallback analytics error:', error);
    // Return empty data structure if fallback fails
    return {
      total_visitors: 0,
      total_page_views: 0,
      unique_visitors: 0,
      bounce_rate: 0,
      avg_session_duration: 0,
      top_pages: [],
      device_breakdown: [],
      browser_breakdown: [],
      daily_visitors: []
    };
  }
}