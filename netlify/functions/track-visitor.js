const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to parse User Agent
const parseUserAgent = (userAgent) => {
  if (!userAgent) return { browser: 'Unknown', os: 'Unknown', deviceType: 'Unknown' };

  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Device type detection
  let deviceType = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android')) deviceType = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) deviceType = 'Tablet';
  
  return { browser, os, deviceType };
};

// Helper function to get location from IP (basic implementation)
const getLocationFromIP = async (ip) => {
  try {
    // Using a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city
      };
    }
  } catch (error) {
    console.error('Error getting location:', error);
  }
  
  return { country: null, city: null };
};

// Generate session ID
const generateSessionId = () => {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const {
      sessionId,
      pageUrl,
      pageTitle,
      referrer,
      timeOnPage,
      scrollDepth,
      eventType,
      eventData
    } = JSON.parse(event.body);

    // Get visitor information
    const ip = event.headers['x-forwarded-for'] || 
               event.headers['x-real-ip'] || 
               context.clientContext?.ip || 
               'unknown';
    
    const userAgent = event.headers['user-agent'] || '';
    const { browser, os, deviceType } = parseUserAgent(userAgent);

    let currentSessionId = sessionId;

    // If no session ID provided, create a new session
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      
      // Get location data
      const { country, city } = await getLocationFromIP(ip);
      
      // Create new visitor session
      const { error: sessionError } = await supabase
        .from('visitor_sessions')
        .insert({
          session_id: currentSessionId,
          ip_address: ip,
          user_agent: userAgent,
          country,
          city,
          device_type: deviceType,
          browser,
          os,
          referrer: referrer || null,
          landing_page: pageUrl,
          first_visit: new Date().toISOString(),
          last_visit: new Date().toISOString(),
          total_page_views: 1,
          is_bounce: true
        });

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        throw sessionError;
      }
    } else {
      // Update existing session
      const { data: existingSession } = await supabase
        .from('visitor_sessions')
        .select('total_page_views, first_visit')
        .eq('session_id', currentSessionId)
        .single();

      if (existingSession) {
        const sessionDuration = Math.floor(
          (new Date() - new Date(existingSession.first_visit)) / 1000
        );

        const { error: updateError } = await supabase
          .from('visitor_sessions')
          .update({
            last_visit: new Date().toISOString(),
            total_page_views: existingSession.total_page_views + 1,
            session_duration: sessionDuration,
            is_bounce: existingSession.total_page_views === 0 // Still bounce if this is second page
          })
          .eq('session_id', currentSessionId);

        if (updateError) {
          console.error('Error updating session:', updateError);
        }
      }
    }

    // Record page view
    if (pageUrl) {
      const { error: pageViewError } = await supabase
        .from('page_views')
        .insert({
          session_id: currentSessionId,
          page_url: pageUrl,
          page_title: pageTitle || '',
          time_on_page: timeOnPage || 0,
          scroll_depth: scrollDepth || 0
        });

      if (pageViewError) {
        console.error('Error recording page view:', pageViewError);
      }
    }

    // Record event if provided
    if (eventType) {
      const { error: eventError } = await supabase
        .from('visitor_events')
        .insert({
          session_id: currentSessionId,
          event_type: eventType,
          event_data: eventData || {},
          page_url: pageUrl
        });

      if (eventError) {
        console.error('Error recording event:', eventError);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sessionId: currentSessionId
      })
    };

  } catch (error) {
    console.error('Visitor tracking error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to track visitor',
        details: error.message
      })
    };
  }
};