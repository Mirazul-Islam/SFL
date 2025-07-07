import React, { useEffect, useRef, useState } from 'react';
import { Shield, FileText, AlertCircle, Percent, Gift, X } from 'lucide-react';
import { Zone, calculateEndTime } from '../../lib/supabase';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  groupSize: string;
  specialRequests: string;
  allergySoap: boolean;
  couponCode: string;
}

interface BookingFormProps {
  show: boolean;
  onClose: () => void;
  selectedZone: string;
  selectedTime: string;
  selectedDuration: number;
  selectedDate: string;
  zones: Zone[];
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  waiverAccepted: boolean;
  onWaiverAcceptedChange: (accepted: boolean) => void;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
  calculateTotal: () => number;
  onSubmit: () => void;
  isFormValid: () => boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  show,
  onClose,
  selectedZone,
  selectedTime,
  selectedDuration,
  selectedDate,
  zones,
  customerInfo,
  onCustomerInfoChange,
  waiverAccepted,
  onWaiverAcceptedChange,
  termsAccepted,
  onTermsAcceptedChange,
  calculateTotal,
  onSubmit,
  isFormValid
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [couponValidation, setCouponValidation] = useState<{
    valid: boolean;
    type: string | null;
    discount: number;
    description: string | null;
    loading: boolean;
    error?: string;
    minDuration?: number;
  }>({
    valid: false,
    type: null,
    discount: 0,
    description: null,
    loading: false
  });

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
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
  }, [show, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [show, onClose]);

  // Validate coupon when code changes
  useEffect(() => {
    const validateCoupon = async () => {
      if (!customerInfo.couponCode.trim()) {
        setCouponValidation({
          valid: false,
          type: null,
          discount: 0,
          description: null,
          loading: false
        });
        return;
      }

      setCouponValidation(prev => ({ ...prev, loading: true }));

      try {
        const response = await fetch('/.netlify/functions/validate-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            couponCode: customerInfo.couponCode,
            duration: selectedDuration 
          })
        });

        const result = await response.json();

        if (response.ok) {
          setCouponValidation({
            valid: result.valid,
            type: result.type,
            discount: result.discount,
            description: result.description,
            loading: false,
            error: result.error,
            minDuration: result.minDuration
          });
        } else {
          throw new Error(result.error || 'Failed to validate coupon');
        }
      } catch (error) {
        console.error('Coupon validation error:', error);
        setCouponValidation({
          valid: false,
          type: null,
          discount: 0,
          description: null,
          loading: false
        });
      }
    };

    // Debounce the validation
    const timeoutId = setTimeout(validateCoupon, 500);
    return () => clearTimeout(timeoutId);
  }, [customerInfo.couponCode, selectedDuration]);

  if (!show) return null;

  const handleInputChange = (field: keyof CustomerInfo, value: string | boolean) => {
    onCustomerInfoChange({
      ...customerInfo,
      [field]: value
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calculate total with coupon and allergy soap
  const calculateTotalWithExtras = () => {
    const baseTotal = calculateTotal();
    const allergySoapCost = customerInfo.allergySoap ? 9 : 0;
    const subtotal = baseTotal + allergySoapCost;
    
    if (couponValidation.valid) {
      if (couponValidation.type === 'free') {
        return 0;
      } else if (couponValidation.type === 'percentage') {
        return subtotal * (1 - couponValidation.discount / 100);
      }
    }
    
    return subtotal;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pr-10">Booking Details</h3>
        
        {/* Booking Summary */}
        <div className="bg-primary-50 rounded-xl p-4 mb-4 sm:mb-6 border border-primary-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-primary-700">Activity:</span>
              <p className="font-medium">{zones.find(z => z.id === selectedZone)?.name}</p>
            </div>
            <div>
              <span className="text-primary-700">Date:</span>
              <p className="font-medium">{selectedDate}</p>
            </div>
            <div>
              <span className="text-primary-700">Time:</span>
              <p className="font-medium">{selectedTime} - {calculateEndTime(selectedTime, selectedDuration)}</p>
            </div>
            <div>
              <span className="text-primary-700">Total:</span>
              <div className="space-y-1">
                {customerInfo.allergySoap && (
                  <p className="text-xs text-gray-600">Base: ${calculateTotal()} + Allergy Soap: $9</p>
                )}
                {couponValidation.valid && (
                  <p className="text-xs text-green-600">
                    {couponValidation.type === 'free' ? 'FREE with coupon!' : `${couponValidation.discount}% off applied`}
                  </p>
                )}
                <p className="font-bold text-lg text-primary-600">${calculateTotalWithExtras().toFixed(2)} CAD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Size *</label>
            <select
              value={customerInfo.groupSize}
              onChange={(e) => handleInputChange('groupSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select group size</option>
              <option value="1-2">1-2 people</option>
              <option value="3-5">3-5 people</option>
              <option value="6-10">6-10 people</option>
              <option value="11-15">11-15 people</option>
              <option value="16+">16+ people</option>
            </select>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Gift className="w-5 h-5 text-purple-600" />
              <label className="block text-sm font-medium text-purple-900">Coupon Code (Optional)</label>
            </div>
            <input
              type="text"
              value={customerInfo.couponCode}
              onChange={(e) => handleInputChange('couponCode', e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter coupon code (e.g., CANADADAY)"
            />
            {customerInfo.couponCode && (
              <div className="mt-2">
                {couponValidation.loading ? (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-sm">Validating coupon...</span>
                  </div>
                ) : couponValidation.error ? (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{couponValidation.error}</span>
                  </div>
                ) : couponValidation.valid ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Percent className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {couponValidation.type === 'free' 
                        ? 'Coupon applied: FREE booking!' 
                        : `Coupon applied: ${couponValidation.discount}% off!`
                      }
                      {couponValidation.description && (
                        <span className="text-xs text-green-500 block">{couponValidation.description}</span>
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Invalid coupon code</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Canada Day Special Notice */}
            {customerInfo.couponCode.toUpperCase() === 'CANADADAY' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">🇨🇦</span>
                  <div>
                    <p className="text-sm font-medium text-red-800">Canada Day Special!</p>
                    <p className="text-xs text-red-700">
                      50% off for bookings of 2+ hours. Perfect for celebrating Canada Day with family and friends!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Allergy Soap Option */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={customerInfo.allergySoap}
                    onChange={(e) => handleInputChange('allergySoap', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-blue-900">
                      Special Allergy-Free Soap (+$9)
                    </span>
                    <p className="text-xs text-blue-700 mt-1">
                      Request hypoallergenic, fragrance-free soap for sensitive skin or allergies. 
                      This premium soap is specially formulated for those with skin sensitivities.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
            <textarea
              rows={3}
              value={customerInfo.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any special requirements, dietary restrictions, or additional requests..."
            ></textarea>
          </div>

          {/* Waiver and Terms Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start space-x-3 mb-4">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2 text-sm sm:text-base">Required Agreements</h4>
                <p className="text-red-800 text-xs sm:text-sm mb-4">
                  All participants must accept our waiver and terms before booking. You will receive a signed waiver via email that must be shown upon arrival.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  checked={waiverAccepted}
                  onChange={(e) => onWaiverAcceptedChange(e.target.checked)}
                  required
                />
                <span className="text-xs sm:text-sm text-gray-700">
                  <strong>I accept the liability waiver.</strong> I understand the risks involved in recreational activities and release Splash Fun Land from liability. I acknowledge that all participants must sign a waiver before activities.
                </span>
              </label>
              
              <label className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  checked={termsAccepted}
                  onChange={(e) => onTermsAcceptedChange(e.target.checked)}
                  required
                />
                <span className="text-xs sm:text-sm text-gray-700">
                  <strong>I agree to all terms and conditions.</strong> I accept the park rules, media policy, refund policy, and all other terms of service for Splash Fun Land.
                </span>
              </label>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-blue-800">
                  <strong>Complete Waiver Form:</strong> After booking, you'll need to fill out our complete waiver form. 
                  <a 
                    href="/waiver" 
                    target="_blank" 
                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                  >
                    Click here to access the waiver form
                  </a>
                </div>
              </div>
            </div>

            {(!waiverAccepted || !termsAccepted || !customerInfo.groupSize) && (
              <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs sm:text-sm text-red-700 font-medium">
                    {!customerInfo.groupSize 
                      ? 'Group size is required. Please select your group size above.'
                      : 'Both agreements must be accepted before you can proceed to payment.'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
          >
            Back to Calendar
          </button>
          <button
            onClick={onSubmit}
            disabled={!isFormValid()}
            className={`flex-1 py-3 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base ${
              isFormValid()
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isFormValid() ? `Continue to Payment - $${calculateTotalWithExtras().toFixed(2)}` : 'Please Complete All Requirements'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;