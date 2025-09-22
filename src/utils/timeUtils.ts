export const formatTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getBeirutTime = (): { hours: number; minutes: number; seconds: number; formatted: string } => {
  // Beirut is GMT+2 (Eastern European Time)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const beirutTime = new Date(utc + (2 * 3600000)); // GMT+2
  
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