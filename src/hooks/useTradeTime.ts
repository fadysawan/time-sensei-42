import { useState, useEffect } from 'react';
import { TradingParameters, getTradingStatus, TradingStatus } from '../utils/tradingLogic';
import { getBeirutTime } from '../utils/timeUtils';

interface UseTradeTimeReturn {
  currentTime: string;
  tradingStatus: TradingStatus;
  currentPeriod: string;
  nextEvent: string;
}

export const useTradeTime = (parameters: TradingParameters): UseTradeTimeReturn => {
  const [currentTime, setCurrentTime] = useState('');
  const [tradingStatus, setTradingStatus] = useState<TradingStatus>('red');
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [nextEvent, setNextEvent] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const beirutTime = getBeirutTime();
      setCurrentTime(beirutTime.formatted);
      
      const status = getTradingStatus(
        beirutTime.hours,
        beirutTime.minutes,
        parameters
      );
      
      setTradingStatus(status.status);
      setCurrentPeriod(status.period);
      setNextEvent(status.nextEvent);
    };

    // Update immediately
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [parameters]);

  return {
    currentTime,
    tradingStatus,
    currentPeriod,
    nextEvent
  };
};