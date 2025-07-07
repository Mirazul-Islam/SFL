const validateCoupon = (code) => {
  const upperCode = code.toUpperCase();
  
  // Store coupon codes securely on the server
  const validCoupons = {
    'FREEFUN2024SECRET': { type: 'free', discount: 100, description: 'Free booking' },
    'SPLASH15-I8I9': { type: 'percentage', discount: 15, description: '15% off' },
    'SUMMER25-XC3F': { type: 'percentage', discount: 25, description: '25% off summer special' },
    'WELCOME10-X345': { type: 'percentage', discount: 10, description: '10% off welcome offer' },
    'CANADADAY': { 
      type: 'percentage', 
      discount: 50, 
      description: '50% off Canada Day special',
      minDuration: 2,
      validUntil: '2025-06-01' // Valid until July 1st, 2025
    }
  };
  
  if (validCoupons[upperCode]) {
    const coupon = validCoupons[upperCode];
    
    // Check if coupon has expired (for time-limited coupons)
    if (coupon.validUntil) {
      const expiryDate = new Date(coupon.validUntil + 'T23:59:59');
      const now = new Date();
      if (now > expiryDate) {
        return { 
          valid: false, 
          type: null, 
          discount: 0, 
          description: null,
          error: 'This coupon has expired'
        };
      }
    }
    
    return {
      valid: true,
      ...coupon
    };
  }
  
  return { valid: false, type: null, discount: 0, description: null };
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    const { couponCode, duration } = JSON.parse(event.body);

    if (!couponCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Coupon code is required' })
      };
    }

    const result = validateCoupon(couponCode);
    
    // Check minimum duration requirement for specific coupons
    if (result.valid && result.minDuration && duration && duration < result.minDuration) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: false,
          type: null,
          discount: 0,
          description: null,
          error: `This coupon requires a minimum booking of ${result.minDuration} hours`
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Coupon validation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to validate coupon',
        details: error.message 
      })
    };
  }
};