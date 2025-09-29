// Unit tests for timezone news conversion utilities
import { 
  convertLocalDateTimeToUTC, 
  formatUTCDateForUserTimezone 
} from '../timeUtils';

describe('Timezone News Conversion Utilities', () => {
  describe('convertLocalDateTimeToUTC', () => {
    it('should convert UTC timezone input correctly', () => {
      const localDateTime = '2024-01-15T14:30';
      const userTimezone = 'UTC';
      
      const result = convertLocalDateTimeToUTC(localDateTime, userTimezone);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCHours()).toBe(14);
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should convert New York timezone to UTC correctly', () => {
      const localDateTime = '2024-01-15T09:30'; // 9:30 AM EST
      const userTimezone = 'America/New_York';
      
      const result = convertLocalDateTimeToUTC(localDateTime, userTimezone);
      
      expect(result).toBeInstanceOf(Date);
      // EST is UTC-5, so 9:30 AM EST = 2:30 PM UTC
      expect(result.getUTCHours()).toBe(14);
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should convert Tokyo timezone to UTC correctly', () => {
      const localDateTime = '2024-01-15T23:30'; // 11:30 PM JST
      const userTimezone = 'Asia/Tokyo';
      
      const result = convertLocalDateTimeToUTC(localDateTime, userTimezone);
      
      expect(result).toBeInstanceOf(Date);
      // JST is UTC+9, so 11:30 PM JST = 2:30 PM UTC
      expect(result.getUTCHours()).toBe(14);
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should convert London timezone to UTC correctly', () => {
      const localDateTime = '2024-01-15T15:30'; // 3:30 PM GMT
      const userTimezone = 'Europe/London';
      
      const result = convertLocalDateTimeToUTC(localDateTime, userTimezone);
      
      expect(result).toBeInstanceOf(Date);
      // GMT is UTC+0 in January, so 3:30 PM GMT = 3:30 PM UTC
      expect(result.getUTCHours()).toBe(15);
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should handle invalid datetime string gracefully', () => {
      const localDateTime = 'invalid-datetime';
      const userTimezone = 'UTC';
      
      const result = convertLocalDateTimeToUTC(localDateTime, userTimezone);
      
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result.getTime())).toBe(true);
    });

    it('should handle empty datetime string', () => {
      const localDateTime = '';
      const userTimezone = 'UTC';
      
      expect(() => {
        convertLocalDateTimeToUTC(localDateTime, userTimezone);
      }).toThrow('DateTime string is required');
    });
  });

  describe('formatUTCDateForUserTimezone', () => {
    it('should format UTC date for UTC timezone correctly', () => {
      const utcDate = new Date('2024-01-15T14:30:00.000Z');
      const userTimezone = 'UTC';
      
      const result = formatUTCDateForUserTimezone(utcDate, userTimezone);
      
      expect(result).toMatch(/Jan 15, 14:30/);
    });

    it('should format UTC date for New York timezone correctly', () => {
      const utcDate = new Date('2024-01-15T14:30:00.000Z'); // 2:30 PM UTC
      const userTimezone = 'America/New_York';
      
      const result = formatUTCDateForUserTimezone(utcDate, userTimezone);
      
      // EST is UTC-5, so 2:30 PM UTC = 9:30 AM EST
      expect(result).toMatch(/Jan 15, 09:30/);
    });

    it('should format UTC date for Tokyo timezone correctly', () => {
      const utcDate = new Date('2024-01-15T14:30:00.000Z'); // 2:30 PM UTC
      const userTimezone = 'Asia/Tokyo';
      
      const result = formatUTCDateForUserTimezone(utcDate, userTimezone);
      
      // JST is UTC+9, so 2:30 PM UTC = 11:30 PM JST (next day)
      expect(result).toMatch(/Jan 16, 23:30/);
    });

    it('should format UTC date for London timezone correctly', () => {
      const utcDate = new Date('2024-01-15T14:30:00.000Z'); // 2:30 PM UTC
      const userTimezone = 'Europe/London';
      
      const result = formatUTCDateForUserTimezone(utcDate, userTimezone);
      
      // GMT is UTC+0 in January, so 2:30 PM UTC = 2:30 PM GMT
      expect(result).toMatch(/Jan 15, 14:30/);
    });

    it('should handle invalid timezone gracefully', () => {
      const utcDate = new Date('2024-01-15T14:30:00.000Z');
      const userTimezone = 'Invalid/Timezone';
      
      const result = formatUTCDateForUserTimezone(utcDate, userTimezone);
      
      // Should fallback to UTC formatting
      expect(result).toMatch(/Jan 15, 14:30/);
    });

    it('should handle invalid date gracefully', () => {
      const utcDate = new Date('invalid-date');
      const userTimezone = 'UTC';
      
      const result = formatUTCDateForUserTimezone(utcDate, userTimezone);
      
      expect(result).toMatch(/Invalid Date/);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency between conversion and formatting', () => {
      const originalDateTime = '2024-01-15T14:30';
      const userTimezone = 'America/New_York';
      
      // Convert to UTC
      const utcDate = convertLocalDateTimeToUTC(originalDateTime, userTimezone);
      
      // Format back to user timezone
      const formatted = formatUTCDateForUserTimezone(utcDate, userTimezone);
      
      // Should show the original time in user timezone
      expect(formatted).toMatch(/Jan 15, 14:30/);
    });

    it('should handle cross-timezone consistency', () => {
      const originalDateTime = '2024-01-15T14:30';
      const timezone1 = 'America/New_York';
      const timezone2 = 'Asia/Tokyo';
      
      // Convert to UTC from timezone1
      const utcDate = convertLocalDateTimeToUTC(originalDateTime, timezone1);
      
      // Format for timezone2
      const formatted = formatUTCDateForUserTimezone(utcDate, timezone2);
      
      // Should show correct time difference (EST to JST is 14 hours)
      expect(formatted).toMatch(/Jan 16, 04:30/);
    });
  });
});
