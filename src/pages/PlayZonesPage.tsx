import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, DollarSign, Trophy, Waves, MapPin, AlertCircle, Utensils, Gift, PartyPopper } from 'lucide-react';

const PlayZonesPage = () => {
  const playZones = [
    {
      name: "Beach Soccer Field",
      capacity: "Standard field",
      cost: "$65",
      duration: "per hour",
      description: "Professional-grade beach soccer field with soft sand surface, perfect for competitive play and casual games.",
      features: ["Regulation size field", "Premium sand surface", "Goal posts included", "Changing facilities nearby"],
      image: "/WhatsApp Image 2025-06-14 at 23.08.43_b5754562.jpg",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      zoneId: "beach-soccer",
      bookingRequired: true
    },
    {
      name: "Sand Beach Volleyball",
      capacity: "Standard court",
      cost: "$65",
      duration: "per hour",
      description: "Official volleyball court with tournament-quality sand and professional net system.",
      features: ["Tournament-grade sand", "Adjustable net height", "Court boundary lines", "Equipment storage"],
      image: "https://cdn.prod.website-files.com/632871e15b53a0140af28aeb/671a99553cfc0adfd2eaa603_66197cad2759754790f9b6ff_1.jpg",
      icon: <Waves className="w-6 h-6" />,
      color: "from-primary-500 to-primary-600",
      zoneId: "volleyball",
      bookingRequired: true
    },
    {
      name: "Water Soccer Field 1",
      capacity: "5 vs 5 (max 12 players)",
      cost: "$125",
      duration: "per hour",
      description: "Large water soccer field for competitive 5v5 matches with shallow water depth for safety.",
      features: ["Shallow water depth", "Floating goals", "Non-slip surface", "Lifeguard supervision"],
      image: "/WhatsApp Image 2025-06-14 at 23.08.29_527e2ba5.jpg",
      icon: <Users className="w-6 h-6" />,
      color: "from-cyan-500 to-cyan-600",
      zoneId: "water-soccer-1",
      bookingRequired: true
    },
    {
      name: "Water Soccer Field 2",
      capacity: "3 vs 3 (max 8 players)",
      cost: "$100",
      duration: "per hour",
      description: "Compact water soccer field ideal for smaller groups and skill development sessions.",
      features: ["Perfect for beginners", "Controlled water depth", "Smaller field size", "Safety equipment provided"],
      image: "/WhatsApp Image 2025-06-14 at 23.08.44_ecb6604f.jpg",
      icon: <Waves className="w-6 h-6" />,
      color: "from-teal-500 to-teal-600",
      zoneId: "water-soccer-2",
      bookingRequired: true
    },
    {
      name: "Turf Soccer Field",
      capacity: "Standard field",
      cost: "$50",
      duration: "per hour",
      description: "High-quality artificial turf field suitable for all weather conditions and skill levels.",
      features: ["All-weather surface", "Professional markings", "Goal posts included", "Drainage system"],
      image: "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      zoneId: "turf-soccer",
      bookingRequired: true
    },
    {
      name: "Bubble Soccer",
      capacity: "Per bubble rental",
      cost: "$20",
      duration: "per hour",
      description: "Hilarious bubble soccer experience where players are encased in inflatable bubbles.",
      features: ["Inflatable bubble suits", "Safe collision play", "All ages welcome", "Instructor included"],
      image: "/WhatsApp Image 2025-06-14 at 23.07.41_d04c92e9.jpg",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      zoneId: "bubble-soccer",
      bookingRequired: true
    },
    {
      name: "Sandbox Playground",
      capacity: "Kids play zone",
      cost: "$5",
      duration: "entry fee",
      description: "Safe, supervised playground area designed specifically for children with various play equipment. Walk-in only - no booking required!",
      features: ["Age-appropriate equipment", "Soft sand surface", "Shaded areas", "Parent seating", "Walk-in only", "No booking needed"],
      image: "https://trassig.com/cdn/shop/articles/Sandbox_Play_1200x1200.jpg?v=1521839973",
      icon: <MapPin className="w-6 h-6" />,
      color: "from-yellow-500 to-yellow-600",
      zoneId: "sandbox",
      bookingRequired: false
    }
  ];

  const additionalServices = [
    {
      name: "Equipment Rental",
      description: "Soccer balls, volleyballs, and other sports equipment available for rent",
      price: "Included with field rental"
    },
    {
      name: "Group Packages",
      description: "Special rates for groups of 15+ people with multiple activity access",
      price: "Contact for pricing"
    },
    {
      name: "Tournament Hosting",
      description: "Full tournament organization with referees and prizes",
      price: "Custom packages available"
    },
    {
      name: "Birthday Party Package",
      description: "2 hours of activities, 2 large pizzas, and 2 cola drinks",
      price: "$250 complete package"
    }
  ];

  const foodOptions = [
    {
      name: "BBQ Grill Items",
      description: "Hot dogs and burgers available at our on-site grill",
      icon: "🍔"
    },
    {
      name: "Beverages",
      description: "Fresh water and cola drinks to stay hydrated",
      icon: "🥤"
    },
    {
      name: "Snacks & Treats",
      description: "Chocolate bars, chips, candy, and ice cream",
      icon: "🍫"
    },
    {
      name: "Bring Your Own",
      description: "Feel free to bring your own food and drinks",
      icon: "🥪"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Play Zones & Pricing</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover our world-class facilities designed for maximum fun and safety. 
            From competitive sports to family-friendly activities, we have something for everyone.
          </p>
        </div>
      </section>

      {/* Birthday Party Special */}
      <section id="birthday-party" className="py-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <PartyPopper className="w-10 h-10 text-yellow-300 mr-3" />
                <h2 className="text-3xl font-bold">Birthday Party Special</h2>
              </div>
              <p className="text-xl text-white/90 mb-6 max-w-xl">
                Complete birthday package with 2 hours of activities, 2 large pizzas, and 2 cola drinks!
              </p>
              <div className="text-5xl font-black text-yellow-300 mb-4">$250</div>
              <Link
                to="/events#birthday-party"
                className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
              >
                <Gift className="w-5 h-5 mr-2" />
                Book Birthday Party
              </Link>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md">
              <h3 className="font-bold text-xl mb-4 text-center">Package Includes:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-300" />
                  <span>2 Hours of Activities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-yellow-300" />
                  <span>2 Large Pizzas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Utensils className="w-5 h-5 text-yellow-300" />
                  <span>2 Cola Drinks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-yellow-300" />
                  <span>All Activities Included</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PartyPopper className="w-5 h-5 text-yellow-300" />
                  <span>Decorations & Setup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Walk-in Notice */}
      <section className="py-8 bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <p className="text-blue-800 font-medium">
              <strong>Sandbox Playground</strong> is walk-in only - no booking required! Just show up during operating hours (7:00 AM - 9:00 PM) and pay at the facility.
            </p>
          </div>
        </div>
      </section>

      {/* Play Zones Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {playZones.map((zone, index) => (
              <div
                key={index}
                id={zone.name.toLowerCase().replace(/\s+/g, '-')}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 left-4 p-2 bg-gradient-to-r ${zone.color} text-white rounded-full`}>
                    {zone.icon}
                  </div>
                  {!zone.bookingRequired && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      WALK-IN ONLY
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{zone.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{zone.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Capacity</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{zone.capacity}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Cost</span>
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        {zone.cost} <span className="text-sm font-normal text-gray-500">{zone.duration}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {zone.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {zone.bookingRequired ? (
                    <Link
                      to={`/book?zone=${zone.zoneId}`}
                      className={`block w-full py-3 bg-gradient-to-r ${zone.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 text-center`}
                    >
                      Book This Zone
                    </Link>
                  ) : (
                    <div className="text-center">
                      <div className="block w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg mb-2">
                        Walk-in Only
                      </div>
                      <p className="text-xs text-gray-600">
                        No booking required - just show up during operating hours (7:00 AM - 9:00 PM)!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Options Section */}
      <section id="food-options" className="py-20 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Utensils className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Food & Refreshments</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Enjoy delicious food options during your visit or bring your own!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {foodOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                </div>
                <p className="text-white/90 text-sm text-center">
                  {option.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">🎉 Birthday Party Special</h3>
              <p className="text-xl mb-4">Complete package for only <span className="font-bold text-yellow-300">$250</span></p>
              <p className="text-white/90 mb-6">
                Includes 2 hours of activities, 2 large pizzas, and 2 cola drinks!
              </p>
              <Link
                to="/events#birthday-party"
                className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
              >
                <PartyPopper className="w-5 h-5 mr-2" />
                Book Birthday Party
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Quick Pricing Reference</h2>
            <p className="text-xl text-gray-600">All prices are per hour unless otherwise specified</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cost Per Hour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Booking</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {playZones.map((zone, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{zone.name}</td>
                      <td className="px-6 py-4 text-gray-600">{zone.capacity}</td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-primary-600">{zone.cost}</span>
                        <span className="text-sm text-gray-500 ml-1">{zone.duration}</span>
                      </td>
                      <td className="px-6 py-4">
                        {zone.bookingRequired ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Walk-in Only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-pink-50">
                    <td className="px-6 py-4 font-medium text-pink-900">Birthday Party Package</td>
                    <td className="px-6 py-4 text-pink-700">Group celebration</td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-pink-600">$250</span>
                      <span className="text-sm text-pink-500 ml-1">complete package</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                        Special Package
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-xl text-gray-600">Enhance your experience with our extra services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br rounded-2xl p-6 hover:shadow-lg transition-shadow ${
                  service.name === "Birthday Party Package" 
                    ? "from-pink-50 to-pink-100 border-2 border-pink-200" 
                    : "from-gray-50 to-gray-100"
                }`}
              >
                <h3 className={`text-xl font-bold mb-3 ${
                  service.name === "Birthday Party Package" ? "text-pink-900" : "text-gray-900"
                }`}>
                  {service.name}
                </h3>
                <p className={`mb-4 ${
                  service.name === "Birthday Party Package" ? "text-pink-700" : "text-gray-600"
                }`}>
                  {service.description}
                </p>
                <div className={`font-semibold ${
                  service.name === "Birthday Party Package" ? "text-pink-600" : "text-primary-600"
                }`}>
                  {service.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Play?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Book your preferred play zone now and get ready for an unforgettable experience. 
            All bookings include equipment rental and safety supervision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              <Clock className="w-5 h-5 mr-2" />
              Book Activities Online
            </Link>
            <Link
              to="/events#birthday-party"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
            >
              <PartyPopper className="w-5 h-5 mr-2" />
              Book Birthday Party
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg max-w-md mx-auto">
            <p className="text-white/90 text-sm">
              <strong>Remember:</strong> Sandbox Playground is walk-in only - no booking needed! 
              Just show up during operating hours (7:00 AM - 9:00 PM).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlayZonesPage;