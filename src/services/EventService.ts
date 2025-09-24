// Event Service - Single Responsibility: Handle event management and filtering
import { TimeBlock, ActiveEvent, UpcomingEvent, TradingParameters, EventType } from '../models';
import { CountdownService } from './CountdownService';
import { TimeService } from './TimeService';

export class EventService {
  static generateTimeBlocks(parameters: TradingParameters): TimeBlock[] {
    const blocks: TimeBlock[] = [];
    
    // Add killzones
    blocks.push(...parameters.killzones);
    
    // Add macro events
    blocks.push(...parameters.macroEvents);
    
    // Add news events
    blocks.push(...parameters.newsEvents);
    
    // Add default trading periods
    blocks.push({
      id: 'premarket',
      name: 'Pre-Market',
      type: 'premarket',
      startHour: Math.floor(parameters.preMarketStart / 60),
      startMinute: parameters.preMarketStart % 60,
      endHour: Math.floor(parameters.marketOpen / 60),
      endMinute: parameters.marketOpen % 60,
    });

    blocks.push({
      id: 'lunch',
      name: 'Lunch Break',
      type: 'lunch',
      startHour: Math.floor(parameters.lunchStart / 60),
      startMinute: parameters.lunchStart % 60,
      endHour: Math.floor(parameters.lunchEnd / 60),
      endMinute: parameters.lunchEnd % 60,
    });
    
    return blocks.sort((a, b) => {
      const aStart = TimeService.timeToMinutes(a.startHour, a.startMinute);
      const bStart = TimeService.timeToMinutes(b.startHour, b.startMinute);
      return aStart - bStart;
    });
  }

  static getActiveEvents(timeBlocks: TimeBlock[]): ActiveEvent[] {
    const activeEvents: ActiveEvent[] = [];
    
    for (const block of timeBlocks) {
      const timeUntilStart = CountdownService.calculateTimeUntilEvent(block.startHour, block.startMinute);
      const timeLeft = CountdownService.calculateTimeLeft(block.endHour, block.endMinute);
      
      // Event is active if it has started (timeUntilStart <= 0) and hasn't ended (timeLeft > 0)
      const isActive = timeUntilStart <= 0 && timeLeft > 0;
      
      if (isActive) {
        activeEvents.push({
          block,
          timeLeft,
          timeUntilStart,
          isActive: true
        });
      }
    }
    
    return activeEvents.sort((a, b) => a.timeLeft - b.timeLeft);
  }

  static getUpcomingEvents(timeBlocks: TimeBlock[], limit: number = 10): UpcomingEvent[] {
    const upcomingEvents: UpcomingEvent[] = [];
    
    for (const block of timeBlocks) {
      const timeUntilStart = CountdownService.calculateTimeUntilEvent(block.startHour, block.startMinute);
      
      // Event is upcoming if it hasn't started yet
      if (timeUntilStart > 0) {
        upcomingEvents.push({
          block,
          timeUntilStart
        });
      }
    }
    
    return upcomingEvents
      .sort((a, b) => a.timeUntilStart - b.timeUntilStart)
      .slice(0, limit);
  }

  static getNextEventByType(upcomingEvents: UpcomingEvent[], eventType: EventType): UpcomingEvent | null {
    return upcomingEvents.find(event => event.block.type === eventType) || null;
  }

  static getNextSignificantEvent(upcomingEvents: UpcomingEvent[]): UpcomingEvent | null {
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  }
}