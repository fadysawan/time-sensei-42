export const formatTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getBeirutTime = (): { hours: number; minutes: number; seconds: number; formatted: string } => {
  // Beirut timezone with automatic daylight saving time handling
  const now = new Date();
  const beirutTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Beirut"}));
  
  return {
    hours: beirutTime.getHours(),
    minutes: beirutTime.getMinutes(),
    seconds: beirutTime.getSeconds(),
    formatted: beirutTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  };
};

export const getNewYorkTime = (): { hours: number; minutes: number; seconds: number; formatted: string } => {
  // New York timezone with automatic daylight saving time handling (EST/EDT)
  const now = new Date();
  const nyTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  
  return {
    hours: nyTime.getHours(),
    minutes: nyTime.getMinutes(),
    seconds: nyTime.getSeconds(),
    formatted: nyTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  };
};

export const parseTimeString = (timeString: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
};

export const timeToMinutes = (hours: number, minutes: number): number => {
  return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes: number): { hours: number; minutes: number } => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
};

export const formatCountdown = (totalMinutes: number): string => {
  if (totalMinutes <= 0) return 'Now';
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const formatCountdownDetailed = (totalMinutes: number): { display: string; isUrgent: boolean; isSoon: boolean } => {
  if (totalMinutes <= 0) {
    return { display: 'Now', isUrgent: true, isSoon: true };
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  let display = '';
  if (hours > 0) {
    display = `${hours}h ${minutes}m`;
  } else {
    display = `${minutes}m`;
  }
  
  return {
    display,
    isUrgent: totalMinutes <= 15, // Less than 15 minutes
    isSoon: totalMinutes <= 60    // Less than 1 hour
  };
};