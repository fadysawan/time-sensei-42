import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { TradingParameters, TradingStatus, TimeBlock } from '../models';
import { getTradingStatus, generateTimeBlocks, isTimeInRange } from '../utils/tradingLogic';
import { getUTCTime, getTimeInTimezone, formatTimeSmart, formatDateForDisplay } from '../utils/timeUtils';
import { UserConfiguration } from '../types/userConfig';

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

interface TradingStatusContextType {
  tradingStatus: TradingStatus;
  currentPeriod: string;
  nextEvent: string;
  activeEvents: ActiveEvent[];
  upcomingEvents: UpcomingEvent[];
  countdown: number;
  currentTime: string;
  utcTime: string;
  newYorkTime: string;
  londonTime: string;
  tokyoTime: string;
  currentDate: string;
  utcDate: string;
  newYorkDate: string;
  londonDate: string;
  tokyoDate: string;
  refreshStatus: () => void;
}

const TradingStatusContext = createContext<TradingStatusContextType | undefined>(undefined);

interface TradingStatusProviderProps {
  children: ReactNode;
  parameters: TradingParameters;
  config: UserConfiguration;
}

export const TradingStatusProvider: React.FC<TradingStatusProviderProps> = ({ 
  children, 
  parameters, 
  config 
}) => {
  const parametersRef = useRef<string>('');
  
  // Check if parameters actually changed by deep comparison with timestamp
  const parametersString = JSON.stringify({
    killzones: parameters.killzones,
    macros: parameters.macros,
    marketSessions: parameters.marketSessions,
    newsTemplates: parameters.newsTemplates,
    newsInstances: parameters.newsInstances,
    userTimezone: parameters.userTimezone,
    // Add timestamp to force updates (if _timestamp exists in parameters)
    _timestamp: (parameters as TradingParameters & { _timestamp?: number })._timestamp || 0
  });
  
  console.log('🔍 TradingStatusProvider: checking parameters change', {
    currentString: parametersRef.current.substring(0, 100) + '...',
    newString: parametersString.substring(0, 100) + '...',
    isEqual: parametersRef.current === parametersString,
    timestamp: new Date().toISOString()
  });
  
  if (parametersRef.current !== parametersString) {
    console.log('🎯 TradingStatusProvider: PARAMETERS CHANGED!', {
      killzonesCount: parameters.killzones.length,
      killzones: parameters.killzones.map(k => ({ name: k.name, start: k.start, end: k.end })),
      timestamp: new Date().toISOString()
    });
    parametersRef.current = parametersString;
  }
  const [tradingStatus, setTradingStatus] = useState<TradingStatus>('red');
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [nextEvent, setNextEvent] = useState('');
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [newYorkTime, setNewYorkTime] = useState('');
  const [londonTime, setLondonTime] = useState('');
  const [tokyoTime, setTokyoTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [utcDate, setUtcDate] = useState('');
  const [newYorkDate, setNewYorkDate] = useState('');
  const [londonDate, setLondonDate] = useState('');
  const [tokyoDate, setTokyoDate] = useState('');

  // Complete update function with all logic - made stable with useCallback
  const updateTime = useCallback(() => {
    console.log('🔄 TradingStatusContext: updateTime called', {
      killzones: parameters.killzones.length,
      macros: parameters.macros.length,
      currentTime: new Date().toISOString()
    });
    
    // Get UTC time (internal reference)
    const utcTimeInfo = getUTCTime();
    
    // Get times in user's timezone and major trading centers
    const userTime = getTimeInTimezone(parameters.userTimezone);
    const nyTime = getTimeInTimezone('America/New_York');
    const londonTimeInfo = getTimeInTimezone('Europe/London');
    const tokyoTimeInfo = getTimeInTimezone('Asia/Tokyo');
    
    // Use UTC time for trading status calculations
    const status = getTradingStatus(
      utcTimeInfo.hours,
      utcTimeInfo.minutes,
      parameters
    );
    
    console.log('📈 TradingStatus calculation result:', {
      currentTime: `${utcTimeInfo.hours}:${utcTimeInfo.minutes.toString().padStart(2, '0')}`,
      currentTimeMinutes: utcTimeInfo.hours * 60 + utcTimeInfo.minutes,
      status: status.status,
      period: status.period,
      previousStatus: tradingStatus,
      killzonesCount: parameters.killzones.length,
      killzones: parameters.killzones.map(k => ({
        name: k.name,
        start: `${k.start.hours}:${k.start.minutes.toString().padStart(2, '0')}`,
        startMinutes: k.start.hours * 60 + k.start.minutes,
        end: `${k.end.hours}:${k.end.minutes.toString().padStart(2, '0')}`,
        endMinutes: k.end.hours * 60 + k.end.minutes,
        isCurrentlyInside: (() => {
          const currentTimeMinutes = utcTimeInfo.hours * 60 + utcTimeInfo.minutes;
          const startTimeMinutes = k.start.hours * 60 + k.start.minutes;
          const endTimeMinutes = k.end.hours * 60 + k.end.minutes;
          // Handle overnight ranges - using exclusive end time
          if (startTimeMinutes > endTimeMinutes) {
            return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes < endTimeMinutes;
          }
          return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes;
        })()
      }))
    });
    
    setTradingStatus(status.status);
    setCurrentPeriod(status.period);
    setNextEvent(status.nextEvent);

    // Calculate detailed event information using UTC
    const currentTimeMinutes = utcTimeInfo.hours * 60 + utcTimeInfo.minutes;
    const currentTimeSeconds = currentTimeMinutes * 60 + utcTimeInfo.seconds;
    const blocks = generateTimeBlocks(parameters);
    
    // Find all active events
    const foundActiveEvents: ActiveEvent[] = [];
    for (const block of blocks) {
      const startTimeSeconds = (block.startHour * 60 + block.startMinute) * 60;
      const endTimeSeconds = (block.endHour * 60 + block.endMinute) * 60;
      
      // Use isTimeInRange to properly handle overnight ranges
      if (isTimeInRange(currentTimeSeconds, startTimeSeconds, endTimeSeconds)) {
        // Calculate time left properly for overnight ranges
        let timeLeft = 0;
        if (startTimeSeconds > endTimeSeconds) {
          // Overnight range
          if (currentTimeSeconds >= startTimeSeconds) {
            // We're in the first part (e.g., 23:00-24:00)
            timeLeft = (24 * 60 * 60) - currentTimeSeconds + endTimeSeconds;
          } else {
            // We're in the second part (e.g., 00:00-06:00)
            timeLeft = endTimeSeconds - currentTimeSeconds;
          }
        } else {
          // Normal range
          timeLeft = endTimeSeconds - currentTimeSeconds;
        }
        
        foundActiveEvents.push({
          block,
          timeLeft,
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
        const endTimeSeconds = (block.endHour * 60 + block.endMinute) * 60;
        
        // Exclude events that are currently active
        const isCurrentlyActive = isTimeInRange(currentTimeSeconds, startTimeSeconds, endTimeSeconds);
        
        // Only include events that start in the future and are not currently active
        return startTimeSeconds > currentTimeSeconds && !isCurrentlyActive;
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
    let currentCountdown = 0;
    if (foundActiveEvents.length > 0) {
      // Use the event that ends soonest
      const soonestEndingEvent = foundActiveEvents.reduce((min, event) => 
        event.timeLeft < min.timeLeft ? event : min
      );
      currentCountdown = soonestEndingEvent.timeLeft;
      setCountdown(currentCountdown);
    } else if (foundUpcomingEvents.length > 0) {
      currentCountdown = foundUpcomingEvents[0].timeUntilStart;
      setCountdown(currentCountdown);
    } else {
      setCountdown(0);
    }
    
    // Calculate countdown in minutes for smart formatting
    const countdownMinutes = Math.floor(currentCountdown / 60);
    
    // Use smart formatting that shows seconds when countdown is below 5 minutes
    // Determine if we should show seconds
    const shouldShowSeconds = config.displayPreferences.showSeconds || (countdownMinutes < 5);
    
    setUtcTime(formatTimeSmart(
      utcTimeInfo.hours, 
      utcTimeInfo.minutes, 
      shouldShowSeconds ? utcTimeInfo.seconds : undefined, 
      config.displayPreferences.showSeconds,
      countdownMinutes
    ));
    setCurrentTime(formatTimeSmart(
      userTime.hours, 
      userTime.minutes, 
      shouldShowSeconds ? userTime.seconds : undefined, 
      config.displayPreferences.showSeconds,
      countdownMinutes
    ));
    setNewYorkTime(formatTimeSmart(
      nyTime.hours, 
      nyTime.minutes, 
      shouldShowSeconds ? nyTime.seconds : undefined, 
      config.displayPreferences.showSeconds,
      countdownMinutes
    ));
    setLondonTime(formatTimeSmart(
      londonTimeInfo.hours, 
      londonTimeInfo.minutes, 
      shouldShowSeconds ? londonTimeInfo.seconds : undefined, 
      config.displayPreferences.showSeconds,
      countdownMinutes
    ));
    setTokyoTime(formatTimeSmart(
      tokyoTimeInfo.hours, 
      tokyoTimeInfo.minutes, 
      shouldShowSeconds ? tokyoTimeInfo.seconds : undefined, 
      config.displayPreferences.showSeconds,
      countdownMinutes
    ));
    
    // Set dates
    setCurrentDate(formatDateForDisplay(parameters.userTimezone));
    setUtcDate(formatDateForDisplay('UTC'));
    setNewYorkDate(formatDateForDisplay('America/New_York'));
    setLondonDate(formatDateForDisplay('Europe/London'));
    setTokyoDate(formatDateForDisplay('Asia/Tokyo'));
  }, [parameters, config.displayPreferences.showSeconds, tradingStatus]);

  // Log when updateTime callback is recreated due to dependencies changing
  useEffect(() => {
    console.log('🆕 UPDATETIME CALLBACK RECREATED - PARAMETERS CHANGED!', {
      parametersRef: parameters,
      killzonesCount: parameters.killzones.length,
      timestamp: new Date().toISOString()
    });
  }, [parameters, config.displayPreferences.showSeconds]);

  // Function to refresh status immediately
  const refreshStatus = useCallback(() => {
    updateTime();
  }, [updateTime]);

  // Note: Event bus listener removed to prevent cascading updates
  // The context will automatically update when parameters change

  // Update status every second and when parameters change
  useEffect(() => {
    // Update immediately
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [updateTime]);

  const value: TradingStatusContextType = {
    tradingStatus,
    currentPeriod,
    nextEvent,
    activeEvents,
    upcomingEvents,
    countdown,
    currentTime,
    utcTime,
    newYorkTime,
    londonTime,
    tokyoTime,
    currentDate,
    utcDate,
    newYorkDate,
    londonDate,
    tokyoDate,
    refreshStatus,
  };

  return (
    <TradingStatusContext.Provider value={value}>
      {children}
    </TradingStatusContext.Provider>
  );
};

export const useTradingStatus = (): TradingStatusContextType => {
  const context = useContext(TradingStatusContext);
  if (context === undefined) {
    throw new Error('useTradingStatus must be used within a TradingStatusProvider');
  }
  return context;
};
