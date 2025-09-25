import { 
  NewsTemplate, 
  NewsInstance, 
  TimeRange, 
  TimeBlock, 
  MacroSession, 
  KillzoneSession, 
  MarketSession, 
  TradingParameters,
  TradingStatus
} from '../models';
import { NewsService } from '../services/NewsService';

export const defaultTradingParameters: TradingParameters = {
  macros: [
    {
      id: 'london-1',
      name: 'London Session 1',
      start: { hours: 7, minutes: 33 }, // UTC: 7:33 (was 9:33 Beirut time)
      end: { hours: 8, minutes: 0 },    // UTC: 8:00 (was 10:00 Beirut time)
      region: 'London',
      description: 'High volatility period during London market open',
      probability: 'High'
    },
    {
      id: 'london-2', 
      name: 'London Session 2',
      start: { hours: 9, minutes: 3 },  // UTC: 9:03 (was 11:03 Beirut time)
      end: { hours: 9, minutes: 30 },   // UTC: 9:30 (was 11:30 Beirut time)
      region: 'London',
      description: 'Second London session with moderate volatility',
      probability: undefined
    },
    {
      id: 'ny-am-1',
      name: 'NY AM 1',
      start: { hours: 13, minutes: 50 }, // UTC: 13:50 (was 15:50 Beirut time)
      end: { hours: 14, minutes: 10 },   // UTC: 14:10 (was 16:10 Beirut time)
      region: 'New York',
      description: 'Pre-market New York session with high probability moves',
      probability: 'High'
    },
    {
      id: 'ny-am-2',
      name: 'NY AM 2', 
      start: { hours: 14, minutes: 50 }, // UTC: 14:50 (was 16:50 Beirut time)
      end: { hours: 15, minutes: 10 },   // UTC: 15:10 (was 17:10 Beirut time)
      region: 'New York',
      description: 'Early New York session with moderate probability',
      probability: undefined
    },
    {
      id: 'ny-am-3',
      name: 'NY AM 3',
      start: { hours: 15, minutes: 50 }, // UTC: 15:50 (was 17:50 Beirut time)
      end: { hours: 16, minutes: 10 },   // UTC: 16:10 (was 18:10 Beirut time)
      region: 'New York',
      description: 'Mid-morning New York session with high probability',
      probability: 'High'
    },
    {
      id: 'ny-midday',
      name: 'NY Midday',
      start: { hours: 16, minutes: 50 }, // UTC: 16:50 (was 18:50 Beirut time)
      end: { hours: 17, minutes: 10 },   // UTC: 17:10 (was 19:10 Beirut time)
      region: 'New York',
      description: 'New York midday session with moderate volatility',
      probability: 'Low'
    },
    {
      id: 'ny-pm',
      name: 'NY PM',
      start: { hours: 18, minutes: 10 }, // UTC: 18:10 (was 20:10 Beirut time)
      end: { hours: 18, minutes: 40 },   // UTC: 18:40 (was 20:40 Beirut time)
      region: 'New York',
      description: 'New York afternoon session with high probability moves',
      probability: 'High'
    },
    {
      id: 'ny-closing',
      name: 'NY Closing',
      start: { hours: 20, minutes: 15 }, // UTC: 20:15 (was 22:15 Beirut time)
      end: { hours: 20, minutes: 45 },   // UTC: 20:45 (was 22:45 Beirut time)
      region: 'New York',
      description: 'New York market closing with high volatility',
      probability: 'High'
    }
  ],
  killzones: [
    {
      id: 'london-kz',
      name: 'London KZ',
      start: { hours: 4, minutes: 0 },   // UTC: 4:00 (temporary for testing)
      end: { hours: 7, minutes: 0 },     // UTC: 7:00 (temporary for testing)
      region: 'London'
    },
    {
      id: 'newyork-kz',
      name: 'New York KZ',
      start: { hours: 12, minutes: 30 }, // UTC: 12:30 (was 14:30 Beirut time)
      end: { hours: 15, minutes: 30 },   // UTC: 15:30 (was 17:30 Beirut time)
      region: 'New York'
    }
  ],
  marketSessions: [
    {
      id: 'premarket',
      name: 'Pre-Market',
      start: { hours: 5, minutes: 0 },   // UTC: 5:00 (was 7:00 Beirut time)
      end: { hours: 7, minutes: 30 },    // UTC: 7:30 (was 9:30 Beirut time)
      type: 'premarket',
      isActive: true,
      description: 'Pre-market trading session with low liquidity',
      probability: 'Low'
    },
    {
      id: 'lunch',
      name: 'Lunch Break',
      start: { hours: 17, minutes: 0 },  // UTC: 17:00 (was 19:00 Beirut time)
      end: { hours: 18, minutes: 0 },    // UTC: 18:00 (was 20:00 Beirut time)
      type: 'lunch',
      isActive: true,
      description: 'Market lunch break with reduced activity',
      probability: undefined
    },
    {
      id: 'custom-test',
      name: 'Custom Trading Session',
      start: { hours: 8, minutes: 0 },   // UTC: 8:00 (was 10:00 Beirut time)
      end: { hours: 10, minutes: 0 },    // UTC: 10:00 (was 12:00 Beirut time)
      type: 'custom',
      isActive: true,
      description: 'Custom trading session with high probability moves',
      probability: 'High'
    }
  ],
  newsTemplates: NewsService.getDefaultNewsTemplates(),
  newsInstances: [],
  userTimezone: 'UTC' // Will be updated to user's detected timezone on first load
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
      endMinute: macro.end.minutes,
      description: macro.description,
      probability: macro.probability
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
  
  // Add active market sessions
  parameters.marketSessions
    .filter(session => session.isActive)
    .forEach(session => {
      blocks.push({
        type: session.type,
        name: session.name,
        startHour: session.start.hours,
        startMinute: session.start.minutes,
        endHour: session.end.hours,
        endMinute: session.end.minutes,
        description: session.description,
        probability: session.probability
      });
    });
  
  // Add active news instances
  const now = new Date();
  parameters.newsInstances
    .filter(instance => instance.isActive)
    .forEach(instance => {
      const scheduledTime = new Date(instance.scheduledTime);
      const template = parameters.newsTemplates.find(t => t.id === instance.templateId);
      
      // Only show news for today (simplified check)
      if (scheduledTime.toDateString() === now.toDateString() && template) {
        blocks.push({
          type: 'news',
          name: instance.name,
          startHour: scheduledTime.getHours(),
          startMinute: scheduledTime.getMinutes(),
          endHour: scheduledTime.getHours(),
          endMinute: scheduledTime.getMinutes() + template.cooldownMinutes
        });
      }
    });
  
  return blocks.sort((a, b) => {
    const aTime = a.startHour * 60 + a.startMinute;
    const bTime = b.startHour * 60 + b.startMinute;
    return aTime - bTime;
  });
};

