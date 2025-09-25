// Utility functions for time handling and timezone conversions
import { CountdownService } from '../services/CountdownService';
import { getEventTypeStyles, getStatusStyles } from './styleUtils';

// Get current UTC time
export const getUTCTime = (): { hours: number; minutes: number; seconds: number; formatted: string } => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  
  return {
    hours: utcHours,
    minutes: utcMinutes,
    seconds: utcSeconds,
    formatted: `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`
  };
};

// Get current time in a specific timezone
export const getTimeInTimezone = (timezone: string): { hours: number; minutes: number; seconds: number; formatted: string } => {
  try {
  const now = new Date();
    const timeInTimezone = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    
    const hours = timeInTimezone.getHours();
    const minutes = timeInTimezone.getMinutes();
    const seconds = timeInTimezone.getSeconds();
  
  return {
      hours,
      minutes,
      seconds,
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
  } catch (error) {
    console.warn(`Error getting time for timezone ${timezone}:`, error);
    return getUTCTime();
  }
};

// Get user's current timezone
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Error detecting user timezone:', error);
    return 'UTC';
  }
};

// Convert timezone name to abbreviation
export const getTimezoneAbbreviation = (timezone: string): string => {
  const timezoneAbbreviations: { [key: string]: string } = {
    // UTC
    'UTC': 'UTC',
    
    // North America - Eastern
    'America/New_York': 'EST',
    'America/Detroit': 'EST',
    'America/Toronto': 'EST',
    'America/Montreal': 'EST',
    'America/Nassau': 'EST',
    'America/Port-au-Prince': 'EST',
    
    // North America - Central
    'America/Chicago': 'CST',
    'America/Winnipeg': 'CST',
    'America/Mexico_City': 'CST',
    'America/Guatemala': 'CST',
    
    // North America - Mountain
    'America/Denver': 'MST',
    'America/Phoenix': 'MST',
    'America/Edmonton': 'MST',
    'America/Calgary': 'MST',
    
    // North America - Pacific
    'America/Los_Angeles': 'PST',
    'America/Vancouver': 'PST',
    'America/Tijuana': 'PST',
    
    // North America - Alaska
    'America/Anchorage': 'AKST',
    'America/Juneau': 'AKST',
    
    // North America - Hawaii
    'Pacific/Honolulu': 'HST',
    
    // Europe
    'Europe/London': 'GMT',
    'Europe/Dublin': 'GMT',
    'Europe/Paris': 'CET',
    'Europe/Berlin': 'CET',
    'Europe/Rome': 'CET',
    'Europe/Madrid': 'CET',
    'Europe/Amsterdam': 'CET',
    'Europe/Brussels': 'CET',
    'Europe/Vienna': 'CET',
    'Europe/Zurich': 'CET',
    'Europe/Stockholm': 'CET',
    'Europe/Oslo': 'CET',
    'Europe/Copenhagen': 'CET',
    'Europe/Warsaw': 'CET',
    'Europe/Prague': 'CET',
    'Europe/Budapest': 'CET',
    'Europe/Athens': 'EET',
    'Europe/Helsinki': 'EET',
    'Europe/Riga': 'EET',
    'Europe/Tallinn': 'EET',
    'Europe/Vilnius': 'EET',
    'Europe/Bucharest': 'EET',
    'Europe/Sofia': 'EET',
    'Europe/Moscow': 'MSK',
    'Europe/Kiev': 'EET',
    
    // Asia
    'Asia/Tokyo': 'JST',
    'Asia/Seoul': 'KST',
    'Asia/Shanghai': 'CST-CN',
    'Asia/Beijing': 'CST-CN',
    'Asia/Hong_Kong': 'HKT',
    'Asia/Singapore': 'SGT',
    'Asia/Kolkata': 'IST-IN',
    'Asia/Dubai': 'GST-AE',
    'Asia/Tehran': 'IRST',
    'Asia/Karachi': 'PKT',
    'Asia/Dhaka': 'BST',
    'Asia/Bangkok': 'ICT',
    'Asia/Jakarta': 'WIB',
    'Asia/Manila': 'PHT',
    'Asia/Kuala_Lumpur': 'MYT',
    'Asia/Taipei': 'CST-TW',
    'Asia/Ho_Chi_Minh': 'ICT',
    
    // Australia
    'Australia/Sydney': 'AEST',
    'Australia/Melbourne': 'AEST',
    'Australia/Brisbane': 'AEST',
    'Australia/Perth': 'AWST',
    'Australia/Adelaide': 'ACST',
    'Australia/Darwin': 'ACST',
    
    // Middle East
    'Asia/Riyadh': 'AST',
    'Asia/Kuwait': 'AST',
    'Asia/Bahrain': 'AST',
    'Asia/Qatar': 'AST',
    'Asia/Muscat': 'GST-OM',
    'Asia/Beirut': 'EET',
    'Asia/Jerusalem': 'IST-IL',
    'Asia/Amman': 'EET',
    'Asia/Damascus': 'EET',
    
    // Africa
    'Africa/Cairo': 'EET',
    'Africa/Johannesburg': 'SAST',
    'Africa/Lagos': 'WAT',
    'Africa/Casablanca': 'WET',
    'Africa/Nairobi': 'EAT',
    
    // South America
    'America/Sao_Paulo': 'BRT',
    'America/Buenos_Aires': 'ART',
    'America/Lima': 'PET',
    'America/Bogota': 'COT',
    'America/Caracas': 'VET',
    'America/Santiago': 'CLT',
    
    // Pacific
    'Pacific/Auckland': 'NZST',
    'Pacific/Fiji': 'FJT',
    'Pacific/Tahiti': 'TAHT',
  };
  
  return timezoneAbbreviations[timezone] || timezone.split('/').pop()?.replace('_', ' ') || timezone;
};

