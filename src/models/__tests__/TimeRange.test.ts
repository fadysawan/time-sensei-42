/**
 * Unit tests for TimeRange interface
 */
import { TimeRange } from '../TimeRange';

describe('TimeRange', () => {
  describe('interface structure', () => {
    it('should have required hours and minutes properties', () => {
      const timeRange: TimeRange = {
        hours: 9,
        minutes: 30
      };

      expect(timeRange.hours).toBe(9);
      expect(timeRange.minutes).toBe(30);
    });

    it('should accept valid hour values (0-23)', () => {
      const validHours = [0, 12, 23];
      
      validHours.forEach(hour => {
        const timeRange: TimeRange = {
          hours: hour,
          minutes: 0
        };
        expect(timeRange.hours).toBe(hour);
      });
    });

    it('should accept valid minute values (0-59)', () => {
      const validMinutes = [0, 30, 59];
      
      validMinutes.forEach(minute => {
        const timeRange: TimeRange = {
          hours: 12,
          minutes: minute
        };
        expect(timeRange.minutes).toBe(minute);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle midnight (0:00)', () => {
      const midnight: TimeRange = {
        hours: 0,
        minutes: 0
      };

      expect(midnight.hours).toBe(0);
      expect(midnight.minutes).toBe(0);
    });

    it('should handle end of day (23:59)', () => {
      const endOfDay: TimeRange = {
        hours: 23,
        minutes: 59
      };

      expect(endOfDay.hours).toBe(23);
      expect(endOfDay.minutes).toBe(59);
    });

    it('should handle noon (12:00)', () => {
      const noon: TimeRange = {
        hours: 12,
        minutes: 0
      };

      expect(noon.hours).toBe(12);
      expect(noon.minutes).toBe(0);
    });
  });

  describe('type safety', () => {
    it('should enforce number types for hours and minutes', () => {
      // This test ensures TypeScript type checking works
      const timeRange: TimeRange = {
        hours: 9,
        minutes: 30
      };

      // These should compile without errors
      const hours: number = timeRange.hours;
      const minutes: number = timeRange.minutes;

      expect(typeof hours).toBe('number');
      expect(typeof minutes).toBe('number');
    });
  });
});
