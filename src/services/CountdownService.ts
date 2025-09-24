// Countdown Service - Single Responsibility: Handle countdown calculations and formatting
import { CountdownInfo } from '../models';

export class CountdownService {
  static formatCountdownSeconds(totalSeconds: number): CountdownInfo {
    if (totalSeconds <= 0) {
      return { display: 'Now', isUrgent: true, isSoon: true };
    }
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let display = '';
    
    if (hours > 0) {
      display = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      display = `${minutes}m ${seconds}s`;
    } else {
      display = `${seconds}s`;
    }
    
    return {
      display,
      isUrgent: totalSeconds <= 900,  // Less than 15 minutes
      isSoon: totalSeconds <= 3600    // Less than 1 hour
    };
  }

  static formatCountdownMinutes(totalMinutes: number): CountdownInfo {
    if (totalMinutes <= 0) {
      return { display: 'Now', isUrgent: true, isSoon: true };
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    let display = '';
    if (hours > 0) {
      display = `${hours}h ${minutes}m`;
    } else {
      display = `${minutes}m`;
    }
    
    return {
      display,
      isUrgent: totalMinutes <= 15,   // Less than 15 minutes
      isSoon: totalMinutes <= 60      // Less than 1 hour
    };
  }

  static calculateTimeUntilEvent(eventStartHour: number, eventStartMinute: number): number {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    const currentTotalSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;
    const eventTotalSeconds = eventStartHour * 3600 + eventStartMinute * 60;

    let secondsUntil = eventTotalSeconds - currentTotalSeconds;

    // If event is tomorrow
    if (secondsUntil < 0) {
      secondsUntil += 24 * 3600; // Add 24 hours in seconds
    }

    return secondsUntil;
  }

  static calculateTimeLeft(eventEndHour: number, eventEndMinute: number): number {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    const currentTotalSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;
    const eventEndSeconds = eventEndHour * 3600 + eventEndMinute * 60;

    return eventEndSeconds - currentTotalSeconds;
  }
}