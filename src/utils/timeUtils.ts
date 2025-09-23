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

export const formatCountdownSeconds = (totalSeconds: number): { display: string; isUrgent: boolean; isSoon: boolean } => {
  if (totalSeconds <= 0) {
    return { display: 'Now', isUrgent: true, isSoon: true };
  }
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  let display = '';
  if (hours > 0) {
    display = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    display = `${minutes}m ${seconds}s`;
  } else {
    display = `${seconds}s`;
  }
  
  return {
    display,
    isUrgent: totalSeconds <= 300, // Less than 5 minutes
    isSoon: totalSeconds <= 1800   // Less than 30 minutes
  };
};

export const getEventTypeStyles = (eventType: string) => {
  switch (eventType) {
    case 'macro': 
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        dot: 'bg-blue-400',
        badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      };
    case 'killzone': 
      return {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30', 
        text: 'text-purple-400',
        dot: 'bg-purple-400',
        badge: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
      };
    case 'news': 
      return {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        dot: 'bg-orange-400',
        badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
      };
    case 'premarket': 
      return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        dot: 'bg-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      };
    case 'lunch': 
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        dot: 'bg-red-400',
        badge: 'bg-red-500/20 text-red-400 border border-red-500/30'
      };
    default: 
      return {
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        text: 'text-gray-400',
        dot: 'bg-gray-400',
        badge: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
      };
  }
};

export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'green': 
      return {
        border: 'border-green-500/50',
        bg: 'bg-green-500/5',
        gradient: 'from-green-500 to-emerald-600'
      };
    case 'amber': 
      return {
        border: 'border-yellow-500/50',
        bg: 'bg-yellow-500/5',
        gradient: 'from-yellow-500 to-orange-600'
      };
    case 'red': 
      return {
        border: 'border-red-500/50',
        bg: 'bg-red-500/5',
        gradient: 'from-red-500 to-rose-600'
      };
    default: 
      return {
        border: 'border-gray-500/50',
        bg: 'bg-gray-500/5',
        gradient: 'from-gray-500 to-slate-600'
      };
  }
};