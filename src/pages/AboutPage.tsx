import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, MapPin, Clock, Target, Calendar, ArrowRight, Phone } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Community First",
      description: "Every activity supports local nonprofit initiatives and community development programs."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Family Focused",
      description: "Creating safe, inclusive environments where families can bond and create lasting memories."
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      title: "Excellence",
      description: "Maintaining the highest standards in safety, cleanliness, and customer experience."
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Impact Driven",
      description: "Measuring success by the positive impact we create in our community and environment."
    }
  ];

  const initiatives = [
    "Therapy and wellness programs",
    "Youth leadership development",
    "Community cleanup initiatives",
    "Public speaking and confidence building",
    "Educational workshops and seminars",
    "Volunteer coordination and support"
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Splash Fun Land</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              More than just a recreation center – we're a community-driven organization 
              dedicated to creating positive impact through fun, fitness, and fellowship.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  <span className="font-semibold text-primary-600">Wise_SFL Corporation</span> operates 
                  Splash Fun Land in partnership with <span className="font-semibold text-primary-600">Wisegroup Nonprofit Association</span>, 
                  creating a unique model where recreation and community service work hand in hand.
                </p>
                <p>
                  Since 2016, we've been proudly serving Halifax and surrounding communities, 
                  providing world-class recreational facilities while funding essential community programs. 
                  Our approach is simple: have fun while making a difference.
                </p>
                <p>
                  Every splash, every game, every moment of joy at our facility contributes to 
                  meaningful community initiatives that strengthen our neighborhoods and support those in need.
                </p>
              </div>

              {/* Organization Logos Section */}
              <div className="mt-8 space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Our Organizations</h3>
                  
                  <div className="space-y-4">
                    {/* Wise SFL Corporation */}
                    <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                      <img 
                        src="/WhatsApp Image 2025-06-12 at 00.52.37_920b233b.jpg" 
                        alt="Wise SFL Corporation Logo" 
                        className="h-16 w-auto object-contain"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">Wise_SFL Corporation</h4>
                        <p className="text-sm text-gray-600">Operating Entity</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Manages daily operations, facility maintenance, and customer experience
                        </p>
                      </div>
                    </div>

                    {/* Wise Group */}
                    <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                      <img 
                        src="/WhatsApp Image 2025-06-12 at 00.52.53_0d658c38.jpg" 
                        alt="Wise Group Logo" 
                        className="h-16 w-auto object-contain"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">Wisegroup Nonprofit Association</h4>
                        <p className="text-sm text-gray-600">Community Partner</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Receives funding support for community programs and initiatives
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Partnership Model:</strong> Revenue from Splash Fun Land activities 
                      directly supports Wisegroup's community programs, creating sustainable funding 
                      for local initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/WhatsApp Image 2025-06-16 at 17.44.19_e75283ed.jpg"
                  alt="Splash Fun Land bubble soccer activities at sunset"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We operate recreational programs that generate funding for vital community work, 
              creating a sustainable model for positive social impact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recreation Programs</h3>
              <ul className="space-y-4">
                {[
                  "Beach soccer and water sports",
                  "Family-friendly play zones",
                  "Summer camps and day programs",
                  "Group events and private parties",
                  "Competitive leagues and tournaments",
                  "Equipment rentals and lessons"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Community Initiatives</h3>
              <ul className="space-y-4">
                {initiatives.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Hours Section with Google Maps */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Visit Us</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Location</h3>
                    <p className="text-white/90">344 Sackville Dr</p>
                    <p className="text-white/90">Lower Sackville, NS B4C 2R6, Canada</p>
                    <div className="mt-2 p-3 bg-white/10 rounded-lg">
                      <p className="text-white/90 text-sm font-medium">
                        <strong>How to find us:</strong> We're located inside the fenced area. Look for the gate entrance and our signage.
                      </p>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/wWpFvxaahGn7p95J9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-secondary-300 hover:text-secondary-200 font-medium text-sm"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Operating Hours</h3>
                    <div className="text-white/90 space-y-1">
                      <p><span className="font-medium">Summer Season:</span> May - September</p>
                      <p><span className="font-medium">Daily:</span> 7:00 AM - 9:00 PM</p>
                      <p className="text-white/70 text-sm">Hours may vary during off-season and holidays</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Contact</h3>
                    <div className="text-white/90 space-y-1">
                      <p><span className="font-medium">Phone:</span> +1 (902) 333-3456</p>
                      <p><span className="font-medium">Email:</span> wisesoccerfootballleague@gmail.com</p>
                      <p className="text-white/70 text-sm">Available during operating hours</p>
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
                          Book Now
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

          <div className="text-center mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Join Us?</h3>
              <p className="text-white/90 mb-6">
                Experience the fun while supporting meaningful community initiatives. 
                Book your visit today and become part of our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/book"
                  className="inline-flex items-center px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-full transition-colors"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;