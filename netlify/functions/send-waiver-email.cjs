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

// Waiver email templates
const createWaiverCustomerTemplate = (waiverData) => {
  return {
    subject: `Signed Waiver - Splash Fun Land`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .waiver-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; display: inline-block; width: 120px; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .important-notice { background: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .signature-section { background: #f0f9ff; border: 2px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .minor-section { background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ Signed Waiver Confirmation</h1>
            <p>Your digital waiver has been signed and recorded</p>
          </div>
          
          <div class="content">
            <p>Hi ${waiverData.name},</p>
            
            <p>Thank you for completing your waiver with Splash Fun Land! This email serves as your <strong>signed waiver confirmation</strong> and must be presented upon arrival.</p>
            
            <div class="important-notice">
              <h3 style="color: #dc2626; margin-top: 0;">🚨 IMPORTANT - BRING THIS EMAIL</h3>
              <p style="margin-bottom: 0; font-weight: bold;">
                You MUST show this signed waiver email (either printed or on your phone) when you arrive at Splash Fun Land. 
                Entry will not be permitted without proof of signed waiver.
              </p>
            </div>
            
            <div class="waiver-details">
              <h3>📋 Participant Details</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${waiverData.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${waiverData.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${waiverData.phone}</span>
              </div>
              ${waiverData.dateOfBirth ? `
              <div class="detail-row">
                <span class="detail-label">Date of Birth:</span>
                <span class="detail-value">${waiverData.dateOfBirth}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Emergency Contact:</span>
                <span class="detail-value">${waiverData.emergencyContact}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Emergency Phone:</span>
                <span class="detail-value">${waiverData.emergencyPhone}</span>
              </div>
            </div>

            ${waiverData.isMinor ? `
            <div class="minor-section">
              <h3 style="color: #92400e; margin-top: 0;">👨‍👩‍👧‍👦 Parent/Guardian Information</h3>
              <p style="color: #92400e; font-weight: bold; margin-bottom: 15px;">
                This participant is under 16 years old. Parent/guardian signature required.
              </p>
              <div class="detail-row">
                <span class="detail-label">Parent/Guardian:</span>
                <span class="detail-value">${waiverData.parentName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Parent Email:</span>
                <span class="detail-value">${waiverData.parentEmail}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Parent Phone:</span>
                <span class="detail-value">${waiverData.parentPhone}</span>
              </div>
            </div>
            ` : ''}
            
            <div class="signature-section">
              <h3 style="color: #0369a1; margin-top: 0;">✅ Digital Signature Confirmation</h3>
              <div class="detail-row">
                <span class="detail-label">Waiver Accepted:</span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">✓ YES</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Terms Accepted:</span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">✓ YES</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Signed Date:</span>
                <span class="detail-value">${new Date().toLocaleDateString('en-CA')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Signed Time:</span>
                <span class="detail-value">${new Date().toLocaleString('en-CA')}</span>
              </div>
              ${waiverData.isMinor ? `
              <div class="detail-row">
                <span class="detail-label">Signed By:</span>
                <span class="detail-value" style="color: #dc2626; font-weight: bold;">Parent/Guardian: ${waiverData.parentName}</span>
              </div>
              ` : ''}
            </div>
            
            <h3>📋 What to Bring</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>This signed waiver email</strong> (printed or on phone)</li>
              <li>Appropriate swimwear and footwear</li>
              <li>Towel and change of clothes</li>
              <li>Sunscreen and water bottle</li>
              <li>Valid ID for verification</li>
              ${waiverData.isMinor ? '<li><strong>Parent/guardian must accompany minor</strong></li>' : ''}
            </ul>
            
            <h3>📍 Arrival Instructions</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Arrive 15 minutes before your scheduled time</li>
              <li>Show this waiver email at check-in</li>
              <li>Complete any additional safety briefings</li>
              ${waiverData.isMinor ? '<li>Parent/guardian must be present for check-in</li>' : ''}
              <li>Enjoy your Splash Fun Land experience!</li>
            </ul>
            
            <p>We're excited to see you at Splash Fun Land! If you have any questions before your visit, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            <strong>The Splash Fun Land Team</strong><br>
            Wise_SFL Corporation</p>
          </div>
          
          <div class="footer">
            <p>📍 344 Sackville Dr, Lower Sackville, NS B4C 2R6, Canada</p>
            <p>📧 wisesoccerfootballleague@gmail.com</p>
            <p>📞 +1 (902) 789-7777</p>
            <p>🌐 <a href="https://splashfunland.com">Visit our website</a></p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
              This email serves as your official signed waiver. Please save this email for your records.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const createWaiverBusinessTemplate = (waiverData) => {
  return {
    subject: `🛡️ WAIVER SIGNED - ${waiverData.name} - ${new Date().toLocaleDateString('en-CA')}${waiverData.isMinor ? ' - MINOR (Parent: ' + waiverData.parentName + ')' : ''}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .waiver-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
          .detail-row { margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-label { font-weight: bold; color: #374151; display: inline-block; width: 140px; }
          .detail-value { color: #111827; }
          .signed { background: #f0fdf4; border-left: 4px solid #10b981; }
          .customer-info { background: #eff6ff; border-left: 4px solid #3b82f6; }
          .minor-alert { background: #fef3c7; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🛡️ Waiver Signed & Recorded</h2>
            <p>Splash Fun Land - Digital Waiver System</p>
            ${waiverData.isMinor ? '<p style="background: #f59e0b; padding: 10px; border-radius: 5px; margin-top: 10px;"><strong>⚠️ MINOR PARTICIPANT - Parent/Guardian Signature</strong></p>' : ''}
          </div>
          
          <div class="content">
            <div class="waiver-details signed">
              <h3>✅ Waiver Status: SIGNED</h3>
              <div class="detail-row">
                <span class="detail-label">Signed Date:</span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">${new Date().toLocaleDateString('en-CA')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Signed Time:</span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">${new Date().toLocaleString('en-CA')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Waiver Accepted:</span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">✓ YES</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Terms Accepted:</span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">✓ YES</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer Email:</span>
                <span class="detail-value">Waiver sent to ${waiverData.email}</span>
              </div>
            </div>
            
            <div class="waiver-details customer-info">
              <h3>👤 Participant Information</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${waiverData.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${waiverData.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value"><a href="tel:${waiverData.phone}" style="color: #3b82f6; text-decoration: none;">${waiverData.phone}</a></span>
              </div>
              ${waiverData.dateOfBirth ? `
              <div class="detail-row">
                <span class="detail-label">Date of Birth:</span>
                <span class="detail-value">${waiverData.dateOfBirth}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Emergency Contact:</span>
                <span class="detail-value">${waiverData.emergencyContact}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Emergency Phone:</span>
                <span class="detail-value">${waiverData.emergencyPhone}</span>
              </div>
            </div>

            ${waiverData.isMinor ? `
            <div class="waiver-details minor-alert">
              <h3>⚠️ MINOR PARTICIPANT - Parent/Guardian Required</h3>
              <div class="detail-row">
                <span class="detail-label">Parent/Guardian:</span>
                <span class="detail-value" style="font-weight: bold;">${waiverData.parentName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Parent Email:</span>
                <span class="detail-value">${waiverData.parentEmail}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Parent Phone:</span>
                <span class="detail-value"><a href="tel:${waiverData.parentPhone}" style="color: #3b82f6; text-decoration: none;">${waiverData.parentPhone}</a></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Signed By:</span>
                <span class="detail-value" style="color: #dc2626; font-weight: bold;">Parent/Guardian (on behalf of minor)</span>
              </div>
            </div>
            ` : ''}
            
            <div class="waiver-details">
              <h3>📋 Staff Checklist</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="color: #059669; font-weight: bold;">✅ Waiver digitally signed and recorded</li>
                <li>📧 Customer has received signed waiver via email</li>
                ${waiverData.isMinor ? '<li style="color: #f59e0b; font-weight: bold;">⚠️ MINOR: Parent/guardian must be present at check-in</li>' : ''}
                <li>🔍 Verify waiver email upon customer arrival</li>
                <li>📋 Complete safety briefing before activity</li>
                <li>🛡️ Ensure all safety equipment is provided</li>
                <li>📸 Customer has consented to photography (via terms)</li>
                ${waiverData.isMinor ? '<li style="color: #f59e0b; font-weight: bold;">👨‍👩‍👧‍👦 Verify parent/guardian ID matches waiver</li>' : ''}
              </ul>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e0f7fa; border-radius: 8px;">
              <strong>📞 Contact Information:</strong><br>
              <strong>Participant:</strong> ${waiverData.name} at ${waiverData.email} or <a href="tel:${waiverData.phone}" style="color: #06b6d4; text-decoration: none;">${waiverData.phone}</a>
              ${waiverData.isMinor ? `<br><strong>Parent/Guardian:</strong> ${waiverData.parentName} at ${waiverData.parentEmail} or <a href="tel:${waiverData.parentPhone}" style="color: #06b6d4; text-decoration: none;">${waiverData.parentPhone}</a>` : ''}
            </div>
            
            <div style="margin-top: 15px; padding: 15px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
              <strong>⚠️ Important:</strong> Customer must show this signed waiver email upon arrival. 
              ${waiverData.isMinor ? 'Parent/guardian must accompany minor and present ID for verification. ' : ''}
              Do not allow participation without waiver verification.
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
    const waiverData = JSON.parse(event.body);

    // Validate required fields
    if (!waiverData.name || !waiverData.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required waiver information' })
      };
    }

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured, skipping waiver email notifications');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Waiver processed but email notifications not configured',
          emailsSent: 0
        })
      };
    }

    const transporter = createTransporter();
    const businessEmail = process.env.BUSINESS_EMAIL || 'wisesoccerfootballleague@gmail.com';

    // Create email templates
    const customerEmail = createWaiverCustomerTemplate(waiverData);
    const businessEmailTemplate = createWaiverBusinessTemplate(waiverData);

    const emailPromises = [];

    // Send customer waiver email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land Waivers" <${process.env.EMAIL_USER}>`,
        to: waiverData.email,
        subject: customerEmail.subject,
        html: customerEmail.html
      })
    );

    // Send parent email if minor
    if (waiverData.isMinor && waiverData.parentEmail && waiverData.parentEmail !== waiverData.email) {
      emailPromises.push(
        transporter.sendMail({
          from: `"Splash Fun Land Waivers" <${process.env.EMAIL_USER}>`,
          to: waiverData.parentEmail,
          subject: `Parent Copy - ${customerEmail.subject}`,
          html: customerEmail.html
        })
      );
    }

    // Send business notification email
    emailPromises.push(
      transporter.sendMail({
        from: `"Splash Fun Land Waiver System" <${process.env.EMAIL_USER}>`,
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
          email: index === 0 ? 'customer' : (index === 1 && waiverData.isMinor ? 'parent' : 'business'),
          error: result.reason.message
        });
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Waiver signed and emails sent successfully',
        emailsSent: successCount,
        totalEmails: emailPromises.length,
        errors: errors.length > 0 ? errors : undefined
      })
    };

  } catch (error) {
    console.error('Waiver email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process waiver',
        details: error.message 
      })
    };
  }
};