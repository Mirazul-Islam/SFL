const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    const { amount, currency = 'cad', booking_data, customer_info } = JSON.parse(event.body);

    if (!amount || amount < 50) { // Minimum 50 cents
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid amount' })
      };
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        zone_id: booking_data.zone_id || '',
        zone_name: booking_data.zone_name || '',
        date: booking_data.date || '',
        start_time: booking_data.start_time || '',
        end_time: booking_data.end_time || '',
        duration: booking_data.duration?.toString() || '',
        customer_name: customer_info.name || '',
        customer_email: customer_info.email || '',
        customer_phone: customer_info.phone || '',
        group_size: customer_info.groupSize || '',
        booking_type: 'splash_fun_land'
      },
      description: `Splash Fun Land - ${booking_data.zone_name} booking for ${customer_info.name}`,
      receipt_email: customer_info.email,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        client_secret: paymentIntent.client_secret
      })
    };

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create payment intent',
        details: error.message 
      })
    };
  }
};