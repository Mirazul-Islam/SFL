import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, ExternalLink, Facebook, Instagram } from 'lucide-react';

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

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/image.png" 
                alt="Splash Fun Land Logo" 
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="text-lg font-bold">Splash Fun Land</h3>
                <p className="text-sm text-gray-400">by Wise Group</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Halifax's premier destination for beach soccer, water games, and family fun. 
              Supporting community initiatives since 2016.
            </p>
            
            {/* Organization Logos */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">Operated by:</p>
                <div className="flex items-center space-x-3">
                  <img 
                    src="/WhatsApp Image 2025-06-12 at 00.52.37_920b233b.jpg" 
                    alt="Wise SFL Corporation Logo" 
                    className="h-12 w-auto object-contain bg-white rounded-lg p-1"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">Wise_SFL Corporation</p>
                    <p className="text-xs text-gray-400">Operating Entity</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 mb-2">Supporting:</p>
                <div className="flex items-center space-x-3">
                  <img 
                    src="/WhatsApp Image 2025-06-12 at 00.52.53_0d658c38.jpg" 
                    alt="Wise Group Logo" 
                    className="h-12 w-auto object-contain bg-white rounded-lg p-1"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">Wisegroup Nonprofit</p>
                    <p className="text-xs text-gray-400">Community Association</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1AUH6wJjVn/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/splashfunland"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@splashfunland"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 rounded-full transition-colors shadow-lg hover:shadow-xl"
                aria-label="Follow us on TikTok"
              >
                <TikTokIcon className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Play Zones & Pricing', href: '/play-zones' },
                { name: 'Events & Camps', href: '/events' },
                { name: 'Waiver & Policies', href: '/waiver' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">344 Sackville Dr</p>
                  <p className="text-sm text-gray-300">Lower Sackville, NS B4C 2R6</p>
                  <p className="text-xs text-gray-400">Canada</p>
                  <p className="text-xs text-gray-400 mt-1">Located inside the fenced area</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <p className="text-sm text-gray-300">+1 (902) 333-3456</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <p className="text-sm text-gray-300">wisesoccerfootballleague@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Follow & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="w-4 h-4 text-red-400 mr-2" />
              Follow & Support
            </h4>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Follow us on social media for updates, behind-the-scenes content, and community highlights!
            </p>
            
            {/* Social Media Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <a
                href="https://www.facebook.com/share/1AUH6wJjVn/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-center"
              >
                <Facebook className="w-5 h-5 mb-1" />
                <span className="text-xs">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/splashfunland"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-colors text-center"
              >
                <Instagram className="w-5 h-5 mb-1" />
                <span className="text-xs">Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@splashfunland"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 rounded-lg transition-colors text-center shadow-lg hover:shadow-xl"
              >
                <TikTokIcon className="w-5 h-5 mb-1 text-white" />
                <span className="text-xs">TikTok</span>
              </a>
            </div>
            
            <a
              href="https://WisegroupCanada.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
            >
              Visit Wisegroup Canada
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 Splash Fun Land. Operated by Wise_SFL Corporation in support of Wisegroup Nonprofit Association.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Powered by{' '}
                <a
                  href="https://lightpillarads.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  lightpillarads.com
                </a>
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/waiver" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/waiver" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;