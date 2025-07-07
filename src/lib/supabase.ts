import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables are required. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Zone {
  id: string;
  name: string;
  capacity: string;
  hourly_rate: number;
  min_duration: number;
  max_duration: number;
  available_start: string; // e.g. "07:00:00" - Updated to 7:00 AM
  available_end:   string; // e.g. "21:00:00" - Updated to 9:00 PM
  active: boolean;
  is_walk_in?: boolean; // New field for walk-in only zones
}

export interface Booking {
  id: string;
  zone_id: string;
  date: string;         // "YYYY-MM-DD"
  start_time: string;   // "HH:mm:ss"
  end_time: string;     // "HH:mm:ss"
  duration: number;
  customer_info: {
    name: string;
    email: string;
    phone: string;
    groupSize?: string;
    specialRequests?: string;
  };
  total_cost: number;
  status: string;       // e.g. "confirmed"
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BlockedTime {
  id: string;
  zone_id: string | null; // null means applies to all zones
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday
  start_time: string;
  end_time: string;
  reason: string;
  active: boolean;
}

// ── UTILITIES ────────────────────────────────────────────────────────────

// Convert "HH:mm" ↔ "h:mm AM/PM"
export const convertTo12Hour = (time24: string): string => {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const hour12 = h % 12 || 12;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
};

export const convertTo24Hour = (time12: string): string => {
  let [time, ampm] = time12.split(' ');
  let [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// "HH:mm" or "HH:mm:ss" → total minutes since midnight
export const timeStringToMinutes = (ts: string): number => {
  const [h, m] = ts.split(':').map(Number);
  return h * 60 + m;
};

export const generateTimeSlots = (
  startTime: string = '07:00', // Updated to 7:00 AM
  endTime: string   = '21:00'  // Updated to 9:00 PM
): string[] => {
  const slots: string[] = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let minutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  
  // Generate slots every 30 minutes from start to end
  while (minutes < endMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const t24 = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    slots.push(convertTo12Hour(t24));
    minutes += 30;
  }
  return slots;
};

export const calculateEndTime = (
  startTime: string,
  duration: number
): string => {
  const t24 = convertTo24Hour(startTime);
  const [h, m] = t24.split(':').map(Number);
  const endMin = h * 60 + m + duration * 60;
  const eh = Math.floor(endMin / 60);
  const em = endMin % 60;
  const end24 = `${String(eh).padStart(2,'0')}:${String(em).padStart(2,'0')}`;
  return convertTo12Hour(end24);
};

// Check if a booking time is at least 4 hours in advance
export const isBookingTimeValid = (date: string, time: string): boolean => {
  const now = new Date();
  const bookingDateTime = new Date(`${date}T${convertTo24Hour(time)}:00`);
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  
  return bookingDateTime >= fourHoursFromNow;
};

// Get the minimum bookable time for a given date
export const getMinimumBookableTime = (date: string): string | null => {
  const now = new Date();
  const selectedDate = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If the selected date is not today, any time is valid (assuming it's a future date)
  if (selectedDate.getTime() !== today.getTime()) {
    return null; // No restriction for future dates
  }
  
  // For today, calculate 4 hours from now
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  const hours = fourHoursFromNow.getHours();
  const minutes = fourHoursFromNow.getMinutes();
  
  // Round up to the next 30-minute slot
  let roundedMinutes = minutes <= 30 ? 30 : 60;
  let roundedHours = hours;
  
  if (roundedMinutes === 60) {
    roundedHours += 1;
    roundedMinutes = 0;
  }
  
  // If it's past operating hours, no slots available today
  if (roundedHours >= 21) { // 9 PM
    return null;
  }
  
  const timeString = `${String(roundedHours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
  return convertTo12Hour(timeString);
};

// Check if a time slot is blocked (e.g., Friday 12-3 PM)
export const isTimeSlotBlocked = async (
  zoneId: string,
  date: string,
  startTime: string,
  duration: number
): Promise<boolean> => {
  try {
    const start24 = convertTo24Hour(startTime);
    const end12 = calculateEndTime(startTime, duration);
    const end24 = convertTo24Hour(end12);
    
    // Get day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();
    
    const { data, error } = await supabase
      .from('blocked_times')
      .select('*')
      .eq('active', true)
      .eq('day_of_week', dayOfWeek)
      .or(`zone_id.is.null,zone_id.eq.${zoneId}`);
    
    if (error) {
      console.error('Error checking blocked times:', error);
      return false;
    }
    
    // Check for overlaps
    for (const block of data || []) {
      const blockStartMin = timeStringToMinutes(block.start_time);
      const blockEndMin = timeStringToMinutes(block.end_time);
      const slotStartMin = timeStringToMinutes(start24);
      const slotEndMin = timeStringToMinutes(end24);
      
      // Check if there's any overlap
      if (slotStartMin < blockEndMin && blockStartMin < slotEndMin) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking blocked times:', error);
    return false;
  }
};

// Strict numeric overlap check
export const isTimeSlotAvailable = async (
  bookings: Booking[],
  zoneId: string,
  date: string,
  startTime: string,
  duration: number
): Promise<boolean> => {
  // First check if the booking is at least 4 hours in advance
  if (!isBookingTimeValid(date, startTime)) {
    return false;
  }
  
  // Then check if the time slot is blocked
  const isBlocked = await isTimeSlotBlocked(zoneId, date, startTime, duration);
  if (isBlocked) {
    return false;
  }
  
  const start24 = convertTo24Hour(startTime);
  const end12   = calculateEndTime(startTime, duration);
  const end24   = convertTo24Hour(end12);
  const startMin = timeStringToMinutes(start24);
  const endMin   = timeStringToMinutes(end24);

  for (const b of bookings) {
    if (
      b.zone_id !== zoneId ||
      b.date    !== date ||
      b.status  !== 'confirmed'
    ) continue;

    const bs = timeStringToMinutes(b.start_time);
    const be = timeStringToMinutes(b.end_time);

    if (startMin < be && bs < endMin) {
      return false;
    }
  }

  return true;
};

// Check if a zone is walk-in only
export const isWalkInZone = (zone: Zone): boolean => {
  return zone.is_walk_in === true || zone.id === 'sandbox';
};

// Get blocked times for a specific date and zone
export const getBlockedTimesForDate = async (
  zoneId: string,
  date: string
): Promise<BlockedTime[]> => {
  try {
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();
    
    const { data, error } = await supabase
      .from('blocked_times')
      .select('*')
      .eq('active', true)
      .eq('day_of_week', dayOfWeek)
      .or(`zone_id.is.null,zone_id.eq.${zoneId}`);
    
    if (error) {
      console.error('Error fetching blocked times:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching blocked times:', error);
    return [];
  }
};