import React from 'react';
import { Info, Users, AlertTriangle, Clock } from 'lucide-react';

const BookingInstructions = () => {
  return (
    <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
      {/* 4-Hour Advance Booking Notice */}
      <div className="p-4 sm:p-6 bg-yellow-50 rounded-xl border border-yellow-200">
        <div className="flex items-start space-x-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base">4-Hour Advance Booking Required</h4>
            <p className="text-yellow-800 text-xs sm:text-sm leading-relaxed">
              <strong>All bookings must be made at least 4 hours in advance.</strong> 
              This ensures we have adequate time to prepare your activity and maintain our high service standards. 
              Time slots that are less than 4 hours away will appear as unavailable.
            </p>
          </div>
        </div>
      </div>

      {/* Time Selection Instructions */}
      <div className="p-4 sm:p-6 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to Select Your Time Slot</h4>
            <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
              <strong>Click on the starting time</strong> of when you want your session to begin. 
              Your session will automatically run for the duration you've selected above. 
              Green slots are available, red slots are already booked.
            </p>
          </div>
        </div>
      </div>

      {/* Walk-in Information */}
      <div className="p-4 sm:p-6 bg-purple-50 rounded-xl border border-purple-200">
        <div className="flex items-start space-x-3">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Walk-in Activities</h4>
            <p className="text-purple-800 text-xs sm:text-sm leading-relaxed">
              <strong>Sandbox Playground</strong> is walk-in only - no booking required! 
              Just show up during operating hours and pay the entry fee at the facility.
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 bg-gray-100 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-50 border-2 border-green-200 rounded-lg"></div>
          <span className="text-xs sm:text-sm text-gray-700 font-medium">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-50 border-2 border-red-200 rounded-lg"></div>
          <span className="text-xs sm:text-sm text-gray-700 font-medium">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-50 border-2 border-orange-200 rounded-lg"></div>
          <span className="text-xs sm:text-sm text-gray-700 font-medium">Blocked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-50 border-2 border-blue-200 rounded-lg"></div>
          <span className="text-xs sm:text-sm text-gray-700 font-medium">Walk-in Only</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary-500 rounded-lg"></div>
          <span className="text-xs sm:text-sm text-gray-700 font-medium">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"></div>
          <span className="text-xs sm:text-sm text-gray-700 font-medium">Duration not valid</span>
        </div>
        <div className="flex items-center space-x-2 col-span-2 sm:col-span-1 justify-center sm:justify-start">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-50 border-2 border-gray-200 rounded-lg"></div>
          <span className="text-xs sm:text-sm text-gray-700 font-medium">Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default BookingInstructions;