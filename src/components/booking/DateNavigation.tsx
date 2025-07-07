import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CalendarDays, Clock } from 'lucide-react';
import { format, parseISO, isBefore, startOfDay, addDays } from 'date-fns';

interface DateNavigationProps {
  selectedDate: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onDateChange: (date: string) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  selectedDate,
  onPreviousDay,
  onNextDay,
  onDateChange
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Check if the previous day would be in the past
  const selectedDateObj = parseISO(selectedDate);
  const isPreviousDisabled = isBefore(
    startOfDay(new Date(selectedDateObj.getTime() - 24 * 60 * 60 * 1000)), 
    startOfDay(new Date())
  );

  // Get minimum date (today)
  const today = new Date();
  const minDate = format(today, 'yyyy-MM-dd');

  // Get maximum date (3 months from now)
  const maxDate = format(new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      onDateChange(newDate);
      setShowDatePicker(false);
    }
  };

  const quickDateOptions = [
    { label: 'Today', date: format(new Date(), 'yyyy-MM-dd'), icon: '📅' },
    { label: 'Tomorrow', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), icon: '🌅' },
    { label: 'Weekend', date: (() => {
      const nextSaturday = new Date();
      const daysUntilSaturday = (6 - nextSaturday.getDay()) % 7;
      if (daysUntilSaturday === 0) nextSaturday.setDate(nextSaturday.getDate() + 7);
      else nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);
      return format(nextSaturday, 'yyyy-MM-dd');
    })(), icon: '🎉' },
    { label: 'Next Week', date: format(addDays(new Date(), 7), 'yyyy-MM-dd'), icon: '📆' }
  ];

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          
          {/* Title Section */}
          <div className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
                Choose Your Perfect Time Slot
              </h2>
              <p className="text-white/80 text-xs sm:text-sm hidden sm:block">
                Select your preferred date and time
              </p>
            </div>
          </div>
          
          {/* Compact Date Navigation */}
          <div className="relative">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={onPreviousDay}
                disabled={isPreviousDisabled}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                  isPreviousDisabled 
                    ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                    : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
                }`}
                title={isPreviousDisabled ? 'Cannot select past dates' : 'Previous day'}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {/* Compact Date Display */}
              <div 
                className="group cursor-pointer bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-200 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg hover:shadow-xl min-w-[200px] sm:min-w-[250px]"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                      Selected Date
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                    {format(parseISO(selectedDate), 'EEEE')}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-gray-700">
                    {format(parseISO(selectedDate), 'MMMM d, yyyy')}
                  </p>
                  
                  {isBefore(startOfDay(selectedDateObj), startOfDay(new Date())) && (
                    <div className="mt-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      ⚠️ Past date - booking disabled
                    </div>
                  )}
                  
                  <div className="mt-1 text-xs text-gray-500">
                    Tap to change
                  </div>
                </div>
              </div>
              
              <button
                onClick={onNextDay}
                className="p-2 sm:p-3 rounded-lg bg-white/20 hover:bg-white/30 text-white hover:scale-105 transition-all duration-200"
                title="Next day"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Compact Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-3 z-50 w-80">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Compact Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Select Date</h3>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-white/80 hover:text-white p-1 hover:bg-white/20 rounded transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Date Input */}
                    <div className="mb-4">
                      <input
                        type="date"
                        value={selectedDate}
                        min={minDate}
                        max={maxDate}
                        onChange={handleDatePickerChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                      />
                    </div>
                    
                    {/* Quick Select Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {quickDateOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            onDateChange(option.date);
                            setShowDatePicker(false);
                          }}
                          className="p-2 bg-primary-50 hover:bg-primary-500 text-primary-700 hover:text-white rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          <div className="text-center">
                            <div className="text-sm mb-1">{option.icon}</div>
                            <div className="text-xs font-medium">{option.label}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Compact Info */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div className="text-xs text-blue-800">
                          <span className="font-medium">4hr advance booking required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateNavigation;