import React, { useEffect, useRef } from 'react';
import { Check, Mail, Navigation, FileText, Users, Shield, MapPin, ExternalLink, Clock, Phone } from 'lucide-react';
import { Zone, calculateEndTime } from '../../lib/supabase';

interface BookingConfirmationProps {
  show: boolean;
  selectedZone: string;
  selectedTime: string;
  selectedDuration: number;
  selectedDate: string;
  zones: Zone[];
  calculateTotal: () => number;
  onReset: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  show,
  selectedZone,
  selectedTime,
  selectedDuration,
  selectedDate,
  zones,
  calculateTotal,
  onReset
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onReset();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [show, onReset]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onReset();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [show, onReset]);

  if (!show) return null;

  const currentZone = zones.find(z => z.id === selectedZone);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-base sm:text-lg text-gray-600">
            Your adventure at Splash Fun Land is all set!
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-green-50 rounded-lg p-4 sm:p-6 mb-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">📅 Your Booking Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700">Activity:</span>
              <p className="font-medium text-green-900">{currentZone?.name}</p>
            </div>
            <div>
              <span className="text-green-700">Date:</span>
              <p className="font-medium text-green-900">{selectedDate}</p>
            </div>
            <div>
              <span className="text-green-700">Time:</span>
              <p className="font-medium text-green-900">{selectedTime} - {calculateEndTime(selectedTime, selectedDuration)}</p>
            </div>
            <div>
              <span className="text-green-700">Total Cost:</span>
              <p className="font-bold text-lg text-green-600">${calculateTotal()} CAD</p>
            </div>
          </div>
        </div>

        {/* Important Next Steps */}
        <div className="space-y-4 sm:space-y-6">
          {/* Location & Where to Find Us */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 mb-3 text-base sm:text-lg">📍 Where to Find Us</h4>
                
                <div className="bg-white border border-blue-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-blue-900 text-sm sm:text-base">Splash Fun Land</p>
                      <p className="text-blue-800 text-xs sm:text-sm">344 Sackville Dr</p>
                      <p className="text-blue-800 text-xs sm:text-sm">Lower Sackville, NS B4C 2R6, Canada</p>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/wWpFvxaahGn7p95J9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      Get Directions
                    </a>
                  </div>
                  
                  <div className="border-t border-blue-200 pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Operating Hours</p>
                          <p className="text-blue-700">Daily: 9:00 AM - 8:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Contact</p>
                          <p className="text-blue-700">+1 (902) 333-3456</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-blue-800 text-xs sm:text-sm">
                  <p>• <strong>Arrive 15 minutes early</strong> for check-in and safety briefing</p>
                  <p>• <strong>Look for our signage</strong> and staff in Splash Fun Land uniforms</p>
                  <p>• <strong>Parking available</strong> - follow signs to designated areas</p>
                  <p>• <strong>Easy access</strong> from Halifax metro area via Sackville Drive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Waiver Signing Instructions */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-red-900 mb-3 text-base sm:text-lg">🛡️ REQUIRED: Sign Your Waiver Now</h4>
                
                <div className="bg-white border-2 border-red-300 rounded-lg p-4 mb-4">
                  <p className="text-red-900 font-semibold text-sm sm:text-base mb-3">
                    ⚠️ You must complete and sign the waiver before your visit!
                  </p>
                  <a
                    href="/waiver"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base shadow-lg"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Sign Waiver Here
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>

                <div className="space-y-2 text-red-800 text-xs sm:text-sm">
                  <p>• <strong>Use the link above</strong> to access and complete the digital waiver form</p>
                  <p>• <strong>Check your email</strong> (including spam folder) for your signed waiver confirmation</p>
                  <p>• <strong>Everyone in your group</strong> must sign their own individual waiver</p>
                  <p>• <strong>Bring signed waivers</strong> (printed or on phone) to show staff upon arrival</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">📧 After Signing Your Waiver</h4>
                <p className="text-purple-800 text-xs sm:text-sm mb-3">
                  Once you complete the waiver form, you'll receive a signed waiver email confirmation. 
                  <strong> Check your spam folder</strong> if you don't see it in your inbox.
                </p>
                <div className="bg-white border border-purple-300 rounded-lg p-3">
                  <p className="text-purple-900 text-xs sm:text-sm font-medium">
                    📧 Look for: "Signed Waiver - Splash Fun Land Booking Confirmation"
                  </p>
                  <p className="text-purple-700 text-xs mt-1">
                    from: wisesoccerfootballleague@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Group Requirements */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">👥 Group Waiver Requirements</h4>
                <div className="text-orange-800 text-xs sm:text-sm">
                  <p className="mb-2"><strong>Each person</strong> in your group must complete their own waiver and bring it to the facility.</p>
                  <p className="font-semibold">
                    ⚠️ No one will be allowed to participate without a signed waiver!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What to Bring & Arrival */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-3 text-sm sm:text-base">🎒 What to Bring</h4>
              <ul className="space-y-1 text-yellow-800 text-xs sm:text-sm">
                <li>• <strong>Signed waiver email</strong> (REQUIRED)</li>
                <li>• Swimwear and towel</li>
                <li>• Sunscreen and water</li>
                <li>• Valid ID for verification</li>
                <li>• Change of clothes</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3 text-sm sm:text-base">⏰ Upon Arrival</h4>
              <ul className="space-y-1 text-green-700 text-xs sm:text-sm">
                <li>• Arrive <strong>15 minutes early</strong></li>
                <li>• Check in at reception</li>
                <li>• Show signed waiver to staff</li>
                <li>• Complete safety briefing</li>
                <li>• Enjoy your experience!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <a
            href="/waiver"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-center text-sm sm:text-base shadow-lg flex items-center justify-center"
          >
            <Shield className="w-4 h-4 mr-2" />
            Sign Waiver Now
          </a>
          <button
            onClick={onReset}
            className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors text-sm sm:text-base"
          >
            Book Another Activity
          </button>
          <a
            href="/"
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-center text-sm sm:text-base"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;