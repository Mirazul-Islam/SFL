import React from 'react';
import { Zone } from '../../lib/supabase';

interface BookingSummaryProps {
  selectedZone: string;
  selectedTime: string;
  selectedDuration: number;
  selectedDate: string;
  zones: Zone[];
  calculateTotal: () => number;
  calculateEndTime: (time: string, duration: number) => string;
  onContinue: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedZone,
  selectedTime,
  selectedDuration,
  selectedDate,
  zones,
  calculateTotal,
  calculateEndTime,
  onContinue
}) => {
  if (!selectedZone || !selectedTime) return null;

  return (
    <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
      <div className="bg-primary-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-primary-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-primary-700 text-xs sm:text-sm">Activity:</span>
            <p className="font-bold text-primary-900 text-sm sm:text-base">{zones.find(z => z.id === selectedZone)?.name}</p>
          </div>
          <div>
            <span className="text-primary-700 text-xs sm:text-sm">Date & Time:</span>
            <p className="font-bold text-primary-900 text-sm sm:text-base">{selectedDate}</p>
            <p className="font-bold text-primary-900 text-sm sm:text-base">{selectedTime} - {calculateEndTime(selectedTime, selectedDuration)}</p>
          </div>
          <div>
            <span className="text-primary-700 text-xs sm:text-sm">Duration:</span>
            <p className="font-bold text-primary-900 text-sm sm:text-base">{selectedDuration} hours</p>
          </div>
          <div>
            <span className="text-primary-700 text-xs sm:text-sm">Total Cost:</span>
            <p className="font-bold text-xl sm:text-2xl text-primary-600">${calculateTotal()} CAD</p>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 sm:py-4 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors text-base sm:text-lg shadow-lg hover:shadow-xl"
      >
        Continue to Booking Details
      </button>
    </div>
  );
};

export default BookingSummary;