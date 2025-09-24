import { NewsTemplate, NewsInstance } from '../models';
import { NewsService } from '../services/NewsService';

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
  newsTemplates: NewsTemplate[];
  newsInstances: NewsInstance[];
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
  newsTemplates: NewsService.getDefaultNewsTemplates(),
  newsInstances: []
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

export const getTradingStatus = (
  currentHour: number,
  currentMinute: number,
  parameters: TradingParameters
): { status: TradingStatus; period: string; nextEvent: string } => {
  const currentTime = currentHour * 60 + currentMinute;
  const blocks = generateTimeBlocks(parameters);
  
  // Create current date with the provided time for news checking
  const now = new Date();
  const currentDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, currentMinute);
  
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
    return currentTime >= startTime && currentTime <= endTime;
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
    return currentTime >= startTime && currentTime <= endTime;
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