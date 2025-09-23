export type TradingStatus = 'green' | 'amber' | 'red';

export interface TimeRange {
  hours: number;
  minutes: number;
}


export interface TimeBlock {
  type: 'macro' | 'killzone' | 'premarket' | 'lunch' | 'news' | 'inactive';
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface MacroSession {
  id: string;
  name: string;
  start: TimeRange;
  end: TimeRange;
  region: 'Tokyo' | 'London' | 'New York';
}

export interface NewsEvent {
  id: string;
  time: TimeRange;
  name: string;
  impact: 'high' | 'medium' | 'low';
  region: 'Tokyo' | 'London' | 'New York';
}

export interface KillzoneSession {
  id: string;
  name: string;
  start: TimeRange;
  end: TimeRange;
  region: 'Tokyo' | 'London' | 'New York';
}

export interface TradingParameters {
  macros: MacroSession[];
  killzones: KillzoneSession[];
  sessions: {
    premarket: { start: TimeRange; end: TimeRange };
    lunch: { start: TimeRange; end: TimeRange };
  };
  newsEvents: NewsEvent[];
}

export const defaultTradingParameters: TradingParameters = {
  macros: [
    {
      id: 'london-1',
      name: 'London Session 1',
      start: { hours: 9, minutes: 33 },
      end: { hours: 10, minutes: 0 },
      region: 'London'
    },
    {
      id: 'london-2', 
      name: 'London Session 2',
      start: { hours: 11, minutes: 3 },
      end: { hours: 11, minutes: 30 },
      region: 'London'
    },
    {
      id: 'ny-am-1',
      name: 'NY AM 1',
      start: { hours: 15, minutes: 50 },
      end: { hours: 16, minutes: 10 },
      region: 'New York'
    },
    {
      id: 'ny-am-2',
      name: 'NY AM 2', 
      start: { hours: 16, minutes: 50 },
      end: { hours: 17, minutes: 10 },
      region: 'New York'
    },
    {
      id: 'ny-am-3',
      name: 'NY AM 3',
      start: { hours: 17, minutes: 50 },
      end: { hours: 18, minutes: 10 },
      region: 'New York'
    },
    {
      id: 'ny-midday',
      name: 'NY Midday',
      start: { hours: 18, minutes: 50 },
      end: { hours: 19, minutes: 10 },
      region: 'New York'
    },
    {
      id: 'ny-pm',
      name: 'NY PM',
      start: { hours: 20, minutes: 10 },
      end: { hours: 20, minutes: 40 },
      region: 'New York'
    },
    {
      id: 'ny-closing',
      name: 'NY Closing',
      start: { hours: 22, minutes: 15 },
      end: { hours: 22, minutes: 45 },
      region: 'New York'
    }
  ],
  killzones: [
    {
      id: 'london-kz',
      name: 'London KZ',
      start: { hours: 6, minutes: 0 },
      end: { hours: 9, minutes: 0 },
      region: 'London'
    },
    {
      id: 'newyork-kz',
      name: 'New York KZ',
      start: { hours: 14, minutes: 30 },
      end: { hours: 17, minutes: 30 },
      region: 'New York'
    }
  ],
  sessions: {
    premarket: { 
      start: { hours: 7, minutes: 0 }, 
      end: { hours: 9, minutes: 30 } 
    },
    lunch: { 
      start: { hours: 18, minutes: 0 }, 
      end: { hours: 19, minutes: 0 } 
    }
  },
  newsEvents: [
    {
      id: 'fomc',
      time: { hours: 15, minutes: 30 },
      name: "FOMC Meeting",
      impact: 'high',
      region: 'New York'
    },
    {
      id: 'nfp',
      time: { hours: 12, minutes: 0 },
      name: "NFP Release", 
      impact: 'high',
      region: 'New York'
    }
  ]
};

export const generateTimeBlocks = (parameters: TradingParameters): TimeBlock[] => {
  const blocks: TimeBlock[] = [];
  
  // Add macros
  parameters.macros.forEach(macro => {
    blocks.push({
      type: 'macro',
      name: macro.name,
      startHour: macro.start.hours,
      startMinute: macro.start.minutes,
      endHour: macro.end.hours,
      endMinute: macro.end.minutes
    });
  });
  
  // Add killzones
  parameters.killzones.forEach(killzone => {
    blocks.push({
      type: 'killzone',
      name: killzone.name,
      startHour: killzone.start.hours,
      startMinute: killzone.start.minutes,
      endHour: killzone.end.hours,
      endMinute: killzone.end.minutes
    });
  });
  
  // Add sessions
  blocks.push({
    type: 'premarket',
    name: 'Pre-Market',
    startHour: parameters.sessions.premarket.start.hours,
    startMinute: parameters.sessions.premarket.start.minutes,
    endHour: parameters.sessions.premarket.end.hours,
    endMinute: parameters.sessions.premarket.end.minutes
  });
  
  blocks.push({
    type: 'lunch',
    name: 'Lunch',
    startHour: parameters.sessions.lunch.start.hours,
    startMinute: parameters.sessions.lunch.start.minutes,
    endHour: parameters.sessions.lunch.end.hours,
    endMinute: parameters.sessions.lunch.end.minutes
  });
  
  // Add news events
  parameters.newsEvents.forEach(event => {
    if (event.impact === 'high') {
      blocks.push({
        type: 'news',
        name: event.name,
        startHour: event.time.hours,
        startMinute: event.time.minutes,
        endHour: event.time.hours,
        endMinute: event.time.minutes + 30 // 30 minute news block
      });
    }
  });
  
  return blocks.sort((a, b) => {
    const aTime = a.startHour * 60 + a.startMinute;
    const bTime = b.startHour * 60 + b.startMinute;
    return aTime - bTime;
  });
};

export const getTradingStatus = (
  currentHour: number,
  currentMinute: number,
  parameters: TradingParameters
): { status: TradingStatus; period: string; nextEvent: string } => {
  const currentTime = currentHour * 60 + currentMinute;
  const blocks = generateTimeBlocks(parameters);
  
  // Check if we're in a specific time block
  for (const block of blocks) {
    const startTime = block.startHour * 60 + block.startMinute;
    const endTime = block.endHour * 60 + block.endMinute;
    
    if (currentTime >= startTime && currentTime <= endTime) {
      switch (block.type) {
        case 'macro':
        case 'killzone':
          return {
            status: 'green',
            period: `${block.name} - Trading Active`,
            nextEvent: getNextEvent(currentTime, blocks)
          };
        case 'premarket':
          return {
            status: 'amber',
            period: 'Pre-Market Session - Caution',
            nextEvent: getNextEvent(currentTime, blocks)
          };
        case 'lunch':
        case 'news':
          return {
            status: 'red',
            period: `${block.name} - Trading Halted`,
            nextEvent: getNextEvent(currentTime, blocks)
          };
      }
    }
  }
  
  // Check for upcoming news (30 minutes warning)
  for (const block of blocks) {
    if (block.type === 'news') {
      const startTime = block.startHour * 60 + block.startMinute;
      if (currentTime >= startTime - 30 && currentTime < startTime) {
        return {
          status: 'amber',
          period: `Warning: ${block.name} in ${Math.ceil((startTime - currentTime))} minutes`,
          nextEvent: getNextEvent(currentTime, blocks)
        };
      }
    }
  }
  
  return {
    status: 'red',
    period: 'Outside Trading Hours',
    nextEvent: getNextEvent(currentTime, blocks)
  };
};

const getNextEvent = (currentTime: number, blocks: TimeBlock[]): string => {
  const upcomingBlocks = blocks.filter(block => {
    const startTime = block.startHour * 60 + block.startMinute;
    return startTime > currentTime;
  });
  
  if (upcomingBlocks.length === 0) {
    // Next day's first event
    const firstBlock = blocks[0];
    if (firstBlock) {
      const timeUntil = (24 * 60) - currentTime + (firstBlock.startHour * 60 + firstBlock.startMinute);
      const hours = Math.floor(timeUntil / 60);
      const minutes = timeUntil % 60;
      return `${firstBlock.name} in ${hours}h ${minutes}m`;
    }
    return 'No upcoming events';
  }
  
  const nextBlock = upcomingBlocks[0];
  const startTime = nextBlock.startHour * 60 + nextBlock.startMinute;
  const timeUntil = startTime - currentTime;
  const hours = Math.floor(timeUntil / 60);
  const minutes = timeUntil % 60;
  
  if (hours > 0) {
    return `${nextBlock.name} in ${hours}h ${minutes}m`;
  } else {
    return `${nextBlock.name} in ${minutes}m`;
  }
};

export interface NextEvent {
  name: string;
  startTime: { hours: number; minutes: number };
  timeUntilMinutes: number;
  region?: string;
  impact?: string;
}

export const getNextMacro = (currentHour: number, currentMinute: number, parameters: TradingParameters): NextEvent | null => {
  const currentTime = currentHour * 60 + currentMinute;
  
  // Get upcoming macros today
  const upcomingMacros = parameters.macros.filter(macro => {
    const startTime = macro.start.hours * 60 + macro.start.minutes;
    return startTime > currentTime;
  });
  
  if (upcomingMacros.length > 0) {
    // Sort by start time and get the earliest
    const nextMacro = upcomingMacros.sort((a, b) => {
      const aTime = a.start.hours * 60 + a.start.minutes;
      const bTime = b.start.hours * 60 + b.start.minutes;
      return aTime - bTime;
    })[0];
    
    const startTime = nextMacro.start.hours * 60 + nextMacro.start.minutes;
    return {
      name: nextMacro.name,
      startTime: nextMacro.start,
      timeUntilMinutes: startTime - currentTime,
      region: nextMacro.region
    };
  }
  
  // If no more macros today, get tomorrow's first macro
  if (parameters.macros.length > 0) {
    const firstMacro = parameters.macros.sort((a, b) => {
      const aTime = a.start.hours * 60 + a.start.minutes;
      const bTime = b.start.hours * 60 + b.start.minutes;
      return aTime - bTime;
    })[0];
    
    const startTime = firstMacro.start.hours * 60 + firstMacro.start.minutes;
    const timeUntil = (24 * 60) - currentTime + startTime;
    
    return {
      name: firstMacro.name,
      startTime: firstMacro.start,
      timeUntilMinutes: timeUntil,
      region: firstMacro.region
    };
  }
  
  return null;
};

export const getNextKillzone = (currentHour: number, currentMinute: number, parameters: TradingParameters): NextEvent | null => {
  const currentTime = currentHour * 60 + currentMinute;
  
  // Get upcoming killzones today
  const upcomingKillzones = parameters.killzones.filter(killzone => {
    const startTime = killzone.start.hours * 60 + killzone.start.minutes;
    return startTime > currentTime;
  });
  
  if (upcomingKillzones.length > 0) {
    // Sort by start time and get the earliest
    const nextKillzone = upcomingKillzones.sort((a, b) => {
      const aTime = a.start.hours * 60 + a.start.minutes;
      const bTime = b.start.hours * 60 + b.start.minutes;
      return aTime - bTime;
    })[0];
    
    const startTime = nextKillzone.start.hours * 60 + nextKillzone.start.minutes;
    return {
      name: nextKillzone.name,
      startTime: nextKillzone.start,
      timeUntilMinutes: startTime - currentTime,
      region: nextKillzone.region
    };
  }
  
  // If no more killzones today, get tomorrow's first killzone
  if (parameters.killzones.length > 0) {
    const firstKillzone = parameters.killzones.sort((a, b) => {
      const aTime = a.start.hours * 60 + a.start.minutes;
      const bTime = b.start.hours * 60 + b.start.minutes;
      return aTime - bTime;
    })[0];
    
    const startTime = firstKillzone.start.hours * 60 + firstKillzone.start.minutes;
    const timeUntil = (24 * 60) - currentTime + startTime;
    
    return {
      name: firstKillzone.name,
      startTime: firstKillzone.start,
      timeUntilMinutes: timeUntil,
      region: firstKillzone.region
    };
  }
  
  return null;
};

export const getNextNewsEvent = (currentHour: number, currentMinute: number, parameters: TradingParameters): NextEvent | null => {
  const currentTime = currentHour * 60 + currentMinute;
  
  // Get upcoming news events today
  const upcomingEvents = parameters.newsEvents.filter(event => {
    const startTime = event.time.hours * 60 + event.time.minutes;
    return startTime > currentTime;
  });
  
  if (upcomingEvents.length > 0) {
    // Sort by start time and get the earliest
    const nextEvent = upcomingEvents.sort((a, b) => {
      const aTime = a.time.hours * 60 + a.time.minutes;
      const bTime = b.time.hours * 60 + b.time.minutes;
      return aTime - bTime;
    })[0];
    
    const startTime = nextEvent.time.hours * 60 + nextEvent.time.minutes;
    return {
      name: nextEvent.name,
      startTime: nextEvent.time,
      timeUntilMinutes: startTime - currentTime,
      region: nextEvent.region,
      impact: nextEvent.impact
    };
  }
  
  // If no more events today, get tomorrow's first event
  if (parameters.newsEvents.length > 0) {
    const firstEvent = parameters.newsEvents.sort((a, b) => {
      const aTime = a.time.hours * 60 + a.time.minutes;
      const bTime = b.time.hours * 60 + b.time.minutes;
      return aTime - bTime;
    })[0];
    
    const startTime = firstEvent.time.hours * 60 + firstEvent.time.minutes;
    const timeUntil = (24 * 60) - currentTime + startTime;
    
    return {
      name: firstEvent.name,
      startTime: firstEvent.time,
      timeUntilMinutes: timeUntil,
      region: firstEvent.region,
      impact: firstEvent.impact
    };
  }
  
  return null;
};