import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, parseISO, isBefore, startOfDay } from 'date-fns';
import { supabase, Zone, Booking, generateTimeSlots, calculateEndTime, isTimeSlotAvailable, convertTo24Hour, isBookingTimeValid } from '../lib/supabase';

// Import components
import BookingHero from '../components/booking/BookingHero';
import DemoModeWarning from '../components/booking/DemoModeWarning';
import DateNavigation from '../components/booking/DateNavigation';
import BookingControls from '../components/booking/BookingControls';
import BookingInstructions from '../components/booking/BookingInstructions';
import TimeSlotGrid from '../components/booking/TimeSlotGrid';
import BookingSummary from '../components/booking/BookingSummary';
import BookingForm from '../components/booking/BookingForm';
import PaymentForm from '../components/booking/PaymentForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';

const BookingPage = () => {
  // Initialize with today's date to prevent past date selection
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [zones, setZones] = useState<Zone[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [filterZone, setFilterZone] = useState('all');
  const [error, setError] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    groupSize: '',
    specialRequests: '',
    allergySoap: false,
    couponCode: ''
  });
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState('');

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  useEffect(() => {
    if (zones.length > 0) {
      setTimeSlots(generateTimeSlots('07:00', '21:00')); // Updated to 7:00 AM - 9:00 PM
    }
  }, [zones]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: supabaseError } = await supabase
        .from('zones')
        .select('*')
        .eq('active', true)
        .order('name');

      if (supabaseError) throw supabaseError;
      setZones(data || []);
    } catch (error) {
      console.error('Error fetching zones:', error);
      setError('Failed to load play zones. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', selectedDate)
        .eq('status', 'confirmed');

      if (supabaseError) throw supabaseError;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Don't show alert for booking fetch errors as it's not critical
    }
  };

  const refreshBookings = async () => {
    await fetchBookings();
  };

  const goToPreviousDay = () => {
    const prevDate = subDays(parseISO(selectedDate), 1);
    const prevDateString = format(prevDate, 'yyyy-MM-dd');
    
    // Prevent going to past dates
    if (isBefore(startOfDay(prevDate), startOfDay(new Date()))) {
      return; // Don't allow navigation to past dates
    }
    
    setSelectedDate(prevDateString);
  };

  const goToNextDay = () => {
    const nextDate = addDays(parseISO(selectedDate), 1);
    setSelectedDate(format(nextDate, 'yyyy-MM-dd'));
  };

  const handleDateChange = (newDate: string) => {
    // Validate that the new date is not in the past
    const newDateObj = parseISO(newDate);
    if (isBefore(startOfDay(newDateObj), startOfDay(new Date()))) {
      return; // Don't allow past dates
    }
    setSelectedDate(newDate);
  };

  const getFilteredZones = () => {
    if (filterZone === 'all') {
      return zones;
    }
    return zones.filter(zone => zone.id === filterZone);
  };

  const scrollToBookingSummary = () => {
    // Scroll to booking summary section with smooth animation
    setTimeout(() => {
      const summaryElement = document.querySelector('[data-booking-summary]');
      if (summaryElement) {
        summaryElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleTimeSlotClick = async (zoneId: string, time: string) => {
    // Check if selected date is in the past
    const selectedDateObj = parseISO(selectedDate);
    if (isBefore(startOfDay(selectedDateObj), startOfDay(new Date()))) {
      alert('Cannot book activities for past dates. Please select today or a future date.');
      return;
    }

    // Check if booking is at least 4 hours in advance
    if (!isBookingTimeValid(selectedDate, time)) {
      alert('Bookings must be made at least 4 hours in advance. Please select a later time slot.');
      return;
    }

    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    if (selectedDuration < zone.min_duration || selectedDuration > zone.max_duration) {
      alert(`Duration must be between ${zone.min_duration} and ${zone.max_duration} hours for this activity.`);
      return;
    }

    // Convert 12-hour time to 24-hour for comparison with database
    const time24 = convertTo24Hour(time);
    
    // Check if this exact time slot is booked
    const booking = bookings.find(b => 
      b.zone_id === zoneId && 
      b.start_time <= time24 && 
      b.end_time > time24 &&
      b.status === 'confirmed'
    );

    if (booking) {
      console.log('Slot is booked:', booking);
      return;
    }

    // Check if this slot would be available for the selected duration (includes blocked time check)
    const isAvailable = await isTimeSlotAvailable(bookings, zoneId, selectedDate, time, selectedDuration);
    
    if (isAvailable) {
      // Check if booking would extend beyond zone operating hours
      const endTime = calculateEndTime(time, selectedDuration);
      const endTime24 = convertTo24Hour(endTime);
      const zoneEndTime = zone?.available_end || '21:00'; // Updated to 9:00 PM
      
      if (endTime24 <= zoneEndTime) {
        setSelectedZone(zoneId);
        setSelectedTime(time);
        
        // Auto-scroll to booking summary after selection
        scrollToBookingSummary();
      }
    }
  };

  // Validate coupon using serverless function
  const validateCoupon = async (code: string) => {
    if (!code.trim()) {
      return { valid: false, type: null, discount: 0 };
    }

    try {
      const response = await fetch('/.netlify/functions/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: code })
      });

      const result = await response.json();

      if (response.ok) {
        return {
          valid: result.valid,
          type: result.type,
          discount: result.discount
        };
      } else {
        return { valid: false, type: null, discount: 0 };
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      return { valid: false, type: null, discount: 0 };
    }
  };

  const calculateTotal = async () => {
    const zone = zones.find(z => z.id === selectedZone);
    if (!zone) return 0;
    
    const baseTotal = zone.hourly_rate * selectedDuration;
    const allergySoapCost = customerInfo.allergySoap ? 9 : 0;
    const subtotal = baseTotal + allergySoapCost;
    
    const couponResult = await validateCoupon(customerInfo.couponCode);
    
    if (couponResult.valid) {
      if (couponResult.type === 'free') {
        return 0;
      } else if (couponResult.type === 'percentage') {
        return subtotal * (1 - couponResult.discount / 100);
      }
    }
    
    return subtotal;
  };

  const calculateBaseTotal = () => {
    const zone = zones.find(z => z.id === selectedZone);
    if (!zone) return 0;
    return zone.hourly_rate * selectedDuration;
  };

  const handleBookingFormSubmit = () => {
    // Additional validation for past dates
    const selectedDateObj = parseISO(selectedDate);
    if (isBefore(startOfDay(selectedDateObj), startOfDay(new Date()))) {
      alert('Cannot book activities for past dates. Please select today or a future date.');
      return;
    }

    // Additional validation for 4-hour advance booking
    if (!isBookingTimeValid(selectedDate, selectedTime)) {
      alert('Bookings must be made at least 4 hours in advance. Please select a later time slot.');
      return;
    }

    if (!selectedZone || !selectedTime || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.groupSize) {
      alert('Please fill in all required fields including group size.');
      return;
    }

    if (!waiverAccepted || !termsAccepted) {
      alert('Please accept both the waiver and terms & conditions before proceeding.');
      return;
    }

    // Move to payment form
    setShowBookingForm(false);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setPaymentIntentId(paymentId);
    
    try {
      // Final validation for past dates before creating booking
      const selectedDateObj = parseISO(selectedDate);
      if (isBefore(startOfDay(selectedDateObj), startOfDay(new Date()))) {
        throw new Error('Cannot create booking for past dates.');
      }

      // Final validation for 4-hour advance booking
      if (!isBookingTimeValid(selectedDate, selectedTime)) {
        throw new Error('Bookings must be made at least 4 hours in advance.');
      }

      const currentZone = zones.find(z => z.id === selectedZone);
      const endTime = calculateEndTime(selectedTime, selectedDuration);
      
      // Convert times to 24-hour format for database storage
      const startTime24 = convertTo24Hour(selectedTime);
      const endTime24 = convertTo24Hour(endTime);
      
      // Calculate final total with coupon
      const finalTotal = await calculateTotal();
      
      const bookingData = {
        zone_id: selectedZone,
        date: selectedDate,
        start_time: startTime24,
        end_time: endTime24,
        duration: selectedDuration,
        customer_info: customerInfo,
        total_cost: finalTotal,
        status: 'confirmed',
        payment_id: paymentId
      };

      console.log('Creating booking in database...', bookingData);

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      console.log('Booking created successfully:', data);
      
      // Send booking confirmation email
      await sendBookingConfirmationEmail(currentZone, endTime, paymentId, finalTotal);
      
      // Send waiver email
      await sendWaiverEmail(currentZone, endTime);

      // Show confirmation
      setShowPaymentForm(false);
      setShowConfirmation(true);
      
      await refreshBookings();
      
    } catch (error) {
      console.error('Error completing booking:', error);
      alert('There was an error completing your booking. Please contact support with your payment ID: ' + paymentId);
    }
  };

  const sendBookingConfirmationEmail = async (currentZone: Zone | undefined, endTime: string, paymentId: string, finalTotal: number) => {
    try {
      const couponResult = await validateCoupon(customerInfo.couponCode);
      
      const bookingEmailData = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        date: selectedDate,
        time: `${selectedTime} - ${endTime}`,
        playZone: currentZone?.name || 'Unknown Zone',
        partySize: customerInfo.groupSize,
        specialRequests: customerInfo.specialRequests || '',
        duration: selectedDuration,
        totalCost: finalTotal,
        paymentId: paymentId,
        allergySoap: customerInfo.allergySoap,
        couponCode: customerInfo.couponCode,
        couponDiscount: couponResult.valid ? couponResult.discount : 0,
        couponType: couponResult.valid ? couponResult.type : null
      };

      console.log('Sending booking confirmation email...', bookingEmailData);

      const emailResponse = await fetch('/.netlify/functions/send-booking-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bookingEmailData)
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Email response not OK:', emailResponse.status, errorText);
        throw new Error(`Email service returned ${emailResponse.status}: ${errorText}`);
      }

      const emailResult = await emailResponse.json();
      console.log('Booking confirmation email sent successfully:', emailResult);

    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Don't fail the booking if email fails, but log it prominently
      console.warn('⚠️ BOOKING CONFIRMED BUT EMAIL NOTIFICATION FAILED');
      
      // You might want to show a warning to the user
      alert('Your booking is confirmed, but we had trouble sending the confirmation email. Please save your booking details and contact us if needed.');
    }
  };

  const sendWaiverEmail = async (currentZone: Zone | undefined, endTime: string) => {
    try {
      const finalTotal = await calculateTotal();
      
      const waiverData = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        dateOfBirth: '',
        emergencyContact: customerInfo.name,
        emergencyPhone: customerInfo.phone,
        isMinor: false,
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        waiverAccepted: true,
        termsAccepted: true,
        signedAt: new Date().toISOString(),
        signedDate: new Date().toLocaleDateString('en-CA'),
        // Additional booking context
        bookingDate: selectedDate,
        bookingTime: `${selectedTime} - ${endTime}`,
        activity: currentZone?.name || 'Unknown Zone',
        duration: selectedDuration,
        totalCost: finalTotal,
        groupSize: customerInfo.groupSize,
        specialRequests: customerInfo.specialRequests || ''
      };

      console.log('Sending waiver email...', waiverData);

      const waiverResponse = await fetch('/.netlify/functions/send-waiver-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(waiverData)
      });

      if (!waiverResponse.ok) {
        const errorText = await waiverResponse.text();
        console.error('Waiver email response not OK:', waiverResponse.status, errorText);
        throw new Error(`Waiver email service returned ${waiverResponse.status}: ${errorText}`);
      }

      const waiverResult = await waiverResponse.json();
      console.log('Waiver email sent successfully:', waiverResult);

    } catch (waiverError) {
      console.error('Failed to send waiver email:', waiverError);
      console.warn('⚠️ BOOKING CONFIRMED BUT WAIVER EMAIL FAILED');
    }
  };

  const isFormValid = () => {
    return selectedZone && 
           selectedTime && 
           selectedDuration && 
           customerInfo.name && 
           customerInfo.email && 
           customerInfo.phone &&
           customerInfo.groupSize && 
           waiverAccepted &&
           termsAccepted;
  };

  const resetBooking = () => {
    setShowConfirmation(false);
    setSelectedZone('');
    setSelectedTime('');
    setSelectedDuration(1);
    setCustomerInfo({ 
      name: '', 
      email: '', 
      phone: '', 
      groupSize: '', 
      specialRequests: '',
      allergySoap: false,
      couponCode: ''
    });
    setWaiverAccepted(false);
    setTermsAccepted(false);
    setPaymentIntentId('');
  };

  // Check if selected date is in the past
  const isSelectedDateInPast = () => {
    const selectedDateObj = parseISO(selectedDate);
    return isBefore(startOfDay(selectedDateObj), startOfDay(new Date()));
  };

  if (loading) {
    return (
      <div className="pt-20">
        <BookingHero />
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error || zones.length === 0) {
    return (
      <div className="pt-20">
        <BookingHero />
        <div className="py-20 text-center">
          <DemoModeWarning error={error} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Connection Error' : 'No Play Zones Available'}
          </h2>
          <p className="text-gray-600 mb-8">
            {error || 'Please check back later or contact us for assistance.'}
          </p>
          <button
            onClick={fetchZones}
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const filteredZones = getFilteredZones();

  return (
    <div className="pt-20">
      <BookingHero />

      <BookingConfirmation
        show={showConfirmation}
        selectedZone={selectedZone}
        selectedTime={selectedTime}
        selectedDuration={selectedDuration}
        selectedDate={selectedDate}
        zones={zones}
        calculateTotal={calculateBaseTotal}
        onReset={resetBooking}
      />

      {/* Main Booking Interface */}
      <section className="py-8 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Unified Booking Interface */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            <DateNavigation
              selectedDate={selectedDate}
              onPreviousDay={goToPreviousDay}
              onNextDay={goToNextDay}
              onDateChange={handleDateChange}
            />

            <div className="p-4 sm:p-8">
              {/* Past Date Warning */}
              {isSelectedDateInPast() && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-red-500">⚠️</div>
                    <div>
                      <h4 className="font-medium text-red-800">Cannot Book Past Dates</h4>
                      <p className="text-sm text-red-700 mt-1">
                        You cannot book activities for dates that have already passed. 
                        Please select today or a future date to make a booking.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <BookingControls
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
                filterZone={filterZone}
                onFilterChange={setFilterZone}
                zones={zones}
              />

              <BookingInstructions />

              <TimeSlotGrid
                zones={zones}
                filteredZones={filteredZones}
                timeSlots={timeSlots}
                bookings={bookings}
                selectedDate={selectedDate}
                selectedZone={selectedZone}
                selectedTime={selectedTime}
                selectedDuration={selectedDuration}
                onTimeSlotClick={handleTimeSlotClick}
              />
            </div>
          </div>

          {/* Add data attribute for scroll targeting */}
          <div data-booking-summary>
            <BookingSummary
              selectedZone={selectedZone}
              selectedTime={selectedTime}
              selectedDuration={selectedDuration}
              selectedDate={selectedDate}
              zones={zones}
              calculateTotal={calculateBaseTotal}
              calculateEndTime={calculateEndTime}
              onContinue={() => setShowBookingForm(true)}
            />
          </div>

          <BookingForm
            show={showBookingForm}
            onClose={() => setShowBookingForm(false)}
            selectedZone={selectedZone}
            selectedTime={selectedTime}
            selectedDuration={selectedDuration}
            selectedDate={selectedDate}
            zones={zones}
            customerInfo={customerInfo}
            onCustomerInfoChange={setCustomerInfo}
            waiverAccepted={waiverAccepted}
            onWaiverAcceptedChange={setWaiverAccepted}
            termsAccepted={termsAccepted}
            onTermsAcceptedChange={setTermsAccepted}
            calculateTotal={calculateBaseTotal}
            onSubmit={handleBookingFormSubmit}
            isFormValid={isFormValid}
          />

          <PaymentForm
            show={showPaymentForm}
            onClose={() => setShowPaymentForm(false)}
            selectedZone={selectedZone}
            selectedTime={selectedTime}
            selectedDuration={selectedDuration}
            selectedDate={selectedDate}
            zones={zones}
            customerInfo={customerInfo}
            calculateTotal={calculateBaseTotal}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </section>
    </div>
  );
};

export default BookingPage;