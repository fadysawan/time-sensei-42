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
}

export interface NewsEvent {
  id: string;
  time: TimeRange;
  name: string;
  impact: 'high' | 'medium' | 'low';
}

export interface TradingParameters {
  macros: MacroSession[];
  killzones: {
    london: { start: TimeRange; end: TimeRange };
    newYork: { start: TimeRange; end: TimeRange };
  };
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
      end: { hours: 10, minutes: 0 }
    },
    {
      id: 'london-2', 
      name: 'London Session 2',
      start: { hours: 11, minutes: 3 },
      end: { hours: 11, minutes: 30 }
    },
    {
      id: 'ny-am-1',
      name: 'NY AM 1',
      start: { hours: 15, minutes: 50 },
      end: { hours: 16, minutes: 10 }
    },
    {
      id: 'ny-am-2',
      name: 'NY AM 2', 
      start: { hours: 16, minutes: 50 },
      end: { hours: 17, minutes: 10 }
    },
    {
      id: 'ny-am-3',
      name: 'NY AM 3',
      start: { hours: 17, minutes: 50 },
      end: { hours: 18, minutes: 10 }
    },
    {
      id: 'ny-midday',
      name: 'NY Midday',
      start: { hours: 18, minutes: 50 },
      end: { hours: 19, minutes: 10 }
    },
    {
      id: 'ny-pm',
      name: 'NY PM',
      start: { hours: 20, minutes: 10 },
      end: { hours: 20, minutes: 40 }
    },
    {
      id: 'ny-closing',
      name: 'NY Closing',
      start: { hours: 22, minutes: 15 },
      end: { hours: 22, minutes: 45 }
    }
  ],
  killzones: {
    london: { 
      start: { hours: 6, minutes: 0 }, 
      end: { hours: 9, minutes: 0 } 
    },
    newYork: { 
      start: { hours: 14, minutes: 30 }, 
      end: { hours: 17, minutes: 30 } 
    }
  },
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
      impact: 'high'
    },
    {
      id: 'nfp',
      time: { hours: 12, minutes: 0 },
      name: "NFP Release", 
      impact: 'high'
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
  blocks.push({
    type: 'killzone',
    name: 'London KZ',
    startHour: parameters.killzones.london.start.hours,
    startMinute: parameters.killzones.london.start.minutes,
    endHour: parameters.killzones.london.end.hours,
    endMinute: parameters.killzones.london.end.minutes
  });
  
  blocks.push({
    type: 'killzone',
    name: 'NY KZ',
    startHour: parameters.killzones.newYork.start.hours,
    startMinute: parameters.killzones.newYork.start.minutes,
    endHour: parameters.killzones.newYork.end.hours,
    endMinute: parameters.killzones.newYork.end.minutes
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