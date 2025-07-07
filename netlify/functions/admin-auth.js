const jwt = require('jsonwebtoken');

// Admin credentials (in production, use environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'splashfun2024!';
const JWT_SECRET = process.env.JWT_SECRET || 'splash-fun-land-admin-secret-key-2024';

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
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
    const { action, username, password } = JSON.parse(event.body);

    if (action === 'login') {
      // Validate credentials
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          username: ADMIN_USERNAME,
          role: 'admin',
          iat: Math.floor(Date.now() / 1000)
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': `admin_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=28800; Path=/`
        },
        body: JSON.stringify({ 
          success: true,
          message: 'Login successful'
        })
      };
    }

    if (action === 'check') {
      // Check if user is authenticated
      const cookies = event.headers.cookie || '';
      const tokenMatch = cookies.match(/admin_token=([^;]+)/);
      
      if (!tokenMatch) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Not authenticated' })
        };
      }

      try {
        const decoded = jwt.verify(tokenMatch[1], JWT_SECRET);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            authenticated: true,
            user: decoded.username
          })
        };
      } catch (jwtError) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid token' })
        };
      }
    }

    if (action === 'logout') {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': 'admin_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
        },
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action' })
    };

  } catch (error) {
    console.error('Admin auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
};