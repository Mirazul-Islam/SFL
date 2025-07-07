# Splash Fun Land - Booking System

A modern web application for booking recreational activities at Splash Fun Land in Halifax, Nova Scotia.

## Features

- Interactive booking calendar with real-time availability
- Multiple play zones (Beach Soccer, Water Soccer, Volleyball, etc.)
- Flexible duration selection (30 minutes to 8 hours)
- Customer information management
- Conflict detection for bookings
- Stripe payment integration
- Automated email notifications
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Netlify Functions
- **Database**: Supabase (PostgreSQL)
- **Payment**: Stripe
- **Email**: Nodemailer
- **Deployment**: Netlify

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the database migration in the SQL editor:

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  zone_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration DECIMAL(3,1) NOT NULL,
  customer_info JSONB NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create zones table
CREATE TABLE IF NOT EXISTS zones (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity VARCHAR(100) NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  min_duration DECIMAL(3,1) DEFAULT 1.0,
  max_duration DECIMAL(3,1) DEFAULT 8.0,
  available_start TIME DEFAULT '09:00:00',
  available_end TIME DEFAULT '20:00:00',
  active BOOLEAN DEFAULT true
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_zone_date ON bookings(zone_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Insert default zones
INSERT INTO zones (id, name, capacity, hourly_rate, min_duration, max_duration) VALUES
('beach-soccer', 'Beach Soccer Field', 'Standard field', 65.00, 1.0, 8.0),
('volleyball', 'Sand Beach Volleyball', 'Standard court', 65.00, 1.0, 8.0),
('water-soccer-1', 'Water Soccer Field 1', '5 vs 5 (max 12 players)', 125.00, 1.0, 6.0),
('water-soccer-2', 'Water Soccer Field 2', '3 vs 3 (max 8 players)', 100.00, 1.0, 6.0),
('turf-soccer', 'Turf Soccer Field', 'Standard field', 50.00, 1.0, 8.0),
('bubble-soccer', 'Bubble Soccer', 'Per bubble rental', 20.00, 1.0, 4.0)
ON CONFLICT (id) DO NOTHING;
```

### 2. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. For testing, use the test keys (they start with `pk_test_` and `sk_test_`)

### 3. Email Configuration

For email notifications, you'll need to set up an email service:

#### Option 1: Gmail (Recommended for testing)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"
3. Use your Gmail address as `EMAIL_USER` and the app password as `EMAIL_PASSWORD`

#### Option 2: Professional Email Service
For production, consider using:
- SendGrid
- Mailgun
- Amazon SES
- Postmark

### 4. Environment Variables

Set these environment variables in your Netlify dashboard (Site settings > Environment variables):

```
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
BUSINESS_EMAIL=wisesoccerfootballleague@gmail.com
```

**Important**: Replace the placeholder values with your actual credentials.

### 5. Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your credentials
4. Run the development server: `npm run dev`

### 6. Deployment

The site is automatically deployed to Netlify. Make sure to:

1. Set all environment variables in Netlify
2. Ensure the build command is set to `npm run build`
3. Set the publish directory to `dist`

## Email Notifications

The system automatically sends email notifications when bookings are confirmed:

### Customer Email
- Booking confirmation with all details
- Important reminders and instructions
- Link to complete waiver online
- Contact information

### Business Email
- New booking notification
- Customer contact information
- Payment confirmation
- Action items and preparation notes

### Email Configuration Notes
- Emails are sent automatically when bookings are confirmed
- If email configuration is missing, bookings will still work but no emails will be sent
- Email failures don't affect the booking process
- All email templates are responsive and professional

## API Endpoints

- `GET /.netlify/functions/zones` - Get all active play zones
- `GET /.netlify/functions/bookings` - Get all bookings
- `POST /.netlify/functions/bookings` - Create a new booking
- `PUT /.netlify/functions/bookings` - Update booking status
- `GET /.netlify/functions/calendar-availability` - Get availability for a date
- `POST /.netlify/functions/create-payment-intent` - Create Stripe payment intent
- `POST /.netlify/functions/send-booking-email` - Send booking confirmation emails

## Database Schema

### Bookings Table
- `id` - Primary key
- `zone_id` - Reference to play zone
- `date` - Booking date
- `start_time` - Start time
- `end_time` - End time
- `duration` - Duration in hours
- `customer_info` - JSON object with customer details
- `total_cost` - Total cost
- `status` - Booking status (pending, confirmed, cancelled)
- `payment_id` - Payment reference
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Zones Table
- `id` - Primary key
- `name` - Zone name
- `capacity` - Capacity description
- `hourly_rate` - Rate per hour
- `min_duration` - Minimum booking duration
- `max_duration` - Maximum booking duration
- `available_start` - Daily start time
- `available_end` - Daily end time
- `active` - Whether zone is active

## Features

### Booking System
- Real-time availability checking
- Conflict detection
- Minimum 1-hour booking requirement
- 30-minute time slot granularity
- Automatic end time calculation

### Payment Processing
- Secure Stripe integration
- CAD currency support
- Payment confirmation
- Automatic booking confirmation on successful payment

### Email Notifications
- Professional HTML email templates
- Customer confirmation emails
- Business notification emails
- Responsive email design
- Automatic sending on booking confirmation

### User Experience
- Intuitive calendar interface
- Mobile-responsive design
- Step-by-step booking process
- Real-time form validation
- Loading states and error handling

## Security Features
- Environment variable protection
- Secure payment processing
- Input validation
- CORS configuration
- Error handling without data exposure

## Support
For technical support or questions about the booking system, please contact the development team.