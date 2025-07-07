import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Clock, MapPin, Star, Gift, Tent, Utensils, Send, CheckCircle, AlertCircle, PartyPopper } from 'lucide-react';

const EventsPage = () => {
  const [formData, setFormData] = useState({
    groupSize: '',
    ageRange: '',
    preferredDate: '',
    activities: {
      beachSoccer: false,
      waterSports: false,
      volleyball: false,
      bubbleSoccer: false,
      waterBalloonWars: false,
      tugOfWar: false
    },
    foodOption: '',
    specialRequests: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const birthdayPartyRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if URL has a hash and scroll to that section
    if (location.hash) {
      setTimeout(() => {
        const targetId = location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        } else if (targetId === 'birthday-party' && birthdayPartyRef.current) {
          birthdayPartyRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (targetId === 'group-booking-form' && bookingFormRef.current) {
          bookingFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const events = [
    {
      title: "Birthday Party Special",
      description: "Complete birthday package with 2 hours of activities, 2 large pizzas, and 2 cola drinks",
      icon: <PartyPopper className="w-8 h-8 text-pink-500" />,
      features: [
        "2 hours of unlimited activities",
        "2 large pizzas included",
        "2 cola drinks included",
        "All play zones access",
        "Birthday decorations setup"
      ],
      pricing: "$250 complete package",
      duration: "2 hours",
      capacity: "Max 50",
      highlight: true
    },
    {
      title: "Group Trips & Private Events",
      description: "Perfect for corporate outings, school groups, and family reunions",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      features: [
        "Customizable activity packages",
        "Dedicated event coordinator",
        "Group discounts available",
        "Catering options",
        "Private facility access"
      ],
      pricing: "Starting from $25/person",
      duration: "Custom",
      capacity: "10-100 people"
    },
    {
      title: "Summer Camps",
      description: "Week-long adventure camps for kids and teens with daily activities and skill development",
      icon: <Calendar className="w-8 h-8 text-green-500" />,
      features: [
        "Age-appropriate activities",
        "Certified instructors",
        "Daily lunch included",
        "Swimming and water sports",
        "Team building exercises"
      ],
      pricing: "$150/week per child",
      duration: "Custom",
      capacity: "20-50 people"
    },
    {
      title: "Camping Site",
      description: "Overnight camping experience with tents, campfire, and outdoor activities",
      icon: <Tent className="w-8 h-8 text-orange-500" />,
      features: [
        "Tent setup included",
        "Campfire and s'mores",
        "Night activities",
        "Breakfast included",
        "Safety supervision 24/7"
      ],
      pricing: "$45/person per night",
      duration: "Custom",
      capacity: "Max 50 people"
    }
  ];

  const activities = [
    {
      name: "Pillow Fights",
      description: "Safe, supervised pillow fighting tournaments with soft, oversized pillows",
      icon: "🥊",
      ageGroup: "All ages"
    },
    {
      name: "Water Balloon Wars",
      description: "Epic water balloon battles with team strategies and friendly competition",
      icon: "💧",
      ageGroup: "Ages 8+"
    },
    {
      name: "Tug of War",
      description: "Classic team-building activity with multiple rounds and prizes",
      icon: "🪢",
      ageGroup: "Ages 10+"
    },
    {
      name: "Treasure Hunts",
      description: "Adventure-filled treasure hunts around the facility with clues and prizes",
      icon: "🗺️",
      ageGroup: "Ages 6+"
    },
    {
      name: "Water Relay Races",
      description: "Fun relay races incorporating water obstacles and team challenges",
      icon: "🏃",
      ageGroup: "Ages 8+"
    },
    {
      name: "Beach Games",
      description: "Traditional beach games including frisbee, beach ball, and sand castle building",
      icon: "🏖️",
      ageGroup: "All ages"
    }
  ];

  const bookingOptions = [
    {
      title: "Morning Trips",
      time: "9:00 AM - 1:00 PM",
      description: "Perfect for early risers and cooler weather activities",
      includes: ["4 hours of activities", "Light snacks", "Equipment rental", "Supervision"]
    },
    {
      title: "Afternoon Trips",
      time: "2:00 PM - 6:00 PM", 
      description: "Ideal for afternoon fun and sunset activities",
      includes: ["4 hours of activities", "Refreshments", "Equipment rental", "Supervision"]
    },
    {
      title: "Full Day Experience",
      time: "9:00 AM - 6:00 PM",
      description: "Complete day of fun with lunch and extended activities",
      includes: ["9 hours of activities", "Lunch included", "All equipment", "Full supervision"]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('activities.')) {
      const activityName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        activities: {
          ...prev.activities,
          [activityName]: (e.target as HTMLInputElement).checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'radio' ? value : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/.netlify/functions/send-event-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for your event request! Our event coordinator will contact you within 24 hours to discuss the details.');
        setFormData({
          groupSize: '',
          ageRange: '',
          preferredDate: '',
          activities: {
            beachSoccer: false,
            waterSports: false,
            volleyball: false,
            bubbleSoccer: false,
            waterBalloonWars: false,
            tugOfWar: false
          },
          foodOption: '',
          specialRequests: '',
          email: '',
          phone: ''
        });
      } else {
        throw new Error(result.error || 'Failed to submit event request');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error submitting your request. Please try again or contact us directly.');
      console.error('Event form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToBookingForm = () => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Events & Activities</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Create unforgettable memories with our specially designed events, camps, and group activities. 
            Perfect for celebrations, team building, and summer fun!
          </p>
        </div>
      </section>

      {/* Birthday Party Special Highlight */}
      <section id="birthday-party" ref={birthdayPartyRef} className="py-16 bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <PartyPopper className="w-16 h-16 text-yellow-300 animate-bounce" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              🎉 BIRTHDAY PARTY SPECIAL! 🎉
            </h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8 max-w-4xl mx-auto">
              <div className="text-5xl md:text-7xl font-black text-yellow-300 mb-4">
                $250
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Complete Birthday Package
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Clock className="w-6 h-6 text-yellow-300" />
                    <span className="font-semibold">2 Hours of Fun</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Gift className="w-6 h-6 text-yellow-300" />
                    <span className="font-semibold">2 Large Pizzas</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Utensils className="w-6 h-6 text-yellow-300" />
                    <span className="font-semibold">2 Cola Drinks</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Users className="w-6 h-6 text-yellow-300" />
                    <span className="font-semibold">All Activities Included</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/10 rounded-xl">
                <p className="text-lg font-medium">
                  Perfect for kids' birthdays! Includes decorations, setup, and cleanup.
                </p>
              </div>
            </div>
            <button
              onClick={scrollToBookingForm}
              className="inline-flex items-center px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-full transition-colors shadow-lg hover:shadow-xl text-lg"
            >
              <PartyPopper className="w-6 h-6 mr-2" />
              Book Birthday Party Now
            </button>
          </div>
        </div>
      </section>

      {/* Food & Refreshments Info */}
      <section id="food-options" className="py-16 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Utensils className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Food & Refreshments Available
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Enjoy delicious food options during your event or bring your own!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bring Your Own Food */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 text-center">
                🥪 Bring Your Own Food
              </h3>
              <p className="text-white/90 text-center mb-4">
                Feel free to bring your own food and drinks for your event!
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm">Pack your favorite snacks and meals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm">Bring coolers and picnic supplies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm">Designated eating areas available</span>
                </div>
              </div>
            </div>

            {/* Our Food Options */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 text-center">
                🍔 Available On-Site
              </h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="font-bold text-yellow-300 mb-1">🔥 BBQ Grill</h4>
                  <p className="text-sm">Hot Dogs • Burgers</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="font-bold text-yellow-300 mb-1">🥤 Beverages</h4>
                  <p className="text-sm">Fresh Water • Cola Drinks</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="font-bold text-yellow-300 mb-1">🍫 Snacks</h4>
                  <p className="text-sm">Chocolate Bars • Chips • Candy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-xl text-gray-600">Choose from our popular event packages</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border overflow-hidden flex flex-col ${
                  event.highlight ? 'border-pink-300 ring-2 ring-pink-200' : 'border-gray-100'
                }`}
              >
                {event.highlight && (
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2">
                    <span className="font-bold text-sm">⭐ MOST POPULAR ⭐</span>
                  </div>
                )}
                
                <div className="p-6 flex-grow">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6 mx-auto">
                    {event.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{event.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-center text-sm">{event.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Pricing:</span>
                      <span className={`font-semibold ${event.highlight ? 'text-pink-600' : 'text-primary-600'}`}>
                        {event.pricing}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium text-gray-900">{event.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="font-medium text-gray-900">{event.capacity}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">What's Included:</h4>
                    <ul className="space-y-1">
                      {event.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <button
                    onClick={scrollToBookingForm}
                    className={`block w-full py-3 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center text-sm ${
                      event.highlight 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                    }`}
                  >
                    Book This Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Activities Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fun Activities</h2>
            <p className="text-xl text-gray-600">Exciting activities included in all our event packages</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{activity.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{activity.description}</p>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {activity.ageGroup}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Options Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Booking Options</h2>
            <p className="text-xl text-gray-600">Choose the perfect time slot for your group</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {bookingOptions.map((option, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="text-center mb-6">
                  <Clock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-lg font-semibold text-primary-600 mb-2">{option.time}</p>
                  <p className="text-gray-600">{option.description}</p>
                </div>

                <div className="space-y-4 flex-grow">
                  <h4 className="font-semibold text-gray-900">Includes:</h4>
                  {option.includes.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={scrollToBookingForm}
                    className="w-full py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors text-center"
                  >
                    Book This Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Booking Form Section */}
      <section id="group-booking-form" ref={bookingFormRef} className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Group Booking Request</h2>
            <p className="text-xl text-gray-600">Tell us about your event and we'll create the perfect experience</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Size *</label>
                  <select 
                    name="groupSize"
                    value={formData.groupSize}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select group size</option>
                    <option value="10-20">10-20 people</option>
                    <option value="21-50">21-50 people</option>
                    <option value="51-100">51-100 people</option>
                    <option value="100+">100+ people</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range *</label>
                  <select 
                    name="ageRange"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select age range</option>
                    <option value="Children (6-12)">Children (6-12)</option>
                    <option value="Teens (13-17)">Teens (13-17)</option>
                    <option value="Adults (18+)">Adults (18+)</option>
                    <option value="Mixed ages">Mixed ages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (902) 333-3456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Requests</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'beachSoccer', label: 'Beach Soccer' },
                    { key: 'waterSports', label: 'Water Sports' },
                    { key: 'volleyball', label: 'Volleyball' },
                    { key: 'bubbleSoccer', label: 'Bubble Soccer' },
                    { key: 'waterBalloonWars', label: 'Water Balloon Wars' },
                    { key: 'tugOfWar', label: 'Tug of War' }
                  ].map((activity) => (
                    <label key={activity.key} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        name={`activities.${activity.key}`}
                        checked={formData.activities[activity.key as keyof typeof formData.activities]}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                      />
                      <span className="text-sm text-gray-700">{activity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Options</label>
                <div className="space-y-2">
                  {[
                    "Birthday party package ($250 - 2 pizzas + 2 colas)", 
                    "Light snacks only", 
                    "BBQ grill items (hot dogs, burgers)", 
                    "Bring our own food", 
                    "No food needed"
                  ].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="foodOption" 
                        value={option}
                        checked={formData.foodOption === option}
                        onChange={handleInputChange}
                        className="border-gray-300 text-primary-600 focus:ring-primary-500" 
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us about any special requirements, dietary restrictions, or additional requests..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Request...</span>
                  </div>
                ) : (
                  <>
                    <Users className="w-5 h-5 inline mr-2" />
                    Submit Booking Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Plan Your Event?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Our experienced event coordinators are here to help you create the perfect experience. 
            Contact us today to discuss your needs and get a custom quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
            <Link
              to="/book"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Individual Activities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;