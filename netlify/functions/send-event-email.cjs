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

// Event booking email templates
const createEventConfirmationTemplate = (formData) => {
  const getActivityList = () => {
    const activities = [];
    if (formData.activities) {
      Object.keys(formData.activities).forEach(activity => {
        if (formData.activities[activity]) {
          activities.push(activity.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
        }
      });
    }
    return activities.length > 0 ? activities.join(', ') : 'To be determined';
  };

  return {
    subject: `Event Booking Request Received - Splash Fun Land`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; display: inline-block; width: 140px; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Event Request Received!</h1>
            <p>We're excited to help plan your event</p>
          </div>
          
          <div class="content">
            <p>Hi there,</p>
            
            <p>Thank you for your interest in hosting an event at Splash Fun Land! We've received your group booking request and our event coordinator will contact you within 24 hours to discuss the details.</p>
            
            <div class="event-details">
              <h3>🎯 Your Event Request</h3>
              <div class="detail-row">
                <span class="detail-label">Group Size:</span>
                <span class="detail-value">${formData.groupSize}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Age Range:</span>
                <span class="detail-value">${formData.ageRange}</span>
              </div>
              ${formData.preferredDate ? `
              <div class="detail-row">
                <span class="detail-label">Preferred Date:</span>
                <span class="detail-value">${formData.preferredDate}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Requested Activities:</span>
                <span class="detail-value">${getActivityList()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Food Options:</span>
                <span class="detail-value">${formData.foodOption || 'Not specified'}</span>
              </div>
              ${formData.specialRequests ? `
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Special Requests:</span>
              </div>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 10px;">
                ${formData.specialRequests.replace(/\n/g, '<br>')}
              </div>
              ` : ''}
            </div>
            
            <div class="highlight">
              <h4>📋 What Happens Next?</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Within 24 hours:</strong> Our event coordinator will contact you</li>
                <li><strong>Custom Quote:</strong> We'll provide pricing based on your specific needs</li>
                <li><strong>Activity Planning:</strong> We'll help design the perfect event experience</li>
                <li><strong>Confirmation:</strong> Once details are finalized, we'll confirm your booking</li>
              </ul>
            </div>
            
            <p>Our event packages include:</p>
            <ul>
              <li>🎯 Dedicated event coordinator</li>
              <li>🏃 Professional activity supervision</li>
              <li>🛡️ Safety equipment and briefings</li>
              <li>🍽️ Catering options (if requested)</li>
              <li>📸 Photo opportunities</li>
              <li>🎁 Group discounts</li>
            </ul>
            
            <p>If you have any immediate questions, feel free to contact us directly!</p>
            
            <p>Looking forward to creating an amazing event for your group!</p>
            
            <p>Best regards,<br>
            <strong>The Splash Fun Land Events Team</strong><br>
            Wise_SFL Corporation</p>
          </div>
          
          <div class="footer">
            <p>📍 Halifax, Nova Scotia, Canada</p>
            <p>📧 wisesoccerfootballleague@gmail.com</p>
            <p>🌐 <a href="https://gorgeous-pithivier-d6456a.netlify.app">Visit our website</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const createEventBusinessTemplate = (formData) => {
  const getActivityList = () => {
    const activities = [];
    if (formData.activities) {
      Object.keys(formData.activities).forEach(activity => {
        if (formData.activities[activity]) {
          activities.push(activity.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
        }
      });
    }
    return activities.length > 0 ? activities.join(', ') : 'None specified';
  };

  const getPriorityLevel = () => {
    const groupSize = parseInt(formData.groupSize?.split('-')[0] || '0');
    if (groupSize >= 50) return { level: 'HIGH', color: '#dc2626', reason: 'Large group (50+ people)' };
    if (groupSize >= 20) return { level: 'MEDIUM', color: '#f59e0b', reason: 'Medium group (20+ people)' };
    if (formData.preferredDate) return { level: 'MEDIUM', color: '#f59e0b', reason: 'Specific date requested' };
    return { level: 'NORMAL', color: '#10b981', reason: 'Standard inquiry' };
  };

  const priority = getPriorityLevel();

  return {
    subject: `🎉 NEW EVENT BOOKING REQUEST - ${formData.groupSize} - ${priority.level} PRIORITY`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .event-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
          .detail-row { margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-label { font-weight: bold; color: #374151; display: inline-block; width: 140px; }
          .detail-value { color: #111827; }
          .priority { background: #fef2f2; border-left: 4px solid ${priority.color}; }
          .customer-info { background: #eff6ff; border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎉 New Event Booking Request</h2>
            <p>Splash Fun Land - Group Event Inquiry</p>
          </div>
          
          <div class="content">
            <div class="event-details priority">
              <h3>🚨 Priority: ${priority.level}</h3>
              <div class="detail-row">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">${new Date().toLocaleString('en-CA')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Priority Reason:</span>
                <span class="detail-value" style="color: ${priority.color}; font-weight: bold;">${priority.reason}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Group Size:</span>
                <span class="detail-value" style="font-weight: bold; font-size: 18px;">${formData.groupSize}</span>
              </div>
              ${formData.preferredDate ? `
              <div class="detail-row">
                <span class="detail-label">Preferred Date:</span>
                <span class="detail-value" style="color: #dc2626; font-weight: bold;">${formData.preferredDate}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="event-details customer-info">
              <h3>👤 Contact Information</h3>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${formData.email || 'Not provided'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${formData.phone ? `<a href="tel:${formData.phone}" style="color: #3b82f6; text-decoration: none;">${formData.phone}</a>` : 'Not provided'}</span>
              </div>
            </div>
            
            <div class="event-details">
              <h3>🎯 Event Requirements</h3>
              <div class="detail-row">
                <span class="detail-label">Age Range:</span>
                <span class="detail-value">${formData.ageRange}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Activities:</span>
                <span class="detail-value">${getActivityList()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Food Options:</span>
                <span class="detail-value">${formData.foodOption || 'Not specified'}</span>
              </div>
              ${formData.specialRequests ? `
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Special Requests:</span>
              </div>
              <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 10px; border: 1px solid #f59e0b;">
                ${formData.specialRequests.replace(/\n/g, '<br>')}
              </div>
              ` : ''}
            </div>
            
            <div class="event-details">
              <h3>📋 Immediate Action Items</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="color: #dc2626; font-weight: bold;">📞 Contact customer within 24 hours</li>
                ${formData.preferredDate ? '<li style="color: #dc2626; font-weight: bold;">📅 Check availability for preferred date IMMEDIATELY</li>' : ''}
                <li>💰 Prepare custom quote based on group size and requirements</li>
                <li>📋 Send event package information and pricing</li>
                <li>🎯 Assign dedicated event coordinator</li>
                ${formData.specialRequests ? '<li style="color: #f59e0b; font-weight: bold;">⚠️ Review special requests and prepare solutions</li>' : ''}
                <li>📧 Follow up with detailed proposal within 48 hours</li>
              </ul>
            </div>
            
            <div class="event-details">
              <h3>📞 Recommended Response</h3>
              <div style="background: #e0f7fa; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <p><strong>Subject:</strong> Your Event at Splash Fun Land - Let's Make It Amazing!</p>
                <p><strong>Key Points to Cover:</strong></p>
                <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px;">
                  <li>Thank them for choosing Splash Fun Land</li>
                  <li>Confirm group size and preferred date</li>
                  <li>Outline available activities and packages</li>
                  <li>Provide preliminary pricing estimate</li>
                  <li>Schedule a call to discuss details</li>
                  <li>Mention group discounts and special offers</li>
                </ul>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e0f7fa; border-radius: 8px;">
              <strong>📞 Contact Information:</strong> 
              ${formData.email ? `Email: ${formData.email}` : ''}
              ${formData.phone ? ` | Phone: <a href="tel:${formData.phone}" style="color: #06b6d4; text-decoration: none;">${formData.phone}</a>` : ''}
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
    if (!formData.groupSize || !formData.ageRange) {
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
          message: 'Event request submitted but email notifications not configured',
          emailsSent: 0
        })
      };
    }

    const transporter = createTransporter();
    const businessEmail = process.env.BUSINESS_EMAIL || 'wisesoccerfootballleague@gmail.com';

    // Create email templates
    const customerEmail = createEventConfirmationTemplate(formData);
    const businessEmailTemplate = createEventBusinessTemplate(formData);

    const emailPromises = [];

    // Send customer confirmation email (if email provided)
    if (formData.email) {
      emailPromises.push(
        transporter.sendMail({
          from: `"Splash Fun Land Events" <${process.env.EMAIL_USER}>`,
          to: formData.email,
          subject: customerEmail.subject,
          html: customerEmail.html
        })
      );
    }

    // Send business notification email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land Event Requests" <${process.env.EMAIL_USER}>`,
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
        message: 'Event request submitted successfully',
        emailsSent: successCount,
        totalEmails: emailPromises.length,
        errors: errors.length > 0 ? errors : undefined
      })
    };

  } catch (error) {
    console.error('Event request email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process event request',
        details: error.message 
      })
    };
  }
};