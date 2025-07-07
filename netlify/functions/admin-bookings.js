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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    // Verify admin authentication
    verifyAdmin(event);

    if (event.httpMethod === 'GET') {
      // Get all bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'POST') {
      const { action, bookingId, updates } = JSON.parse(event.body);

      if (action === 'cancel') {
        // Cancel a booking
        const { data, error } = await supabase
          .from('bookings')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId)
          .select()
          .single();

        if (error) throw error;

        // Send cancellation email to customer
        try {
          await fetch(`${event.headers.origin || 'https://splashfunland.com'}/.netlify/functions/send-cancellation-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              booking: data,
              reason: 'Administrative cancellation'
            })
          });
        } catch (emailError) {
          console.error('Failed to send cancellation email:', emailError);
          // Don't fail the cancellation if email fails
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            booking: data
          })
        };
      }

      if (action === 'update') {
        // Update booking details
        const { data, error } = await supabase
          .from('bookings')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId)
          .select()
          .single();

        if (error) throw error;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            booking: data
          })
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Admin bookings error:', error);
    
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
        error: 'Failed to process request',
        details: error.message
      })
    };
  }
};