const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Cancellation email template
const createCancellationTemplate = (booking, reason) => {
  return {
    subject: `Booking Cancellation - Splash Fun Land`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; display: inline-block; width: 120px; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .refund-info { background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Booking Cancelled</h1>
            <p>We're sorry to inform you about this cancellation</p>
          </div>
          
          <div class="content">
            <p>Dear ${booking.customer_info.name},</p>
            
            <p>We regret to inform you that your booking at Splash Fun Land has been cancelled.</p>
            
            <div class="booking-details">
              <h3>📅 Cancelled Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${booking.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Activity:</span>
                <span class="detail-value">${booking.zone_id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${booking.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${booking.start_time} - ${booking.end_time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value">$${booking.total_cost}</span>
              </div>
            </div>
            
            <div class="refund-info">
              <h4 style="color: #92400e; margin-top: 0;">💰 Refund Information</h4>
              <p style="color: #92400e; margin-bottom: 0;">
                <strong>Reason for cancellation:</strong> ${reason}
              </p>
              <p style="color: #92400e;">
                We will process your refund within 5-7 business days. You will receive a separate email confirmation once the refund has been processed.
              </p>
            </div>
            
            <p>We sincerely apologize for any inconvenience this may cause. If you have any questions or would like to reschedule, please don't hesitate to contact us.</p>
            
            <p>We hope to welcome you to Splash Fun Land in the future!</p>
            
            <p>Best regards,<br>
            <strong>The Splash Fun Land Team</strong><br>
            Wise_SFL Corporation</p>
          </div>
          
          <div class="footer">
            <p>📍 344 Sackville Dr, Lower Sackville, NS B4C 2R6, Canada</p>
            <p>📧 wisesoccerfootballleague@gmail.com</p>
            <p>📞 +1 (902) 333-3456</p>
            <p>🌐 <a href="https://splashfunland.com">Visit our website</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };
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
    const { booking, reason } = JSON.parse(event.body);

    // Validate required data
    if (!booking || !booking.customer_info || !booking.customer_info.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing booking information' })
      };
    }

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured, skipping cancellation email');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Booking cancelled but email notifications not configured',
          emailsSent: 0
        })
      };
    }

    const transporter = createTransporter();
    const businessEmail = process.env.BUSINESS_EMAIL || 'wisesoccerfootballleague@gmail.com';

    // Create email template
    const customerEmail = createCancellationTemplate(booking, reason || 'Administrative decision');

    const emailPromises = [];

    // Send customer cancellation email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land" <${process.env.EMAIL_USER}>`,
        to: booking.customer_info.email,
        subject: customerEmail.subject,
        html: customerEmail.html
      })
    );

    // Send business notification email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land Admin" <${process.env.EMAIL_USER}>`,
        to: businessEmail,
        subject: `Booking Cancelled - ${booking.customer_info.name} - ${booking.date}`,
        html: `
          <h3>Booking Cancellation Notification</h3>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Customer:</strong> ${booking.customer_info.name} (${booking.customer_info.email})</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.start_time} - ${booking.end_time}</p>
          <p><strong>Amount:</strong> $${booking.total_cost}</p>
          <p><strong>Reason:</strong> ${reason || 'Administrative decision'}</p>
          <p><strong>Action Required:</strong> Process refund within 5-7 business days</p>
        `
      })
    );

    // Send all emails
    const results = await Promise.allSettled(emailPromises);
    
    let successCount = 0;
    let errors = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
      } else {
        errors.push({
          email: index === 0 ? 'customer' : 'business',
          error: result.reason.message
        });
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Cancellation emails sent successfully',
        emailsSent: successCount,
        totalEmails: emailPromises.length,
        errors: errors.length > 0 ? errors : undefined
      })
    };

  } catch (error) {
    console.error('Cancellation email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send cancellation emails',
        details: error.message 
      })
    };
  }
};