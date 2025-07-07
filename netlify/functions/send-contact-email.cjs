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

// Contact form email templates
const createContactConfirmationTemplate = (formData) => {
  return {
    subject: `Thank you for contacting Splash Fun Land`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06b6d4; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; display: inline-block; width: 120px; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌊 Thank You for Contacting Us!</h1>
            <p>We've received your message</p>
          </div>
          
          <div class="content">
            <p>Hi ${formData.firstName},</p>
            
            <p>Thank you for reaching out to Splash Fun Land! We've received your message and our team will get back to you within 24 hours during business days.</p>
            
            <div class="message-details">
              <h3>📝 Your Message Details</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${formData.firstName} ${formData.lastName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${formData.email}</span>
              </div>
              ${formData.phone ? `
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${formData.phone}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Subject:</span>
                <span class="detail-value">${formData.subject}</span>
              </div>
              ${formData.preferredDate ? `
              <div class="detail-row">
                <span class="detail-label">Preferred Date:</span>
                <span class="detail-value">${formData.preferredDate}</span>
              </div>
              ` : ''}
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Message:</span>
              </div>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 10px;">
                ${formData.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>📅 <a href="https://splashfunland.com/book">Book your activities online</a></li>
              <li>🏖️ <a href="https://splashfunland.com/play-zones">Explore our play zones</a></li>
              <li>📋 <a href="https://splashfunland.com/waiver">Complete your waiver</a></li>
              <li>ℹ️ <a href="https://splashfunland.com/about">Learn more about us</a></li>
            </ul>
            
            <p>We're excited to help you plan your perfect day at Splash Fun Land!</p>
            
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

const createContactBusinessTemplate = (formData) => {
  return {
    subject: `New Contact Form Submission - ${formData.subject} - ${formData.firstName} ${formData.lastName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .contact-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
          .detail-row { margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-label { font-weight: bold; color: #374151; display: inline-block; width: 120px; }
          .detail-value { color: #111827; }
          .urgent { background: #fef2f2; border-left: 4px solid #ef4444; }
          .customer-info { background: #eff6ff; border-left: 4px solid #3b82f6; }
          .message-content { background: #f0fdf4; border-left: 4px solid #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 New Contact Form Submission</h2>
            <p>Splash Fun Land - Customer Inquiry</p>
          </div>
          
          <div class="content">
            <div class="contact-details urgent">
              <h3>🚨 Priority: ${formData.subject}</h3>
              <div class="detail-row">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">${new Date().toLocaleString('en-CA')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Subject:</span>
                <span class="detail-value">${formData.subject}</span>
              </div>
              ${formData.preferredDate ? `
              <div class="detail-row">
                <span class="detail-label">Preferred Date:</span>
                <span class="detail-value" style="color: #dc2626; font-weight: bold;">${formData.preferredDate}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="contact-details customer-info">
              <h3>👤 Customer Information</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${formData.firstName} ${formData.lastName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${formData.email}</span>
              </div>
              ${formData.phone ? `
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value"><a href="tel:${formData.phone}" style="color: #3b82f6; text-decoration: none;">${formData.phone}</a></span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Newsletter:</span>
                <span class="detail-value">${formData.newsletter ? '✅ Subscribed' : '❌ Not subscribed'}</span>
              </div>
            </div>
            
            <div class="contact-details message-content">
              <h3>💬 Customer Message</h3>
              <div style="background: white; padding: 15px; border-radius: 6px; margin: 10px 0; border: 1px solid #d1d5db;">
                ${formData.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div class="contact-details">
              <h3>📋 Recommended Actions</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${formData.subject === 'booking' ? '<li style="color: #dc2626; font-weight: bold;">🎯 BOOKING INQUIRY - Respond with availability and pricing</li>' : ''}
                ${formData.subject === 'group' ? '<li style="color: #dc2626; font-weight: bold;">👥 GROUP EVENT - Prepare group packages and pricing</li>' : ''}
                ${formData.subject === 'camp' ? '<li style="color: #dc2626; font-weight: bold;">🏕️ SUMMER CAMP - Send camp information and registration details</li>' : ''}
                ${formData.preferredDate ? '<li style="color: #dc2626; font-weight: bold;">📅 CHECK AVAILABILITY for preferred date</li>' : ''}
                <li>📞 Respond within 24 hours during business days</li>
                <li>📧 Send personalized response addressing their specific needs</li>
                ${formData.newsletter ? '<li>📬 Add to newsletter subscription list</li>' : ''}
              </ul>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e0f7fa; border-radius: 8px;">
              <strong>📞 Quick Response:</strong> Reply directly to this email or contact ${formData.firstName} at 
              ${formData.email}${formData.phone ? ` or <a href="tel:${formData.phone}" style="color: #06b6d4; text-decoration: none;">${formData.phone}</a>` : ''}.
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
    const formData = JSON.parse(event.body);

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
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
          message: 'Contact form submitted but email notifications not configured',
          emailsSent: 0
        })
      };
    }

    const transporter = createTransporter();
    const businessEmail = process.env.BUSINESS_EMAIL || 'wisesoccerfootballleague@gmail.com';

    // Create email templates
    const customerEmail = createContactConfirmationTemplate(formData);
    const businessEmailTemplate = createContactBusinessTemplate(formData);

    const emailPromises = [];

    // Send customer confirmation email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land" <${process.env.EMAIL_USER}>`,
        to: formData.email,
        subject: customerEmail.subject,
        html: customerEmail.html
      })
    );

    // Send business notification email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land Contact Form" <${process.env.EMAIL_USER}>`,
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
        message: 'Contact form submitted successfully',
        emailsSent: successCount,
        totalEmails: emailPromises.length,
        errors: errors.length > 0 ? errors : undefined
      })
    };

  } catch (error) {
    console.error('Contact form email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process contact form',
        details: error.message 
      })
    };
  }
};