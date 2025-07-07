import React, { useState, useEffect } from 'react';
import { Clock, Check, MapPin, Users, AlertTriangle } from 'lucide-react';
import {
  Zone,
  Booking,
  BlockedTime,
  convertTo24Hour,
  convertTo12Hour,
  calculateEndTime,
  isTimeSlotAvailable,
  timeStringToMinutes,
  isWalkInZone,
  getBlockedTimesForDate,
  isBookingTimeValid,
  getMinimumBookableTime
} from '../../lib/supabase';
import { parseISO, isBefore, startOfDay } from 'date-fns';

interface TimeSlotGridProps {
  zones: Zone[];
  filteredZones: Zone[];
  timeSlots: string[];
  bookings: Booking[];
  selectedDate: string;
  selectedZone: string;
  selectedTime: string;
  selectedDuration: number;
  onTimeSlotClick: (zoneId: string, time: string) => void;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  zones,
  filteredZones,
  timeSlots,
  bookings,
  selectedDate,
  selectedZone,
  selectedTime,
  selectedDuration,
  onTimeSlotClick
}) => {
  const [blockedTimes, setBlockedTimes] = useState<Record<string, BlockedTime[]>>({});

  // Fetch blocked times for all zones when date changes
  useEffect(() => {
    const fetchBlockedTimes = async () => {
      const blockedTimesMap: Record<string, BlockedTime[]> = {};
      
      for (const zone of filteredZones) {
        const blocked = await getBlockedTimesForDate(zone.id, selectedDate);
        blockedTimesMap[zone.id] = blocked;
      }
      
      setBlockedTimes(blockedTimesMap);
    };

    fetchBlockedTimes();
  }, [selectedDate, filteredZones]);

  // Check if selected date is in the past
  const isDateInPast = () => {
    const selectedDateObj = parseISO(selectedDate);
    return isBefore(startOfDay(selectedDateObj), startOfDay(new Date()));
  };

  // Check if selected date is today
  const isToday = () => {
    const selectedDateObj = parseISO(selectedDate);
    const today = new Date();
    return selectedDateObj.toDateString() === today.toDateString();
  };

  // Get minimum bookable time for today
  const minimumBookableTime = isToday() ? getMinimumBookableTime(selectedDate) : null;

  const getSlotStatus = (zoneId: string, time: string) => {
    const zone = zones.find(z => z.id === zoneId)!;
    
    // If date is in the past, all slots are unavailable
    if (isDateInPast()) {
      return { status: 'past_date' as const };
    }
    
    // Walk-in zones are always available (no booking required)
    if (isWalkInZone(zone)) {
      return { status: 'walk_in' as const };
    }

    const slot24 = convertTo24Hour(time);
    const slotMin = timeStringToMinutes(slot24);

    // Updated operating hours: 7:00 AM - 9:00 PM (07:00 - 21:00)
    const openMin  = timeStringToMinutes(zone.available_start || '07:00:00');
    const closeMin = timeStringToMinutes(zone.available_end   || '21:00:00');

    // 1) Before open?
    if (slotMin < openMin) {
      return { status: 'unavailable' as const };
    }

    // 2) Compute end of this session
    const end12  = calculateEndTime(time, selectedDuration);
    const end24  = convertTo24Hour(end12);
    const endMin = timeStringToMinutes(end24);

    // 3) Past closing?
    if (endMin > closeMin) {
      return { status: 'unavailable' as const };
    }

    // 4) Check if booking is at least 4 hours in advance - treat as unavailable
    if (!isBookingTimeValid(selectedDate, time)) {
      return { status: 'unavailable' as const };
    }

    // 5) Check if time slot is blocked (e.g., Friday 12-3 PM)
    const zoneBlockedTimes = blockedTimes[zoneId] || [];
    for (const block of zoneBlockedTimes) {
      const blockStartMin = timeStringToMinutes(block.start_time);
      const blockEndMin = timeStringToMinutes(block.end_time);
      
      // Check if there's any overlap with the blocked time
      if (slotMin < blockEndMin && blockStartMin < endMin) {
        return { status: 'blocked' as const, reason: block.reason };
      }
    }

    // 6) Already booked at this half-hour?
    const existing = bookings.find(b =>
      b.zone_id === zoneId &&
      b.date    === selectedDate &&
      b.status  === 'confirmed' &&
      timeStringToMinutes(b.start_time) <= slotMin &&
      timeStringToMinutes(b.end_time)   >  slotMin
    );
    if (existing) {
      return { status: 'booked' as const, booking: existing };
    }

    // 7) Duration out of range?
    if (
      selectedDuration < zone.min_duration ||
      selectedDuration > zone.max_duration
    ) {
      return { status: 'invalid_duration' as const };
    }

    // 8) Final overlap check (this will also check blocked times via the updated function)
    // Note: We'll need to make this async, but for now we'll do a synchronous check
    const hasConflict = bookings.some(b =>
      b.zone_id === zoneId &&
      b.date === selectedDate &&
      b.status === 'confirmed' &&
      timeStringToMinutes(convertTo24Hour(time)) < timeStringToMinutes(b.end_time) &&
      timeStringToMinutes(b.start_time) < timeStringToMinutes(end24)
    );

    if (!hasConflict) {
      return { status: 'available' as const };
    }

    return { status: 'unavailable' as const };
  };

  const getSlotClassName = (zoneId: string, time: string) => {
    const slot = getSlotStatus(zoneId, time);
    const isSelected = selectedZone === zoneId && selectedTime === time;

    let base = `
      h-14 sm:h-16 border-2 text-xs font-medium
      transition-all cursor-pointer flex flex-col
      items-center justify-center relative hover:shadow-md
      rounded-lg
    `;

    if (isSelected) {
      base += ' bg-primary-500 text-white border-primary-600 shadow-lg';
    } else if (slot.status === 'past_date') {
      base += ' bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50';
    } else if (slot.status === 'walk_in') {
      base += ' bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    } else if (slot.status === 'blocked') {
      base += ' bg-orange-50 text-orange-700 border-orange-200 cursor-not-allowed';
    } else if (slot.status === 'available') {
      base += ' bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
    } else if (slot.status === 'booked') {
      base += ' bg-red-50 text-red-700 border-red-200 cursor-not-allowed';
    } else if (slot.status === 'invalid_duration') {
      base += ' bg-yellow-50 text-yellow-600 border-yellow-200 cursor-not-allowed';
    } else {
      base += ' bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed';
    }

    return base;
  };

  const renderTimeSlotContent = (zoneId: string, time: string) => {
    const slot = getSlotStatus(zoneId, time);
    const isSelected = selectedZone === zoneId && selectedTime === time;
    const zone = zones.find(z => z.id === zoneId)!;

    if (slot.status === 'past_date') {
      return (
        <div className="text-center px-1">
          <div className="text-xs opacity-50">Past Date</div>
          <div className="text-xs opacity-50">{time}</div>
        </div>
      );
    }

    if (isSelected) {
      const end12 = calculateEndTime(time, selectedDuration);
      return (
        <div className="text-center px-1">
          <div className="flex items-center justify-center mb-1">
            <Check className="w-3 h-3 mr-1" />
            <span className="font-bold text-xs">SELECTED</span>
          </div>
          <div className="text-xs opacity-90 leading-tight">
            {time} – {end12}
          </div>
          <div className="text-xs opacity-90">
            {selectedDuration}h • ${zone.hourly_rate * selectedDuration}
          </div>
        </div>
      );
    }

    if (slot.status === 'walk_in') {
      return (
        <div className="text-center px-1">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-3 h-3 mr-1" />
            <span className="font-bold text-xs">WALK-IN</span>
          </div>
          <div className="text-xs opacity-75 leading-tight">
            No booking needed
          </div>
          <div className="text-xs opacity-75">
            ${zone.hourly_rate} entry
          </div>
        </div>
      );
    }

    if (slot.status === 'blocked') {
      return (
        <div className="text-center px-1">
          <div className="font-semibold text-xs">BLOCKED</div>
          <div className="text-xs opacity-75">{time}</div>
          <div className="text-xs opacity-75 leading-tight">Maintenance</div>
        </div>
      );
    }

    if (slot.status === 'available') {
      return (
        <div className="text-center px-1">
          <div className="font-semibold text-xs">{time}</div>
        </div>
      );
    }

    if (slot.status === 'booked') {
      return (
        <div className="text-center px-1">
          <div className="font-semibold text-xs">BOOKED</div>
          <div className="text-xs opacity-75">{time}</div>
        </div>
      );
    }

    if (slot.status === 'invalid_duration') {
      return (
        <div className="text-center px-1">
          <div className="text-xs leading-tight">Duration</div>
          <div className="text-xs leading-tight">not valid</div>
        </div>
      );
    }

    return (
      <div className="text-center px-1">
        <div className="text-xs opacity-50">—</div>
      </div>
    );
  };

  const handleSlotClick = (zoneId: string, time: string) => {
    const slot = getSlotStatus(zoneId, time);
    const zone = zones.find(z => z.id === zoneId)!;

    if (slot.status === 'past_date') {
      alert('Cannot book activities for past dates. Please select today or a future date.');
      return;
    }

    if (slot.status === 'walk_in') {
      alert(`${zone.name} is walk-in only! No booking required - just show up during operating hours (7:00 AM - 9:00 PM) and pay the $${zone.hourly_rate} entry fee.`);
      return;
    }

    if (slot.status === 'blocked') {
      const reason = slot.reason || 'Maintenance';
      alert(`This time slot is blocked for ${reason}. Please select a different time.`);
      return;
    }

    // Check if booking is at least 4 hours in advance
    if (!isBookingTimeValid(selectedDate, time)) {
      alert('Bookings must be made at least 4 hours in advance. Please select a later time slot.');
      return;
    }

    if (slot.status === 'available') {
      onTimeSlotClick(zoneId, time);
    } else if (slot.status === 'booked') {
      alert('This slot is already booked.');
    } else if (slot.status === 'invalid_duration') {
      alert('Selected duration not allowed for this zone.');
    } else {
      // show conflict details
      const end12 = calculateEndTime(time, selectedDuration);
      const start24 = convertTo24Hour(time);
      const end24   = convertTo24Hour(end12);
      const conflicts = bookings
        .filter(b =>
          b.zone_id === zoneId &&
          b.date    === selectedDate &&
          b.status  === 'confirmed' &&
          timeStringToMinutes(start24) < timeStringToMinutes(b.end_time) &&
          timeStringToMinutes(b.start_time) < timeStringToMinutes(end24)
        )
        .map(b => `${convertTo12Hour(b.start_time)}–${convertTo12Hour(b.end_time)}`)
        .join(', ');
      alert(
        conflicts
          ? `Conflicts with bookings: ${conflicts}`
          : 'Slot unavailable. Please select another time.'
      );
    }
  };

  if (filteredZones.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl border">
        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No activities found
        </h3>
        <p className="text-gray-500">
          Try a different filter or date.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Past Date Warning */}
      {isDateInPast() && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="text-red-500">⚠️</div>
            <span className="text-red-700 font-medium text-sm">
              Cannot book activities for past dates. Please select today or a future date.
            </span>
          </div>
        </div>
      )}

      {/* 4-Hour Advance Notice */}
      {isToday() && minimumBookableTime && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700 font-medium text-sm">
              Bookings must be made 4 hours in advance. Earliest available time today: {minimumBookableTime}
            </span>
          </div>
        </div>
      )}

      {/* Friday Block Notice */}
      {selectedDate && new Date(selectedDate + 'T00:00:00').getDay() === 5 && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="text-orange-500">🔧</div>
            <span className="text-orange-700 font-medium text-sm">
              Friday 12:00 PM - 3:00 PM is blocked for weekly maintenance and staff break.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${100 + filteredZones.length * 120}px` }}>
          <div
            className="grid gap-1 p-2 pb-2"
            style={{
              gridTemplateColumns: `100px repeat(${filteredZones.length}, minmax(120px, 1fr))`
            }}
          >
            <div className="h-16 flex flex-col items-center justify-center bg-white border rounded-lg">
              <Clock className="w-4 h-4 mb-1 text-gray-700" />
              <span className="text-xs text-gray-700">Time</span>
            </div>
            {filteredZones.map(zone => (
              <div
                key={zone.id}
                className="h-16 flex flex-col items-center justify-center bg-white border rounded-lg px-2"
              >
                <span className="font-bold text-xs text-gray-800 mb-1 text-center">
                  {zone.name}
                </span>
                <span className="text-xs text-gray-600 text-center">
                  {isWalkInZone(zone) ? (
                    <span className="text-blue-600 font-medium">Walk-in Only</span>
                  ) : (
                    `$${zone.hourly_rate * selectedDuration} for ${selectedDuration}h`
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="p-2 pt-0 space-y-1">
            {timeSlots.map(time => (
              <div
                key={time}
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `100px repeat(${filteredZones.length}, minmax(120px, 1fr))`
                }}
              >
                <div className="h-14 flex items-center justify-center bg-gray-50 border rounded-lg">
                  <span className="text-xs text-gray-600">{time}</span>
                </div>
                {filteredZones.map(zone => (
                  <div
                    key={`${zone.id}-${time}`}
                    className={getSlotClassName(zone.id, time)}
                    onClick={() => handleSlotClick(zone.id, time)}
                  >
                    {renderTimeSlotContent(zone.id, time)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotGrid;