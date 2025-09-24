// Trading Status Service - Single Responsibility: Handle trading status calculations
import { TradingStatus, TradingParameters } from '../models';
import { TimeService } from './TimeService';

export class TradingStatusService {
  static getTradingStatus(
    hours: number,
    minutes: number,
    parameters: TradingParameters
  ): {
    status: TradingStatus;
    period: string;
    nextEvent: string;
  } {
    const currentTimeMinutes = TimeService.timeToMinutes(hours, minutes);
    
    // Check if it's pre-market
    if (currentTimeMinutes < parameters.marketOpen && currentTimeMinutes >= parameters.preMarketStart) {
      return {
        status: 'yellow',
        period: 'Pre-Market Trading',
        nextEvent: 'Market Opens'
      };
    }
    
    // Check if it's lunch break
    if (currentTimeMinutes >= parameters.lunchStart && currentTimeMinutes < parameters.lunchEnd) {
      return {
        status: 'red',
        period: 'Lunch Break - Reduced Activity',
        nextEvent: 'Trading Resumes'
      };
    }
    
    // Check if it's main trading hours
    if (currentTimeMinutes >= parameters.marketOpen && currentTimeMinutes < parameters.marketClose) {
      if (currentTimeMinutes < parameters.lunchStart || currentTimeMinutes >= parameters.lunchEnd) {
        return {
          status: 'green',
          period: 'Active Trading Hours',
          nextEvent: currentTimeMinutes < parameters.lunchStart ? 'Lunch Break' : 'Market Close'
        };
      }
    }
    
    // Check if it's after hours
    if (currentTimeMinutes >= parameters.marketClose && currentTimeMinutes < parameters.afterHoursEnd) {
      return {
        status: 'yellow',
        period: 'After Hours Trading',
        nextEvent: 'Market Closes'
      };
    }
    
    // Market is closed
    return {
      status: 'red',
      period: 'Market Closed',
      nextEvent: 'Pre-Market Opens'
    };
  }

  static getNextTradingEvent(
    currentTimeMinutes: number,
    parameters: TradingParameters
  ): { eventName: string; timeUntil: number } {
    const events = [
      { name: 'Pre-Market Opens', time: parameters.preMarketStart },
      { name: 'Market Opens', time: parameters.marketOpen },
      { name: 'Lunch Break', time: parameters.lunchStart },
      { name: 'Trading Resumes', time: parameters.lunchEnd },
      { name: 'Market Closes', time: parameters.marketClose },
      { name: 'After Hours Ends', time: parameters.afterHoursEnd }
    ];

    for (const event of events) {
      if (currentTimeMinutes < event.time) {
        return {
          eventName: event.name,
          timeUntil: event.time - currentTimeMinutes
        };
      }
    }

    // Next event is tomorrow's pre-market
    return {
      eventName: 'Pre-Market Opens',
      timeUntil: (24 * 60) - currentTimeMinutes + parameters.preMarketStart
    };
  }
}