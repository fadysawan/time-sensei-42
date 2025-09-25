import { useState, useEffect } from 'react';
import { TradingParameters, TradingStatus, TimeBlock } from '../models';
import { getTradingStatus, generateTimeBlocks } from '../utils/tradingLogic';
import { getUTCTime, getTimeInTimezone, convertUTCToUserTimezone, formatTimeSmart, formatDateForDisplay } from '../utils/timeUtils';
import { NewsTemplate, NewsInstance } from '../models';
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

interface UseTradeTimeReturn {
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
  tradingStatus: TradingStatus;
  currentPeriod: string;
  nextEvent: string;
  activeEvents: ActiveEvent[]; // Changed to array
  upcomingEvents: UpcomingEvent[]; // Changed to array
  countdown: number; // seconds until next significant event
}

export const useTradeTime = (parameters: TradingParameters, config: UserConfiguration): UseTradeTimeReturn => {
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
  const [tradingStatus, setTradingStatus] = useState<TradingStatus>('red');
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [nextEvent, setNextEvent] = useState('');
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const updateTime = () => {
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
        
        if (currentTimeSeconds >= startTimeSeconds && currentTimeSeconds < endTimeSeconds) {
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
      
      // Set dates for each timezone
      setCurrentDate(formatDateForDisplay(parameters.userTimezone));
      setUtcDate(formatDateForDisplay('UTC'));
      setNewYorkDate(formatDateForDisplay('America/New_York'));
      setLondonDate(formatDateForDisplay('Europe/London'));
      setTokyoDate(formatDateForDisplay('Asia/Tokyo'));
    };

    // Update immediately
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [parameters, config.displayPreferences.showSeconds]);

  return {
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
    tradingStatus,
    currentPeriod,
    nextEvent,
    activeEvents,
    upcomingEvents,
    countdown
  };
};