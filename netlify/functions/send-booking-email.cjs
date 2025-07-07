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

// Booking confirmation email templates
const createBookingConfirmationTemplate = (bookingData) => {
  const getCostBreakdown = () => {
    let breakdown = '';
    
    if (bookingData.allergySoap) {
      breakdown += `<p class="text-blue-700 text-sm">• Special Allergy Soap: +$9.00</p>`;
    }
    
    if (bookingData.couponCode && bookingData.couponDiscount > 0) {
      if (bookingData.couponType === 'free') {
        breakdown += `<p class="text-green-700 text-sm font-medium">• Coupon "${bookingData.couponCode}": FREE booking! 🎉</p>`;
      } else {
        breakdown += `<p class="text-green-700 text-sm font-medium">• Coupon "${bookingData.couponCode}": ${bookingData.couponDiscount}% off</p>`;
      }
    }
    
    return breakdown;
  };

  return {
    subject: `Booking Confirmation - Splash Fun Land${bookingData.totalCost === 0 ? ' (FREE)' : ''}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06b6d4; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; display: inline-block; width: 120px; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .free-booking { background: #dcfce7; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌊 Booking Confirmed!</h1>
            <p>Your adventure at Splash Fun Land is all set!</p>
            ${bookingData.totalCost === 0 ? '<p style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px; margin-top: 15px;"><strong>🎉 FREE BOOKING!</strong></p>' : ''}
          </div>
          
          <div class="content">
            <p>Hi ${bookingData.name},</p>
            
            <p>Thank you for booking with Splash Fun Land! Your booking has been confirmed and ${bookingData.totalCost === 0 ? 'is completely FREE thanks to your coupon' : 'payment has been processed successfully'}.</p>
            
            ${bookingData.totalCost === 0 ? `
            <div class="free-booking">
              <h3 style="color: #16a34a; margin-top: 0;">🎉 Congratulations!</h3>
              <p style="color: #15803d; margin-bottom: 0;">
                Your booking is completely FREE thanks to your coupon code "${bookingData.couponCode}"! 
                Just show up and enjoy your experience at Splash Fun Land.
              </p>
            </div>
            ` : ''}
            
            <div class="booking-details">
              <h3>📅 Your Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${bookingData.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${bookingData.email}</span>
              </div>
              ${bookingData.phone ? `
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${bookingData.phone}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Activity:</span>
                <span class="detail-value">${bookingData.playZone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${bookingData.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${bookingData.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${bookingData.duration} hours</span>
              </div>
              ${bookingData.partySize ? `
              <div class="detail-row">
                <span class="detail-label">Party Size:</span>
                <span class="detail-value">${bookingData.partySize}</span>
              </div>
              ` : ''}
              
              ${getCostBreakdown()}
              
              <div class="detail-row" style="border-bottom: none; margin-top: 15px;">
                <span class="detail-label">Total Cost:</span>
                <span class="detail-value" style="font-size: 18px; font-weight: bold; color: ${bookingData.totalCost === 0 ? '#16a34a' : '#06b6d4'};">
                  ${bookingData.totalCost === 0 ? 'FREE! 🎉' : `$${bookingData.totalCost} CAD`}
                </span>
              </div>
              
              ${bookingData.paymentId && bookingData.totalCost > 0 ? `
              <div style="background: #f0f9ff; padding: 10px; border-radius: 6px; margin-top: 10px;">
                <span style="font-size: 12px; color: #0369a1;">Payment ID: ${bookingData.paymentId}</span>
              </div>
              ` : ''}
              
              ${bookingData.specialRequests ? `
              <div class="detail-row" style="border-bottom: none; margin-top: 15px;">
                <span class="detail-label">Special Requests:</span>
              </div>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 10px;">
                ${bookingData.specialRequests.replace(/\n/g, '<br>')}
              </div>
              ` : ''}
            </div>
            
            <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #dc2626; margin-top: 0;">🛡️ IMPORTANT: Complete Your Waiver</h4>
              <p style="color: #dc2626; margin-bottom: 15px;">
                <strong>You must complete and sign the waiver before your visit!</strong>
              </p>
              <a href="https://splashfunland.com/waiver" 
                 style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Sign Waiver Now
              </a>
              <p style="color: #dc2626; font-size: 14px; margin-top: 10px; margin-bottom: 0;">
                Everyone in your group must sign their own waiver. Bring the signed waiver email to show staff upon arrival.
              </p>
            </div>
            
            <p><strong>What to bring:</strong></p>
            <ul>
              <li>Signed waiver email (REQUIRED)</li>
              <li>Swimwear and towel</li>
              <li>Sunscreen and water bottle</li>
              <li>Valid ID for verification</li>
              <li>Change of clothes</li>
              ${bookingData.allergySoap ? '<li><strong>Special allergy soap will be provided</strong></li>' : ''}
            </ul>
            
            <p><strong>Arrival instructions:</strong></p>
            <ul>
              <li>Arrive 15 minutes before your scheduled time</li>
              <li>Show your signed waiver email at check-in</li>
              <li>Complete any additional safety briefings</li>
              <li>Enjoy your Splash Fun Land experience!</li>
            </ul>
            
            <p>We're excited to see you at Splash Fun Land!</p>
            
            <p>Best regards,<br>
            <strong>The Splash Fun Land Team</strong><br>
            Wise_SFL Corporation</p>
          </div>
          
          <div class="footer">
            <p>📍 344 Sackville Dr, Lower Sackville, NS B4C 2R6, Canada</p>
            <p>📧 wisesoccerfootballleague@gmail.com</p>
            <p>📞 +1 (902) 789-7777</p>
            <p>🌐 <a href="https://splashfunland.com">Visit our website</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const createBookingBusinessTemplate = (bookingData) => {
  const getCostBreakdown = () => {
    let breakdown = '';
    
    if (bookingData.allergySoap) {
      breakdown += `<li style="color: #0369a1;">Special Allergy Soap: +$9.00</li>`;
    }
    
    if (bookingData.couponCode && bookingData.couponDiscount > 0) {
      if (bookingData.couponType === 'free') {
        breakdown += `<li style="color: #16a34a; font-weight: bold;">Coupon "${bookingData.couponCode}": FREE booking! 🎉</li>`;
      } else {
        breakdown += `<li style="color: #16a34a;">Coupon "${bookingData.couponCode}": ${bookingData.couponDiscount}% off</li>`;
      }
    }
    
    return breakdown;
  };

  return {
    subject: `🏖️ NEW BOOKING${bookingData.totalCost === 0 ? ' (FREE)' : ''} - ${bookingData.playZone} - ${bookingData.date}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
          .detail-row { margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-label { font-weight: bold; color: #374151; display: inline-block; width: 120px; }
          .detail-value { color: #111827; }
          .urgent { background: #fef2f2; border-left: 4px solid #ef4444; }
          .customer-info { background: #eff6ff; border-left: 4px solid #3b82f6; }
          .free-booking { background: #dcfce7; border-left: 4px solid #16a34a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🏖️ New Booking${bookingData.totalCost === 0 ? ' (FREE)' : ''}</h2>
            <p>Splash Fun Land - Activity Booking</p>
            ${bookingData.totalCost === 0 ? '<p style="background: rgba(34, 197, 94, 0.2); padding: 10px; border-radius: 5px; margin-top: 10px;"><strong>🎉 FREE BOOKING WITH COUPON</strong></p>' : ''}
          </div>
          
          <div class="content">
            <div class="booking-details ${bookingData.totalCost === 0 ? 'free-booking' : 'urgent'}">
              <h3>${bookingData.totalCost === 0 ? '🎉 FREE Booking Details' : '🚨 Booking Details'}</h3>
              <div class="detail-row">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">${new Date().toLocaleString('en-CA')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Activity:</span>
                <span class="detail-value" style="font-weight: bold; font-size: 18px;">${bookingData.playZone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value" style="color: #dc2626; font-weight: bold;">${bookingData.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value" style="color: #dc2626; font-weight: bold;">${bookingData.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${bookingData.duration} hours</span>
              </div>
              ${bookingData.partySize ? `
              <div class="detail-row">
                <span class="detail-label">Party Size:</span>
                <span class="detail-value">${bookingData.partySize}</span>
              </div>
              ` : ''}
              
              ${getCostBreakdown() ? `
              <div class="detail-row">
                <span class="detail-label">Extras:</span>
              </div>
              <ul style="margin: 5px 0; padding-left: 20px;">
                ${getCostBreakdown()}
              </ul>
              ` : ''}
              
              <div class="detail-row">
                <span class="detail-label">Total Cost:</span>
                <span class="detail-value" style="font-weight: bold; font-size: 18px; color: ${bookingData.totalCost === 0 ? '#16a34a' : '#dc2626'};">
                  ${bookingData.totalCost === 0 ? 'FREE! 🎉' : `$${bookingData.totalCost} CAD`}
                </span>
              </div>
              
              ${bookingData.paymentId && bookingData.totalCost > 0 ? `
              <div class="detail-row">
                <span class="detail-label">Payment ID:</span>
                <span class="detail-value" style="font-family: monospace; font-size: 12px;">${bookingData.paymentId}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="booking-details customer-info">
              <h3>👤 Customer Information</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${bookingData.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${bookingData.email}</span>
              </div>
              ${bookingData.phone ? `
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value"><a href="tel:${bookingData.phone}" style="color: #3b82f6; text-decoration: none;">${bookingData.phone}</a></span>
              </div>
              ` : ''}
            </div>
            
            ${bookingData.specialRequests ? `
            <div class="booking-details">
              <h3>💬 Special Requests</h3>
              <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 10px 0; border: 1px solid #f59e0b;">
                ${bookingData.specialRequests.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
            
            <div class="booking-details">
              <h3>📋 Preparation Notes</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>✅ Booking confirmed and ${bookingData.totalCost === 0 ? 'FREE' : 'paid'}</li>
                <li>📧 Customer confirmation email sent</li>
                <li>🛡️ Customer must complete waiver before arrival</li>
                ${bookingData.allergySoap ? '<li style="color: #0369a1; font-weight: bold;">🧼 Provide special allergy soap</li>' : ''}
                <li>📋 Verify waiver upon customer arrival</li>
                <li>🏃 Prepare equipment and safety briefing</li>
              </ul>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e0f7fa; border-radius: 8px;">
              <strong>📞 Customer Contact:</strong> ${bookingData.name} at 
              ${bookingData.email}${bookingData.phone ? ` or <a href="tel:${bookingData.phone}" style="color: #06b6d4; text-decoration: none;">${bookingData.phone}</a>` : ''}.
            </div>
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
    const bookingData = JSON.parse(event.body);

    // Validate required fields
    if (!bookingData.name || !bookingData.email || !bookingData.date || !bookingData.time || !bookingData.playZone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required booking information' })
      };
    }

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured, skipping email notifications');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Booking request submitted but email notifications not configured',
          emailsSent: 0
        })
      };
    }

    const transporter = createTransporter();
    const businessEmail = process.env.BUSINESS_EMAIL || 'wisesoccerfootballleague@gmail.com';

    // Create email templates
    const customerEmail = createBookingConfirmationTemplate(bookingData);
    const businessEmailTemplate = createBookingBusinessTemplate(bookingData);

    const emailPromises = [];

    // Send customer confirmation email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land" <${process.env.EMAIL_USER}>`,
        to: bookingData.email,
        subject: customerEmail.subject,
        html: customerEmail.html
      })
    );

    // Send business notification email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land Bookings" <${process.env.EMAIL_USER}>`,
        to: businessEmail,
        subject: businessEmailTemplate.subject,
        html: businessEmailTemplate.html
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
        message: 'Booking request submitted successfully',
        emailsSent: successCount,
        totalEmails: emailPromises.length,
        errors: errors.length > 0 ? errors : undefined
      })
    };

  } catch (error) {
    console.error('Booking email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process booking request',
        details: error.message 
      })
    };
  }
};