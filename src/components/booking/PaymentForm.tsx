import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle, Shield, Gift, Percent } from 'lucide-react';
import stripePromise from '../../lib/stripe';
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

interface PaymentFormProps {
  show: boolean;
  onClose: () => void;
  selectedZone: string;
  selectedTime: string;
  selectedDuration: number;
  selectedDate: string;
  zones: Zone[];
  customerInfo: CustomerInfo;
  calculateTotal: () => number;
  onPaymentSuccess: (paymentIntentId: string) => void;
}

// Stripe Card Element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSmoothing: 'antialiased',
    },
    invalid: {
      color: '#9e2146',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: false,
};

// Payment form component that uses Stripe Elements
const PaymentFormContent: React.FC<Omit<PaymentFormProps, 'show'>> = ({
  onClose,
  selectedZone,
  selectedTime,
  selectedDuration,
  selectedDate,
  zones,
  customerInfo,
  calculateTotal,
  onPaymentSuccess
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [couponValidation, setCouponValidation] = useState<{
    valid: boolean;
    type: string | null;
    discount: number;
    description: string | null;
  }>({
    valid: false,
    type: null,
    discount: 0,
    description: null
  });

  // Validate coupon when component mounts or coupon code changes
  useEffect(() => {
    const validateCoupon = async () => {
      if (!customerInfo.couponCode.trim()) {
        setCouponValidation({
          valid: false,
          type: null,
          discount: 0,
          description: null
        });
        return;
      }

      try {
        const response = await fetch('/.netlify/functions/validate-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ couponCode: customerInfo.couponCode })
        });

        const result = await response.json();

        if (response.ok) {
          setCouponValidation({
            valid: result.valid,
            type: result.type,
            discount: result.discount,
            description: result.description
          });
        } else {
          setCouponValidation({
            valid: false,
            type: null,
            discount: 0,
            description: null
          });
        }
      } catch (error) {
        console.error('Coupon validation error:', error);
        setCouponValidation({
          valid: false,
          type: null,
          discount: 0,
          description: null
        });
      }
    };

    validateCoupon();
  }, [customerInfo.couponCode]);

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setPaymentError(event.error.message);
    } else {
      setPaymentError('');
    }
  };

  // Calculate total with coupon and extras
  const calculateTotalAmount = () => {
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

  const totalAmount = calculateTotalAmount();
  const isFreeBooking = totalAmount === 0;

  const handlePayment = async () => {
    // If booking is free, skip payment processing
    if (isFreeBooking) {
      onPaymentSuccess('free_booking_' + Date.now());
      return;
    }

    if (!stripe || !elements) {
      setPaymentError('Payment system is not ready. Please wait a moment and try again.');
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setPaymentError('Card information is not available. Please refresh the page and try again.');
      return;
    }

    if (!cardComplete) {
      setPaymentError('Please complete all card details before proceeding.');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      const currentZone = zones.find(z => z.id === selectedZone);
      const totalAmountCents = Math.round(totalAmount * 100); // Convert to cents

      // Step 1: Create payment intent
      const paymentResponse = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmountCents,
          currency: 'cad',
          booking_data: {
            zone_id: selectedZone,
            zone_name: currentZone?.name,
            date: selectedDate,
            start_time: selectedTime,
            end_time: calculateEndTime(selectedTime, selectedDuration),
            duration: selectedDuration
          },
          customer_info: customerInfo
        })
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || 'Failed to initialize payment');
      }

      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentResult.client_secret,
        {
          payment_method: {
            card,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone,
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message || 'Payment confirmation failed');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        onPaymentSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment was not completed successfully');
      }

    } catch (error) {
      console.error('Payment error:', error);
      
      let errorMessage = 'Payment failed. Please check your card details and try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('card_declined')) {
          errorMessage = 'Your card was declined. Please try a different payment method.';
        } else if (error.message.includes('insufficient_funds')) {
          errorMessage = 'Insufficient funds. Please try a different payment method.';
        } else if (error.message.includes('expired_card')) {
          errorMessage = 'Your card has expired. Please use a different card.';
        } else if (error.message.includes('incorrect_cvc')) {
          errorMessage = 'Your card\'s security code is incorrect. Please check and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentZone = zones.find(z => z.id === selectedZone);

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          {isFreeBooking ? 'Confirm Free Booking' : 'Secure Payment'}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isProcessing}
        >
          ✕
        </button>
      </div>

      {/* Booking Summary */}
      <div className="bg-primary-50 rounded-xl p-4 mb-6 border border-primary-200">
        <div className="text-center">
          <h4 className="font-semibold text-primary-900 mb-2">{currentZone?.name}</h4>
          <p className="text-primary-700 text-sm">{selectedDate} • {selectedTime} - {calculateEndTime(selectedTime, selectedDuration)}</p>
          
          {/* Cost Breakdown */}
          <div className="mt-3 space-y-1">
            {customerInfo.allergySoap && (
              <p className="text-xs text-primary-600">Allergy Soap: +$9.00</p>
            )}
            {couponValidation.valid && (
              <p className="text-xs text-green-600 font-medium">
                {couponValidation.type === 'free' ? '🎉 FREE with coupon!' : `${couponValidation.discount}% off applied`}
                {couponValidation.description && (
                  <span className="block text-xs text-green-500">{couponValidation.description}</span>
                )}
              </p>
            )}
            <p className={`font-bold text-2xl ${isFreeBooking ? 'text-green-600' : 'text-primary-600'}`}>
              {isFreeBooking ? 'FREE' : `$${totalAmount.toFixed(2)} CAD`}
            </p>
          </div>
        </div>
      </div>

      {/* Free Booking Notice */}
      {isFreeBooking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium text-sm">
              🎉 This booking is FREE! No payment required.
            </span>
          </div>
        </div>
      )}

      {/* Security Notice */}
      {!isFreeBooking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-green-800 font-medium text-sm">Secured by 256-bit SSL encryption</span>
          </div>
        </div>
      )}

      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium text-sm">{paymentError}</span>
          </div>
        </div>
      )}

      {/* Stripe Card Element - Only show if not free */}
      {!isFreeBooking && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information *
            </label>
            <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 min-h-[50px]">
              <CardElement
                options={cardElementOptions}
                onChange={handleCardChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Your card information is encrypted and secure. We support Visa, Mastercard, American Express, and Discover.
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start space-x-2">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-blue-800 text-sm">
            <p className="font-medium mb-1">After {isFreeBooking ? 'confirmation' : 'payment'} you'll receive:</p>
            <ul className="space-y-1 text-xs">
              <li>• Instant booking confirmation</li>
              <li>• Email with waiver and instructions</li>
              <li>• Location and arrival details</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-8">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing || (!isFreeBooking && (!cardComplete || !stripe))}
          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              {isFreeBooking ? (
                <>
                  <Gift className="w-5 h-5 inline mr-2" />
                  Confirm Free Booking
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 inline mr-2" />
                  Pay ${totalAmount.toFixed(2)} CAD
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Main PaymentForm component that wraps with Stripe Elements provider
const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  if (!props.show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Elements stripe={stripePromise}>
        <PaymentFormContent {...props} />
      </Elements>
    </div>
  );
};

export default PaymentForm;