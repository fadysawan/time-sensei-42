// Time Service - Single Responsibility: Handle all time-related calculations
import { TimeInfo } from '../models';

export class TimeService {
  static getBeirutTime(): TimeInfo {
    const now = new Date();
    const beirutTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Beirut"}));
    
    return {
      hours: beirutTime.getHours(),
      minutes: beirutTime.getMinutes(),
      seconds: beirutTime.getSeconds(),
      formatted: beirutTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
  }

  static getNewYorkTime(): TimeInfo {
    const now = new Date();
    const nyTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    return {
      hours: nyTime.getHours(),
      minutes: nyTime.getMinutes(),
      seconds: nyTime.getSeconds(),
      formatted: nyTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
  }

  static timeToMinutes(hours: number, minutes: number): number {
    return hours * 60 + minutes;
  }

  static minutesToTime(totalMinutes: number): { hours: number; minutes: number } {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }

  static getCurrentTimeInMinutes(): number {
    const beirutTime = this.getBeirutTime();
    return this.timeToMinutes(beirutTime.hours, beirutTime.minutes);
  }
}