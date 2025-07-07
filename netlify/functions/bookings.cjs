const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, phone, date, time, partySize, playZone, specialRequests } = JSON.parse(event.body);

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email to business
    const businessMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.BUSINESS_EMAIL,
      subject: 'New Booking Request - Splash Fun Land',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Party Size:</strong> ${partySize}</p>
        <p><strong>Play Zone:</strong> ${playZone}</p>
        <p><strong>Special Requests:</strong> ${specialRequests || 'None'}</p>
      `
    };

    // Email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation - Splash Fun Land',
      html: `
        <h2>Thank you for your booking request!</h2>
        <p>Hi ${name},</p>
        <p>We've received your booking request for ${date} at ${time}. We'll contact you shortly to confirm availability and finalize your booking.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Date: ${date}</li>
          <li>Time: ${time}</li>
          <li>Party Size: ${partySize}</li>
          <li>Play Zone: ${playZone}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Splash Fun Land Team</p>
      `
    };

    // Send emails
    await transporter.sendMail(businessMailOptions);
    await transporter.sendMail(customerMailOptions);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ message: 'Booking request sent successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to send booking request' })
    };
  }
};