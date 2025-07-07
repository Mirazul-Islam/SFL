import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Shield, 
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Waves
} from 'lucide-react';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "Booking & Reservations",
      icon: <Calendar className="w-6 h-6 text-primary-500" />,
      faqs: [
        {
          question: "How far in advance do I need to book?",
          answer: "All bookings must be made at least 4 hours in advance. This ensures we have adequate time to prepare your activity and maintain our high service standards. Time slots that are less than 4 hours away will appear as unavailable in our booking system."
        },
        {
          question: "Can I book multiple activities at once?",
          answer: "Yes! You can book multiple time slots for different activities. Each activity requires a separate booking, but you can make multiple reservations in one session. Group packages are also available for multiple activities."
        },
        {
          question: "What if I need to cancel or reschedule?",
          answer: "We have a no-refund policy - all sales are final. However, in case of severe weather or facility closure, we may offer rescheduling options or credits toward future bookings. Please contact us as soon as possible if you need to discuss your booking."
        },
        {
          question: "Can I walk in without a booking?",
          answer: "Most activities require advance booking. However, our Sandbox Playground is walk-in only - no booking required! Just show up during operating hours (7:00 AM - 9:00 PM) and pay the $5 entry fee at the facility."
        },
        {
          question: "How do I know if my booking is confirmed?",
          answer: "You'll receive an instant confirmation email after successful payment. This email contains your booking details and signed waiver that you must bring to the facility. If you don't receive the email, check your spam folder or contact us."
        }
      ]
    },
    {
      title: "Pricing & Payments",
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      faqs: [
        {
          question: "What are your activity prices?",
          answer: "Prices vary by activity: Beach Soccer & Volleyball ($65/hour), Water Soccer Field 1 ($125/hour), Water Soccer Field 2 ($100/hour), Turf Soccer ($50/hour), Bubble Soccer ($20/hour per bubble), and Sandbox Playground ($5 entry fee, walk-in only)."
        },
        {
          question: "Do you offer group discounts?",
          answer: "Yes! We offer special rates for groups of 15+ people with access to multiple activities. Contact us for custom group packages and pricing. We also host tournaments and special events with competitive rates."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure online booking system powered by Stripe. All payments are processed in Canadian dollars (CAD)."
        },
        {
          question: "Are there any additional fees?",
          answer: "Equipment rental is included with all field bookings. Optional add-ons include special allergy-free soap (+$9). We also offer coupon codes for discounts - ask about current promotions!"
        },
        {
          question: "What is your refund policy?",
          answer: "All sales are final - no refunds are provided after payment. In case of severe weather or facility closure, we may offer rescheduling or credits. Please review all booking details carefully before completing your purchase."
        }
      ]
    },
    {
      title: "Facilities & Activities",
      icon: <Waves className="w-6 h-6 text-blue-500" />,
      faqs: [
        {
          question: "What activities do you offer?",
          answer: "We offer Beach Soccer, Sand Beach Volleyball, Water Soccer (two field sizes), Turf Soccer, Bubble Soccer, and a Sandbox Playground for kids. Each activity is designed for different group sizes and skill levels."
        },
        {
          question: "What should I bring?",
          answer: "Bring appropriate swimwear and footwear for water activities, towels, sunscreen, water bottle, and a change of clothes. Most importantly, bring your signed waiver email (printed or on phone) - entry is not permitted without it!"
        },
        {
          question: "Do you provide equipment?",
          answer: "Yes! All necessary sports equipment (balls, nets, goals) is included with field rentals. For Bubble Soccer, we provide the inflatable bubble suits. Safety equipment and supervision are also included."
        },
        {
          question: "What are your operating hours?",
          answer: "We're open daily from 7:00 AM to 9:00 PM during our summer season (May - September). Hours may vary during off-season and holidays. Check our website or call for current hours."
        },
        {
          question: "Is the facility suitable for all ages?",
          answer: "Absolutely! We're designed as a family-friendly environment with activities for all ages. Our Sandbox Playground is specifically for children, while other activities can accommodate various age groups and skill levels."
        }
      ]
    },
    {
      title: "Safety & Waivers",
      icon: <Shield className="w-6 h-6 text-red-500" />,
      faqs: [
        {
          question: "Do I need to sign a waiver?",
          answer: "Yes, all participants must complete and sign our digital waiver before arrival. You can sign it online at our waiver page. You must bring the signed waiver email (printed or on phone) to show staff upon arrival - entry is not permitted without it."
        },
        {
          question: "What about waivers for children?",
          answer: "Participants under 18 require a parent or guardian to sign the waiver on their behalf. The parent/guardian must also be present during check-in to verify their identity and the signed waiver."
        },
        {
          question: "What safety measures do you have?",
          answer: "We provide professional supervision for all activities, safety equipment, comprehensive safety briefings, and maintain all equipment to high standards. Our staff are trained in first aid and emergency procedures."
        },
        {
          question: "What if someone gets injured?",
          answer: "While we take every precaution, recreational activities involve inherent risks. Our staff are trained to handle emergencies and will provide immediate assistance. All participants acknowledge these risks by signing our waiver."
        },
        {
          question: "Are there any activity restrictions?",
          answer: "Participants should be in reasonable physical condition for their chosen activities. Those with medical conditions should consult their doctor before participating. We reserve the right to restrict participation for safety reasons."
        }
      ]
    },
    {
      title: "Location & Logistics",
      icon: <MapPin className="w-6 h-6 text-purple-500" />,
      faqs: [
        {
          question: "Where are you located?",
          answer: "We're located at 344 Sackville Dr, Lower Sackville, NS B4C 2R6, Canada. We're easily accessible from the Halifax metro area with convenient parking available on-site."
        },
        {
          question: "Is parking available?",
          answer: "Yes, we provide free parking for all visitors. Follow the signs to our designated parking areas when you arrive. There's ample space for both regular vehicles and larger group transportation."
        },
        {
          question: "How early should I arrive?",
          answer: "Please arrive 15 minutes before your scheduled time for check-in, waiver verification, and safety briefing. This ensures your activity starts on time and you get the full duration you've booked."
        },
        {
          question: "What happens if I'm late?",
          answer: "If you arrive late, your activity time may be shortened as we need to maintain our schedule for other bookings. We cannot extend your session or provide refunds for time lost due to late arrival."
        },
        {
          question: "Do you have changing facilities?",
          answer: "Yes, we have changing facilities and restrooms available on-site. We recommend arriving in appropriate attire or bringing a change of clothes for after water activities."
        }
      ]
    }
  ];

  const quickHelp = [
    {
      title: "Book Activities",
      description: "Reserve your time slot online",
      link: "/book",
      icon: <Calendar className="w-8 h-8 text-primary-500" />,
      color: "from-primary-500 to-primary-600"
    },
    {
      title: "Sign Waiver",
      description: "Complete required waiver form",
      link: "/waiver",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      color: "from-red-500 to-red-600"
    },
    {
      title: "Contact Us",
      description: "Get personalized assistance",
      link: "/contact",
      icon: <Phone className="w-8 h-8 text-green-500" />,
      color: "from-green-500 to-green-600"
    },
    {
      title: "View Pricing",
      description: "See all activity rates",
      link: "/play-zones",
      icon: <DollarSign className="w-8 h-8 text-yellow-500" />,
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <HelpCircle className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Find answers to common questions about booking, activities, safety, and more. 
            Can't find what you're looking for? We're here to help!
          </p>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Help</h2>
            <p className="text-xl text-gray-600">Need immediate assistance? Try these quick actions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickHelp.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group block p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} text-white rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find answers organized by topic</p>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {category.icon}
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex; // Unique index
                    const isOpen = openItems.includes(globalIndex);
                    
                    return (
                      <div key={faqIndex} className="p-6">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full flex items-center justify-between text-left group"
                        >
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors pr-4">
                            {faq.question}
                          </h4>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-primary-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                            )}
                          </div>
                        </button>
                        
                        {isOpen && (
                          <div className="mt-4 prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency & Important Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-3">Important Reminders</h3>
                  <ul className="space-y-2 text-red-800">
                    <li>• Signed waiver required for entry (no exceptions)</li>
                    <li>• 4-hour advance booking required</li>
                    <li>• All sales are final - no refunds</li>
                    <li>• Arrive 15 minutes early for check-in</li>
                    <li>• Parent/guardian required for minors</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-3">What's Included</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• All sports equipment and gear</li>
                    <li>• Professional supervision and safety briefing</li>
                    <li>• Access to changing facilities and restrooms</li>
                    <li>• Free parking on-site</li>
                    <li>• Safety equipment and first aid support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Our friendly team is here to help! Contact us for personalized assistance with bookings, 
            group events, or any other questions about your visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
            <a
              href="tel:+19023333456"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: (902) 333-3456
            </a>
          </div>
          
          <div className="mt-8 text-white/80">
            <p className="text-sm">
              <strong>Operating Hours:</strong> Daily 7:00 AM - 9:00 PM (Summer Season) | 
              <strong> Response Time:</strong> Within 24 hours during business days
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;