// Helper function to check if current time is within a time range (handles overnight ranges)
export const isTimeInRange = (currentTime: number, startTime: number, endTime: number): boolean => {
  // Handle overnight ranges (e.g., 22:00 to 06:00)
  if (startTime > endTime) {
    // Overnight range: current time should be >= startTime OR < endTime
    // Note: Using < instead of <= so that endTime is exclusive
    return currentTime >= startTime || currentTime < endTime;
  } else {
    // Normal range: current time should be >= startTime AND < endTime
    // Note: Using < instead of <= so that endTime is exclusive
    return currentTime >= startTime && currentTime < endTime;
  }
};

export const getTradingStatus = (
  currentHour: number,
  currentMinute: number,
  parameters: TradingParameters
): { status: TradingStatus; period: string; nextEvent: string } => {
  // All times are now in UTC internally
  const currentTime = currentHour * 60 + currentMinute;
  const blocks = generateTimeBlocks(parameters);
  
  // Create current date with the provided UTC time for news checking
  const now = new Date();
  const currentDateTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), currentHour, currentMinute));
  
  // PRIORITY 1: Check if we're in news countdown or cooldown period - RED LIGHT
  // Check active news instances manually to avoid circular dependency
  const activeNewsEvents: Array<{ instance: NewsInstance; template: NewsTemplate; phase: 'countdown' | 'happening' | 'cooldown' }> = [];
  
  for (const instance of parameters.newsInstances.filter(i => i.isActive)) {
    const template = parameters.newsTemplates.find(t => t.id === instance.templateId);
    if (!template) continue;

    const scheduledTime = new Date(instance.scheduledTime);
    const countdownStartTime = new Date(scheduledTime.getTime() - (template.countdownMinutes * 60 * 1000));
    const cooldownEndTime = new Date(scheduledTime.getTime() + (template.cooldownMinutes * 60 * 1000));

    if (currentDateTime >= countdownStartTime && currentDateTime <= cooldownEndTime) {
      let phase: 'countdown' | 'happening' | 'cooldown';
      
      if (currentDateTime < scheduledTime) {
        phase = 'countdown';
      } else if (currentDateTime.getTime() - scheduledTime.getTime() <= 60000) { // Within 1 minute of event
        phase = 'happening';
      } else {
        phase = 'cooldown';
      }

      activeNewsEvents.push({ instance, template, phase });
    }
  }
  
  if (activeNewsEvents.length > 0) {
    const activeEvent = activeNewsEvents[0]; // Get the most recent active event
    const phase = activeEvent.phase;
    let phaseText = '';
    
    switch (phase) {
      case 'countdown':
        phaseText = 'Countdown Period';
        break;
      case 'happening':
        phaseText = 'News Event Active';
        break;
      case 'cooldown':
        phaseText = 'Cooldown Period';
        break;
    }
    
    return {
      status: 'red',
      period: `${activeEvent.instance.name} - ${phaseText}`,
      nextEvent: getNextEvent(currentTime, blocks)
    };
  }
  
  // PRIORITY 2: Check if we're inside a killzone
  const currentKillzone = parameters.killzones.find(killzone => {
    const startTime = killzone.start.hours * 60 + killzone.start.minutes;
    const endTime = killzone.end.hours * 60 + killzone.end.minutes;
    return isTimeInRange(currentTime, startTime, endTime);
  });
  
  // If outside all killzones - RED LIGHT
  if (!currentKillzone) {
    return {
      status: 'red',
      period: 'Outside Killzone - No Trading',
      nextEvent: getNextEvent(currentTime, blocks)
    };
  }
  
  // PRIORITY 3: We're inside a killzone, check if also inside a macro
  const currentMacro = parameters.macros.find(macro => {
    const startTime = macro.start.hours * 60 + macro.start.minutes;
    const endTime = macro.end.hours * 60 + macro.end.minutes;
    return isTimeInRange(currentTime, startTime, endTime);
  });
  
  if (currentMacro) {
    // Inside both killzone AND macro - GREEN LIGHT
    return {
      status: 'green',
      period: `${currentKillzone.name} + ${currentMacro.name} - Optimal Trading`,
      nextEvent: getNextEvent(currentTime, blocks)
    };
  } else {
    // Inside killzone but outside macro - ORANGE LIGHT
    return {
      status: 'amber',
      period: `${currentKillzone.name} - Caution (No Macro)`,
      nextEvent: getNextEvent(currentTime, blocks)
    };
  }
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
  const now = new Date();
  
  // Get upcoming active news instances for today
  const todayInstances = parameters.newsInstances
    .filter(instance => {
      const scheduledTime = new Date(instance.scheduledTime);
      return instance.isActive && scheduledTime.toDateString() === now.toDateString();
    })
    .filter(instance => {
      const scheduledTime = new Date(instance.scheduledTime);
      const eventTime = scheduledTime.getHours() * 60 + scheduledTime.getMinutes();
      return eventTime > currentTime;
    });
  
  if (todayInstances.length > 0) {
    // Sort by scheduled time and get the earliest
    const nextInstance = todayInstances.sort((a, b) => {
      return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
    })[0];
    
    const scheduledTime = new Date(nextInstance.scheduledTime);
    const eventTime = scheduledTime.getHours() * 60 + scheduledTime.getMinutes();
    
    return {
      name: nextInstance.name,
      startTime: { hours: scheduledTime.getHours(), minutes: scheduledTime.getMinutes() },
      timeUntilMinutes: eventTime - currentTime,
      impact: nextInstance.impact
    };
  }
  
  return null;
};