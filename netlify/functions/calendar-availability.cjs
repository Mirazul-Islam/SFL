exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { date } = event.queryStringParameters || {};
    
    if (!date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Date parameter is required' })
      };
    }

    // Mock availability data - in a real app, this would query a database
    const availableSlots = [
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM',
      '6:00 PM'
    ];

    // Simulate some booked slots
    const bookedSlots = ['12:00 PM', '3:00 PM'];
    const available = availableSlots.filter(slot => !bookedSlots.includes(slot));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ 
        date,
        availableSlots: available,
        bookedSlots 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to fetch availability' })
    };
  }
};