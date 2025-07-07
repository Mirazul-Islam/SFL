import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Waves, 
  Trophy, 
  Heart,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Facebook,
  Instagram,
  Utensils,
  Gift,
  PartyPopper,
  Phone
} from 'lucide-react';

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

const HomePage = () => {
  // Check if it's Canada Day season (June 1 - July 31)
  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, 5, 1); // June 1
  const endDate = new Date(currentYear, 6, 31); // July 31
  const isCanadaDaySeason = now >= startDate && now <= endDate;

  const features = [
    {
      icon: <Waves className="w-8 h-8 text-primary-500" />,
      title: "Water Sports",
      description: "Beach soccer, water volleyball, and aquatic games"
    },
    {
      icon: <Users className="w-8 h-8 text-primary-500" />,
      title: "Family Fun",
      description: "Activities for all ages in a safe, supervised environment"
    },
    {
      icon: <Trophy className="w-8 h-8 text-primary-500" />,
      title: "Competitive Play",
      description: "Organized tournaments and competitive leagues"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary-500" />,
      title: "Community Impact",
      description: "Supporting local nonprofit initiatives and programs"
    }
  ];

  const quickLinks = [
    {
      title: "Book Now",
      description: "Reserve your spot for the ultimate fun experience",
      href: "/book",
      color: "from-primary-500 to-primary-600",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: "Play Zones",
      description: "Explore our facilities and pricing options",
      href: "/play-zones",
      color: "from-secondary-500 to-secondary-600",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      title: "Events & Camps",
      description: "Summer camps, group trips, and special events",
      href: "/events",
      color: "from-purple-500 to-purple-600",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Contact Us",
      description: "Get in touch for bookings and information",
      href: "/contact",
      color: "from-green-500 to-green-600",
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const activityShowcase = [
    {
      title: "Water Soccer Fields",
      description: "Experience the thrill of soccer on water with our inflatable fields",
      image: "/WhatsApp Image 2025-06-14 at 23.08.29_527e2ba5.jpg",
      features: ["5v5 and 3v3 options", "Safe shallow water", "Professional supervision"]
    },
    {
      title: "Bubble Soccer",
      description: "Hilarious fun in inflatable bubble suits for all ages",
      image: "/WhatsApp Image 2025-06-14 at 23.07.41_d04c92e9.jpg",
      features: ["Safe collision play", "All ages welcome", "Instructor included"]
    },
    {
      title: "Beach Soccer",
      description: "Professional-grade beach soccer on premium sand surface",
      image: "/WhatsApp Image 2025-06-14 at 23.08.43_b5754562.jpg",
      features: ["Regulation field", "Premium sand", "Goal posts included"]
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo Section - Improved mobile spacing */}
          <div className="mb-6 sm:mb-8">
            <img 
              src="/image.png" 
              alt="Splash Fun Land Logo" 
              className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 mx-auto mb-4 sm:mb-6 rounded-full shadow-2xl animate-bounce-slow"
            />
          </div>
          
          {/* Main Heading - Better mobile typography */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Welcome to
            <span className="block bg-gradient-to-r from-secondary-300 to-secondary-500 bg-clip-text text-transparent">
              Splash Fun Land
            </span>
          </h1>
          
          {/* Description - Improved mobile readability */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
            Your local summer destination for beach soccer, water games, family fun, and more! 
            <span className="block mt-2 sm:inline sm:mt-0">
              Operated by <span className="font-semibold">Wise_SFL Corporation</span> in support of 
              <span className="font-semibold"> Wisegroup Nonprofit Association</span>.
            </span>
          </p>

          {/* Action Buttons - Better mobile layout */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link
              to="/book"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-full hover:from-secondary-600 hover:to-secondary-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl text-sm sm:text-base"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {isCanadaDaySeason ? 'Book & Save 50%!' : 'Book Your Adventure'}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/play-zones"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30 text-sm sm:text-base"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Explore Play Zones
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Social Media Links - Improved mobile spacing */}
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
            <a
              href="https://www.facebook.com/share/1AUH6wJjVn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a
              href="https://www.instagram.com/splashfunland"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a
              href="https://www.tiktok.com/@splashfunland"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Follow us on TikTok"
            >
              <TikTokIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </a>
          </div>

          {/* Quick Stats - Better mobile grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            {[
              { number: "2016", label: "Serving Since" },
              { number: "7+", label: "Play Zones" },
              { number: "100%", label: "Family Safe" },
              { number: isCanadaDaySeason ? "50%" : "∞", label: isCanadaDaySeason ? "Canada Day Savings" : "Fun Guaranteed" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator - Hidden on mobile for space */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Special Offers Section - Compact version */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Check out our special packages and food options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Birthday Party Card */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <PartyPopper className="w-8 h-8 text-yellow-300 mr-3" />
                    <h3 className="text-xl font-bold">Birthday Party Special</h3>
                  </div>
                  <div className="text-2xl font-bold text-yellow-300">$250</div>
                </div>
                <p className="text-white/90 mb-4">
                  Complete package with 2 hours of activities, 2 large pizzas, and 2 cola drinks
                </p>
                <Link
                  to="/events#birthday-party"
                  className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-lg transition-colors shadow-md"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  View Details & Book
                </Link>
              </div>
            </div>

            {/* Food Options Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Utensils className="w-8 h-8 text-yellow-300 mr-3" />
                    <h3 className="text-xl font-bold">Food & Refreshments</h3>
                  </div>
                </div>
                <p className="text-white/90 mb-4">
                  Enjoy our on-site food options or bring your own! BBQ items, snacks, and drinks available.
                </p>
                <Link
                  to="/play-zones#food-options"
                  className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-100 text-green-700 font-bold rounded-lg transition-colors shadow-md"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  View All Options
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience Our Amazing Activities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From thrilling water soccer to hilarious bubble soccer, discover the activities that make Splash Fun Land special.
            </p>
            {isCanadaDaySeason && (
              <div className="mt-6 inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg">
                <span className="mr-3 text-lg">🇨🇦</span>
                <span className="font-bold">Use CANADADAY for 50% off 2+ hour bookings!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activityShowcase.map((activity, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{activity.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {activity.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/play-zones#${activity.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/play-zones"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-full hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Activities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Splash Fun Land?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of recreation, community, and fun in Halifax's premier water sports destination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4 group-hover:shadow-xl transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started Today
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to plan your perfect day at Splash Fun Land
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="group block p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${link.color} text-white rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  {link.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-600 mb-4">{link.description}</p>
                <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & Location Section with Google Maps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Visit Us in Lower Sackville
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">344 Sackville Dr</p>
                    <p className="text-gray-600">Lower Sackville, NS B4C 2R6, Canada</p>
                    <div className="mt-2 p-3 bg-primary-50 rounded-lg border border-primary-100">
                      <p className="text-primary-800 text-sm font-medium">
                        <strong>How to find us:</strong> We're located inside the fenced area. Look for the gate entrance and our signage.
                      </p>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/wWpFvxaahGn7p95J9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Operating Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Summer Season (May - September)</p>
                      <p>Daily: 7:00 AM - 9:00 PM</p>
                      <p className="text-sm text-gray-500">Hours may vary by season</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Phone: +1 (902) 333-3456</p>
                      <p>Email: wisesoccerfootballleague@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-2xl shadow-2xl overflow-hidden" style={{ aspectRatio: '16/12' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2839.8234567890123!2d-63.6789012!3d44.7123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b5a2e123456789%3A0x123456789abcdef!2s344%20Sackville%20Dr%2C%20Lower%20Sackville%2C%20NS%20B4C%202R6%2C%20Canada!5e1!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca&maptype=satellite"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full rounded-2xl"
                  title="Splash Fun Land Location - 344 Sackville Dr, Lower Sackville, NS"
                ></iframe>
                
                {/* Overlay with booking CTA */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none">
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">📍 Find Us Here!</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        344 Sackville Dr, Lower Sackville, NS
                      </p>
                      <p className="text-gray-600 text-sm mb-3 font-medium">
                        We're located inside the fenced area. Look for our gate entrance.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          to="/book"
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-sm"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {isCanadaDaySeason ? 'Book & Save!' : 'Book Now'}
                        </Link>
                        <a
                          href="https://maps.app.goo.gl/wWpFvxaahGn7p95J9"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 text-secondary-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            More Than Just Fun
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            Every booking at Splash Fun Land supports our nonprofit initiatives including therapy programs, 
            youth leadership development, city cleanups, public speaking programs, and community volunteering opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://WisegroupCanada.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Learn About Our Mission
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/30 transition-colors border border-white/30"
            >
              Our Story
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;