// Calculate duration in minutes, handling overnight ranges
export const calculateDuration = (startTime: { hours: number; minutes: number }, endTime: { hours: number; minutes: number }): number => {
  const startMinutes = startTime.hours * 60 + startTime.minutes;
  const endMinutes = endTime.hours * 60 + endTime.minutes;
  
  // If end time is before start time, it means it's overnight (next day)
  if (endMinutes < startMinutes) {
    // Add 24 hours (1440 minutes) to the end time
    return (endMinutes + 1440) - startMinutes;
  }
  
  // Normal same-day calculation
  return endMinutes - startMinutes;
};

// Convert UTC time to user's timezone for display
export const convertUTCToUserTimezone = (utcHours: number, utcMinutes: number, userTimezone: string): { hours: number; minutes: number; seconds: number; formatted: string } => {
  try {
    if (userTimezone === 'UTC') {
      return {
        hours: utcHours,
        minutes: utcMinutes,
        seconds: 0,
        formatted: `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
      };
    }

    // Create a UTC date with the given time
    const today = new Date();
    const utcDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), utcHours, utcMinutes, 0));
    
    // Convert to user's timezone using Intl.DateTimeFormat for better reliability
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimezone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(utcDate);
    const hours = parseInt(parts.find(part => part.type === 'hour')?.value || '0');
    const minutes = parseInt(parts.find(part => part.type === 'minute')?.value || '0');
    const seconds = parseInt(parts.find(part => part.type === 'second')?.value || '0');
    
    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
  } catch (error) {
    console.warn('Error converting UTC to user timezone:', error);
    return {
      hours: utcHours,
      minutes: utcMinutes,
      seconds: 0,
      formatted: `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
    };
  }
};

// Convert user's timezone to UTC - SIMPLE AND RELIABLE APPROACH
export const convertUserTimezoneToUTC = (userHours: number, userMinutes: number, userTimezone: string): { hours: number; minutes: number } => {
  try {
    // If userTimezone is UTC, return the time as-is
    if (userTimezone === 'UTC') {
      return {
        hours: userHours,
        minutes: userMinutes
      };
    }

    // Create two Date objects: one for current time in UTC and one in user timezone
    const now = new Date();
    
    // Get current time in both timezones
    const utcNow = new Date(now.toLocaleString("en-US", {timeZone: "UTC"}));
    const userNow = new Date(now.toLocaleString("en-US", {timeZone: userTimezone}));
    
    // Calculate the offset in minutes
    const offsetMinutes = (userNow.getTime() - utcNow.getTime()) / (1000 * 60);
    
    // Apply the offset to the user's input time
    const userTotalMinutes = userHours * 60 + userMinutes;
    const utcTotalMinutes = userTotalMinutes - offsetMinutes;
    
    // Convert back to hours and minutes
    let utcHours = Math.floor(utcTotalMinutes / 60);
    let utcMinutes = Math.round(utcTotalMinutes % 60);
    
    // Handle day boundaries
    while (utcHours < 0) utcHours += 24;
    while (utcHours >= 24) utcHours -= 24;
    while (utcMinutes < 0) { utcMinutes += 60; utcHours -= 1; }
    while (utcMinutes >= 60) { utcMinutes -= 60; utcHours += 1; }
    
    // Final boundary check
    if (utcHours < 0) utcHours = 0;
    if (utcHours >= 24) utcHours = 23;
    if (utcMinutes < 0) utcMinutes = 0;
    if (utcMinutes >= 60) utcMinutes = 59;
    
    return {
      hours: utcHours,
      minutes: utcMinutes
    };
  } catch (error) {
    console.warn('Error converting user timezone to UTC:', error);
    return {
      hours: userHours,
      minutes: userMinutes
    };
  }
};

// Legacy functions for backward compatibility
export const getBeirutTime = (): { hours: number; minutes: number; seconds: number; formatted: string } => {
  return getTimeInTimezone("Asia/Beirut");
};

export const getNewYorkTime = (): { hours: number; minutes: number; seconds: number; formatted: string } => {
  return getTimeInTimezone("America/New_York");
};

// Format time utility
export const formatTime = (hours: number, minutes: number, seconds?: number, showSeconds?: boolean): string => {
  const showSecs = showSeconds ?? false;
  if (showSecs && seconds !== undefined) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Smart format time that shows seconds when countdown is below 5 minutes
export const formatTimeSmart = (hours: number, minutes: number, seconds?: number, showSeconds?: boolean, countdownMinutes?: number): string => {
  const showSecs = showSeconds ?? false;
  const isCountdownLow = countdownMinutes !== undefined && countdownMinutes < 5;
  
  // Show seconds if: user setting is on OR countdown is below 5 minutes
  const shouldShowSeconds = showSecs || isCountdownLow;
  
  
  if (shouldShowSeconds && seconds !== undefined) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Smart format countdown that shows seconds when countdown is below 5 minutes (00h 00m 00s format)
export const formatCountdownSmart = (hours: number, minutes: number, seconds?: number, showSeconds?: boolean, countdownMinutes?: number): string => {
  const showSecs = showSeconds ?? false;
  const isCountdownLow = countdownMinutes !== undefined && countdownMinutes < 5;
  
  // Show seconds if: user setting is on OR countdown is below 5 minutes
  const shouldShowSeconds = showSecs || isCountdownLow;
  
  if (shouldShowSeconds && seconds !== undefined) {
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
};

// Time calculation utilities
export const formatDuration = (startHours: number, startMinutes: number, endHours: number, endMinutes: number): string => {
  const startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;
  
  // Handle overnight periods
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60; // Add 24 hours
  }
  
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

// Check if time is within range
export const isTimeInRange = (currentHours: number, currentMinutes: number, startHours: number, startMinutes: number, endHours: number, endMinutes: number): boolean => {
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  const startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;
  
  // Handle overnight periods
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60; // Add 24 hours
    
    // If current time is before midnight but after start time
    if (currentTotalMinutes >= startTotalMinutes) {
      return true;
    }
    
    // If current time is after midnight but before end time
    if (currentTotalMinutes <= (endTotalMinutes - 24 * 60)) {
      return true;
    }
    
    return false;
  }
  
  return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
};

// Timezone utilities
export const getTimezoneOffset = (timezone: string): string => {
  try {
    const now = new Date();
    const utcTime = new Date(now.toLocaleString("en-US", {timeZone: "UTC"}));
    const timezoneTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    
    const offsetMinutes = (timezoneTime.getTime() - utcTime.getTime()) / (1000 * 60);
    const offsetHours = offsetMinutes / 60;
    
    const sign = offsetHours >= 0 ? '+' : '-';
    const absHours = Math.abs(Math.floor(offsetHours));
    const absMinutes = Math.abs(offsetMinutes % 60);
    
    return `UTC${sign}${absHours.toString().padStart(2, '0')}:${absMinutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.warn(`Error getting timezone offset for ${timezone}:`, error);
    return 'UTC+00:00';
  }
};

export const getTimezoneName = (timezone: string): string => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long'
    });
    
    const parts = formatter.formatToParts(now);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName');
    
    return timeZoneName?.value || timezone;
  } catch (error) {
    console.warn(`Error getting timezone name for ${timezone}:`, error);
    return timezone;
  }
};

export const getCurrentTimeInTimezone = (timezone: string): string => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    return formatter.format(now);
  } catch (error) {
    console.warn(`Error getting current time for ${timezone}:`, error);
    return '00:00:00';
  }
};

// Validation utilities
export const isValidTime = (hours: number, minutes: number): boolean => {
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

export const normalizeTime = (hours: number, minutes: number): { hours: number; minutes: number } => {
  let normalizedHours = hours;
  let normalizedMinutes = minutes;
  
  // Handle minute overflow
  if (normalizedMinutes >= 60) {
    normalizedHours += Math.floor(normalizedMinutes / 60);
    normalizedMinutes = normalizedMinutes % 60;
  } else if (normalizedMinutes < 0) {
    const hoursToSubtract = Math.ceil(Math.abs(normalizedMinutes) / 60);
    normalizedHours -= hoursToSubtract;
    normalizedMinutes = 60 - (Math.abs(normalizedMinutes) % 60);
  }
  
  // Handle hour overflow
  if (normalizedHours >= 24) {
    normalizedHours = normalizedHours % 24;
  } else if (normalizedHours < 0) {
    normalizedHours = 24 + (normalizedHours % 24);
  }
  
  return {
    hours: normalizedHours,
    minutes: normalizedMinutes
  };
};

// Format date for display in tooltips
export const formatDateForDisplay = (timezone: string): string => {
  const now = new Date();
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(now);
  return date;
};

// Format countdown from minutes input (for NextEventsPanel)
export const formatCountdownDetailed = (totalMinutes: number, showSeconds?: boolean): { display: string; isUrgent: boolean; isSoon: boolean } => {
  if (totalMinutes <= 0) {
    return { display: 'Now', isUrgent: true, isSoon: true };
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  let display = '';
  
  // Show seconds if user preference is enabled and countdown is below 5 minutes
  const shouldShowSeconds = showSeconds && totalMinutes < 5;
  
  if (shouldShowSeconds) {
    // For seconds display, we need to convert minutes to seconds
    const totalSeconds = Math.floor(totalMinutes * 60);
    const displayHours = Math.floor(totalSeconds / 3600);
    const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
    const displaySeconds = totalSeconds % 60;
    
    if (displayHours > 0) {
      display = `${displayHours}h ${displayMinutes}m ${displaySeconds}s`;
    } else if (displayMinutes > 0) {
      display = `${displayMinutes}m ${displaySeconds}s`;
    } else {
      display = `${displaySeconds}s`;
    }
  } else {
    if (hours > 0) {
      display = `${hours}h ${minutes}m`;
    } else {
      display = `${minutes}m`;
    }
  }
  
  return {
    display,
    isUrgent: totalMinutes <= 5,  // Less than 5 minutes
    isSoon: totalMinutes <= 30    // Less than 30 minutes
  };
};

// Re-export functions from other modules for convenience
export const formatCountdownSeconds = CountdownService.formatCountdownSeconds;
export { getEventTypeStyles, getStatusStyles };