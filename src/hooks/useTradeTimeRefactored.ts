// Refactored useTradeTime hook - Following Dependency Inversion Principle
import { useState, useEffect } from 'react';
import { TradingParameters, ActiveEvent, UpcomingEvent, TradingStatus, CountdownInfo } from '../models';
import { TimeService, EventService, TradingStatusService, CountdownService } from '../services';
import { APP_CONFIG } from '../constants';

interface UseTradeTimeReturn {
  currentTime: string;
  newYorkTime: string;
  tradingStatus: TradingStatus;
  currentPeriod: string;
  nextEvent: string;
  activeEvents: ActiveEvent[];
  upcomingEvents: UpcomingEvent[];
  countdown: number;
  countdownInfo: CountdownInfo;
}

interface UseTradeTimeOptions {
  updateInterval?: number;
  maxUpcomingEvents?: number;
}

export const useTradeTime = (
  parameters: TradingParameters,
  options: UseTradeTimeOptions = {}
): UseTradeTimeReturn => {
  const {
    updateInterval = APP_CONFIG.UPDATE_INTERVAL,
    maxUpcomingEvents = APP_CONFIG.MAX_UPCOMING_EVENTS
  } = options;

  // State management
  const [currentTime, setCurrentTime] = useState('');
  const [newYorkTime, setNewYorkTime] = useState('');
  const [tradingStatus, setTradingStatus] = useState<TradingStatus>('red');
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [nextEvent, setNextEvent] = useState('');
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [countdownInfo, setCountdownInfo] = useState<CountdownInfo>({ 
    display: '', 
    isUrgent: false, 
    isSoon: false 
  });

  useEffect(() => {
    const updateTime = () => {
      // Get current times using TimeService
      const beirutTime = TimeService.getBeirutTime();
      const nyTime = TimeService.getNewYorkTime();
      
      setCurrentTime(beirutTime.formatted);
      setNewYorkTime(nyTime.formatted);
      
      // Get trading status using TradingStatusService
      const statusResult = TradingStatusService.getTradingStatus(
        beirutTime.hours,
        beirutTime.minutes,
        parameters
      );
      
      setTradingStatus(statusResult.status);
      setCurrentPeriod(statusResult.period);
      setNextEvent(statusResult.nextEvent);

      // Generate and process events using EventService
      const timeBlocks = EventService.generateTimeBlocks(parameters);
      const currentActiveEvents = EventService.getActiveEvents(timeBlocks);
      const currentUpcomingEvents = EventService.getUpcomingEvents(timeBlocks, maxUpcomingEvents);
      
      setActiveEvents(currentActiveEvents);
      setUpcomingEvents(currentUpcomingEvents);

      // Calculate countdown to next significant event
      const nextSignificantEvent = EventService.getNextSignificantEvent(currentUpcomingEvents);
      let nextCountdown = 0;
      
      if (nextSignificantEvent) {
        nextCountdown = nextSignificantEvent.timeUntilStart;
      } else if (currentActiveEvents.length > 0) {
        // If there are active events, countdown to the one ending soonest
        nextCountdown = Math.min(...currentActiveEvents.map(e => e.timeLeft));
      } else {
        // Get next trading event using TradingStatusService
        const currentTimeMinutes = TimeService.getCurrentTimeInMinutes();
        const nextTradingEvent = TradingStatusService.getNextTradingEvent(currentTimeMinutes, parameters);
        nextCountdown = nextTradingEvent.timeUntil * 60; // Convert minutes to seconds
      }
      
      setCountdown(nextCountdown);
      setCountdownInfo(CountdownService.formatCountdownSeconds(nextCountdown));
    };

    // Initial update
    updateTime();
    
    // Set up interval
    const interval = setInterval(updateTime, updateInterval);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [parameters, updateInterval, maxUpcomingEvents]);

  return {
    currentTime,
    newYorkTime,
    tradingStatus,
    currentPeriod,
    nextEvent,
    activeEvents,
    upcomingEvents,
    countdown,
    countdownInfo
  };
};