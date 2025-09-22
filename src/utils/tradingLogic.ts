export type TradingStatus = 'green' | 'amber' | 'red';

export interface TimeRange {
  hours: number;
  minutes: number;
}

export interface TradingParameters {
  macros: {
    london: { start: TimeRange; end: TimeRange };
    newYorkAM: { start: TimeRange; end: TimeRange };
    newYorkPM: { start: TimeRange; end: TimeRange };
  };
  killzones: {
    london: { start: TimeRange; end: TimeRange };
    newYork: { start: TimeRange; end: TimeRange };
  };
  sessions: {
    premarket: { start: TimeRange; end: TimeRange };
    lunch: { start: TimeRange; end: TimeRange };
  };
  newsEvents: Array<{
    time: TimeRange;
    name: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}

export interface TimeBlock {
  type: 'macro' | 'killzone' | 'premarket' | 'lunch' | 'news' | 'inactive';
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export const defaultTradingParameters: TradingParameters = {
  macros: {
    london: { 
      start: { hours: 2, minutes: 0 }, 
      end: { hours: 5, minutes: 0 } 
    },
    newYorkAM: { 
      start: { hours: 8, minutes: 30 }, 
      end: { hours: 11, minutes: 0 } 
    },
    newYorkPM: { 
      start: { hours: 13, minutes: 30 }, 
      end: { hours: 16, minutes: 0 } 
    }
  },
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
      time: { hours: 15, minutes: 30 },
      name: "FOMC Meeting",
      impact: 'high'
    },
    {
      time: { hours: 12, minutes: 0 },
      name: "NFP Release",
      impact: 'high'
    }
  ]
};

export const generateTimeBlocks = (parameters: TradingParameters): TimeBlock[] => {
  const blocks: TimeBlock[] = [];
  
  // Add macros
  blocks.push({
    type: 'macro',
    name: 'London',
    startHour: parameters.macros.london.start.hours,
    startMinute: parameters.macros.london.start.minutes,
    endHour: parameters.macros.london.end.hours,
    endMinute: parameters.macros.london.end.minutes
  });
  
  blocks.push({
    type: 'macro',
    name: 'NY AM',
    startHour: parameters.macros.newYorkAM.start.hours,
    startMinute: parameters.macros.newYorkAM.start.minutes,
    endHour: parameters.macros.newYorkAM.end.hours,
    endMinute: parameters.macros.newYorkAM.end.minutes
  });
  
  blocks.push({
    type: 'macro',
    name: 'NY PM',
    startHour: parameters.macros.newYorkPM.start.hours,
    startMinute: parameters.macros.newYorkPM.start.minutes,
    endHour: parameters.macros.newYorkPM.end.hours,
    endMinute: parameters.macros.newYorkPM.end.minutes
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