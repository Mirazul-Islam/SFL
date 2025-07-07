import React from 'react';
import { Clock, Plus, Minus, Filter } from 'lucide-react';
import { Zone } from '../../lib/supabase';

interface BookingControlsProps {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
  filterZone: string;
  onFilterChange: (zoneId: string) => void;
  zones: Zone[];
}

const BookingControls: React.FC<BookingControlsProps> = ({
  selectedDuration,
  onDurationChange,
  filterZone,
  onFilterChange,
  zones
}) => {
  const adjustDuration = (change: number) => {
    const newDuration = selectedDuration + change;
    if (newDuration >= 0.5 && newDuration <= 14) {
      onDurationChange(newDuration);
    }
  };

  return (
    <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
      {/* Duration Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
          <span className="text-base sm:text-lg font-semibold text-gray-900">Session Duration</span>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-center">
          <button
            onClick={() => adjustDuration(-0.5)}
            disabled={selectedDuration <= 0.5}
            className="p-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
          
          <div className="px-4 sm:px-6 py-2 bg-primary-500 text-white rounded-xl min-w-[100px] text-center">
            <div className="text-base sm:text-lg font-bold">{selectedDuration}</div>
            <div className="text-xs opacity-90">hour{selectedDuration !== 1 ? 's' : ''}</div>
          </div>
          
          <button
            onClick={() => adjustDuration(0.5)}
            disabled={selectedDuration >= 14}
            className="p-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Activity Filter */}
      <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
            <span className="text-base sm:text-lg font-semibold text-gray-900">Filter by Activity</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`w-full px-3 sm:px-4 py-3 rounded-xl font-medium transition-all border text-sm ${
              filterZone === 'all'
                ? 'bg-primary-500 text-white border-primary-500 shadow-lg'
                : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border-gray-200'
            }`}
          >
            All Activities ({zones.length} zones)
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onFilterChange(zone.id)}
                className={`px-3 sm:px-4 py-3 rounded-xl font-medium transition-all border text-sm ${
                  filterZone === zone.id
                    ? 'bg-primary-500 text-white border-primary-500 shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border-gray-200'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium leading-tight">{zone.name}</div>
                  <div className="text-xs opacity-75 mt-1">${zone.hourly_rate}/hr • {zone.min_duration}-{zone.max_duration}h</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingControls;