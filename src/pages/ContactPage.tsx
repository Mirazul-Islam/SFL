import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, Send, CheckCircle, AlertCircle, Calendar, Facebook, Instagram, Utensils, Gift } from 'lucide-react';

// Custom TikTok icon component with better visibility
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
  </svg>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    preferredDate: '',
    message: '',
    newsletter: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-primary-500" />,
      title: "Location",
      details: ["344 Sackville Dr", "Lower Sackville, NS B4C 2R6", "Canada"],
      note: "We're located inside the fenced area. Look for our gate entrance."
    },
    {
      icon: <Phone className="w-6 h-6 text-primary-500" />,
      title: "Phone",
      details: ["+1 (902) 333-3456"],
      note: "Available during operating hours"
    },
    {
      icon: <Mail className="w-6 h-6 text-primary-500" />,
      title: "Email",
      details: ["wisesoccerfootballleague", "@gmail.com"],
      note: "We respond within 24 hours"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary-500" />,
      title: "Operating Hours",
      details: ["Summer: 7:00 AM - 9:00 PM", "Daily (May - September)"],
      note: "Hours may vary during off-season"
    }
  ];

  const services = [
    {
      title: "Food & Refreshments",
      items: [
        "🍔 BBQ Grill (Hot Dogs & Burgers)",
        "🥤 Fresh Water & Cola Drinks", 
        "🍫 Chocolate Bars & Chips",
        "🍭 Candy & Ice Cream"
      ]
    },
    {
      title: "Birthday Party Special",
      items: [
        "🎉 $250 Complete Package",
        "⏰ 2 Hours of Activities",
        "🍕 2 Large Pizzas Included",
        "🥤 2 Cola Drinks Included"
      ]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/.netlify/functions/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          preferredDate: '',
          message: '',
          newsletter: false
        });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact & Bookings</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Get in touch with us for bookings, questions, or to learn more about our facilities and services. 
            We're here to help make your visit unforgettable!
          </p>
          
          {/* Quick Booking Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Activities Now
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Book Group Events
            </Link>
          </div>
        </div>
      </section>

      {/* Location Images Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How to Find Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're located inside the fenced area at 344 Sackville Dr. Look for the gate entrance shown in the images below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative aspect-w-16 aspect-h-9">
                <img 
                  src="/WhatsApp Image 2025-06-27 at 23.24.29_5243354d.jpg" 
                  alt="Entrance gate to Splash Fun Land" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Main Entrance Gate</h3>
                <p className="text-gray-600 text-sm">
                  This is our main entrance gate. Look for this fence and gate when you arrive at 344 Sackville Dr.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative aspect-w-16 aspect-h-9">
                <img 
                  src="/WhatsApp Image 2025-06-27 at 23.24.29_80353cdf.jpg" 
                  alt="View of the fenced area from the parking lot" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">View from Parking Area</h3>
                <p className="text-gray-600 text-sm">
                  This is the view of our facility from the parking area. You'll see our fenced entrance and gate.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-3xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-500 text-xl mt-1">📍</div>
              <div>
                <h3 className="font-bold text-yellow-800 mb-1">Finding Us</h3>
                <p className="text-yellow-700 text-sm">
                  Our facility is located inside the fenced area. When you arrive at 344 Sackville Dr, look for the gate entrance shown in the images above. 
                  There's parking available outside the fence. Enter through the gate and our staff will greet you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Multiple ways to reach us for all your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-700 font-medium text-sm break-words">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{info.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food & Services Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Food & Services</h2>
            <p className="text-xl text-gray-600">Enhance your visit with our food options and special packages</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  {service.title === "Birthday Party Special" ? (
                    <Gift className="w-6 h-6 text-pink-600 mr-3" />
                  ) : (
                    <Utensils className="w-6 h-6 text-green-600 mr-3" />
                  )}
                  {service.title}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {service.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        service.title === "Birthday Party Special" 
                          ? 'bg-pink-50 border border-pink-200' 
                          : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                
                {service.title === "Birthday Party Special" && (
                  <div className="mt-6 p-4 bg-pink-100 rounded-lg">
                    <p className="text-pink-800 font-medium text-sm">
                      🎉 Perfect for kids' birthdays! Includes decorations, setup, and cleanup.
                    </p>
                  </div>
                )}
                
                {service.title === "Food & Refreshments" && (
                  <div className="mt-6 p-4 bg-green-100 rounded-lg">
                    <p className="text-green-800 font-medium text-sm">
                      🥪 You can also bring your own food and drinks! We have designated eating areas available.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Options Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Booking Options</h2>
            <p className="text-xl text-gray-600">Choose the best way to book your experience</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Individual Activities</h3>
                <p className="text-gray-600">Book specific time slots for play zones and activities</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Real-time availability</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Instant confirmation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Online payment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Flexible duration</span>
                </div>
              </div>

              <Link
                to="/book"
                className="block w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
              >
                Book Activities Online
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Group Events & Parties</h3>
                <p className="text-gray-600">Custom packages for groups, parties, and special events</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Birthday party packages ($250)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Group discounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Food & catering options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Dedicated coordinator</span>
                </div>
              </div>

              <Link
                to="/events"
                className="block w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
              >
                Request Group Booking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-xl text-gray-600">Fill out the form below and we'll get back to you soon</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-medium">{submitMessage}</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 font-medium">{submitMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="+1 (902) 333-3456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="birthday">Birthday Party ($250 Package)</option>
                  <option value="group">Group Event</option>
                  <option value="camp">Summer Camp</option>
                  <option value="food">Food & Catering</option>
                  <option value="pricing">Pricing Information</option>
                  <option value="facilities">Facility Questions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date (if booking)</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Tell us about your inquiry, group size, preferred activities, food preferences, or any questions you have..."
                ></textarea>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-700">
                  Subscribe to our newsletter for updates and special offers
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending Message...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5 inline mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Media & Links */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Connected</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Follow our community initiatives and stay updated on events, special offers, and community impact stories.
          </p>
          
          {/* Social Media Links */}
          <div className="flex justify-center space-x-8 mb-8">
            <a
              href="https://www.facebook.com/share/1AUH6wJjVn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-8 h-8" />
            </a>
            <a
              href="https://www.instagram.com/splashfunland"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-8 h-8" />
            </a>
            <a
              href="https://www.tiktok.com/@splashfunland"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Follow us on TikTok"
            >
              <TikTokIcon className="w-8 h-8 text-white" />
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://WisegroupCanada.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Visit Wisegroup Canada
            </a>
            
            <Link
              to="/book"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Visit
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/80">
              <strong>Quick Response Promise:</strong> We respond to all inquiries within 24 hours during business days.
              For urgent booking requests, please call during operating hours (7:00 AM - 9:00 PM).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;