import { useState, useEffect } from 'react';
import { TradingParameters, getTradingStatus, TradingStatus, generateTimeBlocks, TimeBlock } from '../utils/tradingLogic';
import { getBeirutTime, getNewYorkTime } from '../utils/timeUtils';

interface ActiveEvent {
  block: TimeBlock;
  timeLeft: number; // seconds until event ends
  timeUntilStart: number; // seconds until event starts (negative if already started)
  isActive: boolean;
}

interface UpcomingEvent {
  block: TimeBlock;
  timeUntilStart: number; // seconds until event starts
}

interface UseTradeTimeReturn {
  currentTime: string;
  newYorkTime: string;
  tradingStatus: TradingStatus;
  currentPeriod: string;
  nextEvent: string;
  activeEvents: ActiveEvent[]; // Changed to array
  upcomingEvents: UpcomingEvent[]; // Changed to array
  countdown: number; // seconds until next significant event
}

export const useTradeTime = (parameters: TradingParameters): UseTradeTimeReturn => {
  const [currentTime, setCurrentTime] = useState('');
  const [newYorkTime, setNewYorkTime] = useState('');
  const [tradingStatus, setTradingStatus] = useState<TradingStatus>('red');
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [nextEvent, setNextEvent] = useState('');
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const beirutTime = getBeirutTime();
      const nyTime = getNewYorkTime();
      
      setCurrentTime(beirutTime.formatted);
      setNewYorkTime(nyTime.formatted);
      
      const status = getTradingStatus(
        beirutTime.hours,
        beirutTime.minutes,
        parameters
      );
      
      setTradingStatus(status.status);
      setCurrentPeriod(status.period);
      setNextEvent(status.nextEvent);

      // Calculate detailed event information
      const currentTimeMinutes = beirutTime.hours * 60 + beirutTime.minutes;
      const currentTimeSeconds = currentTimeMinutes * 60 + beirutTime.seconds;
      const blocks = generateTimeBlocks(parameters);
      
      // Find all active events
      const foundActiveEvents: ActiveEvent[] = [];
      for (const block of blocks) {
        const startTimeSeconds = (block.startHour * 60 + block.startMinute) * 60;
        const endTimeSeconds = (block.endHour * 60 + block.endMinute) * 60;
        
        if (currentTimeSeconds >= startTimeSeconds && currentTimeSeconds <= endTimeSeconds) {
          foundActiveEvents.push({
            block,
            timeLeft: endTimeSeconds - currentTimeSeconds,
            timeUntilStart: startTimeSeconds - currentTimeSeconds,
            isActive: true
          });
        }
      }
      setActiveEvents(foundActiveEvents);

      // Find all upcoming events (next 3-5 events)
      const foundUpcomingEvents: UpcomingEvent[] = [];
      const upcomingBlocks = blocks
        .filter(block => {
          const startTimeSeconds = (block.startHour * 60 + block.startMinute) * 60;
          return startTimeSeconds > currentTimeSeconds;
        })
        .sort((a, b) => {
          const aStart = (a.startHour * 60 + a.startMinute) * 60;
          const bStart = (b.startHour * 60 + b.startMinute) * 60;
          return aStart - bStart;
        })
        .slice(0, 5); // Get next 5 upcoming events

      for (const block of upcomingBlocks) {
        const startTimeSeconds = (block.startHour * 60 + block.startMinute) * 60;
        foundUpcomingEvents.push({
          block,
          timeUntilStart: startTimeSeconds - currentTimeSeconds
        });
      }
      setUpcomingEvents(foundUpcomingEvents);

      // Set countdown to next significant event
      if (foundActiveEvents.length > 0) {
        // Use the event that ends soonest
        const soonestEndingEvent = foundActiveEvents.reduce((min, event) => 
          event.timeLeft < min.timeLeft ? event : min
        );
        setCountdown(soonestEndingEvent.timeLeft);
      } else if (foundUpcomingEvents.length > 0) {
        setCountdown(foundUpcomingEvents[0].timeUntilStart);
      } else {
        setCountdown(0);
      }
    };

    // Update immediately
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [parameters]);

  return {
    currentTime,
    newYorkTime,
    tradingStatus,
    currentPeriod,
    nextEvent,
    activeEvents,
    upcomingEvents,
    countdown
  };
};