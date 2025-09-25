import { formatTimeSmart } from '../timeUtils';

describe('formatTimeSmart Function', () => {
  describe('showSeconds configuration', () => {
    it('should show seconds when showSeconds is true', () => {
      const result = formatTimeSmart(10, 30, 45, true, 10);
      expect(result).toBe('10:30:45');
    });

    it('should not show seconds when showSeconds is false', () => {
      const result = formatTimeSmart(10, 30, 45, false, 10);
      expect(result).toBe('10:30');
    });

    it('should show seconds when showSeconds is undefined (defaults to false)', () => {
      const result = formatTimeSmart(10, 30, 45, undefined, 10);
      expect(result).toBe('10:30');
    });

    it('should show seconds when countdown is below 5 minutes even if showSeconds is false', () => {
      const result = formatTimeSmart(10, 30, 45, false, 3);
      expect(result).toBe('10:30:45');
    });

    it('should show seconds when countdown is below 5 minutes and showSeconds is true', () => {
      const result = formatTimeSmart(10, 30, 45, true, 3);
      expect(result).toBe('10:30:45');
    });

    it('should not show seconds when countdown is above 5 minutes and showSeconds is false', () => {
      const result = formatTimeSmart(10, 30, 45, false, 10);
      expect(result).toBe('10:30');
    });

    it('should show seconds when countdown is above 5 minutes but showSeconds is true', () => {
      const result = formatTimeSmart(10, 30, 45, true, 10);
      expect(result).toBe('10:30:45');
    });
  });

  describe('seconds parameter handling', () => {
    it('should not show seconds when seconds parameter is undefined', () => {
      const result = formatTimeSmart(10, 30, undefined, true, 10);
      expect(result).toBe('10:30');
    });

    it('should not show seconds when seconds parameter is undefined even with low countdown', () => {
      const result = formatTimeSmart(10, 30, undefined, false, 3);
      expect(result).toBe('10:30');
    });

    it('should show seconds when seconds parameter is 0', () => {
      const result = formatTimeSmart(10, 30, 0, true, 10);
      expect(result).toBe('10:30:00');
    });

    it('should show seconds when seconds parameter is 59', () => {
      const result = formatTimeSmart(10, 30, 59, true, 10);
      expect(result).toBe('10:30:59');
    });
  });

  describe('time formatting', () => {
    it('should pad single digit hours and minutes with zeros', () => {
      const result = formatTimeSmart(1, 5, 30, true, 10);
      expect(result).toBe('01:05:30');
    });

    it('should pad single digit seconds with zeros', () => {
      const result = formatTimeSmart(10, 30, 5, true, 10);
      expect(result).toBe('10:30:05');
    });

    it('should handle midnight correctly', () => {
      const result = formatTimeSmart(0, 0, 0, true, 10);
      expect(result).toBe('00:00:00');
    });

    it('should handle end of day correctly', () => {
      const result = formatTimeSmart(23, 59, 59, true, 10);
      expect(result).toBe('23:59:59');
    });
  });

  describe('countdown minutes parameter', () => {
    it('should handle undefined countdown minutes', () => {
      const result = formatTimeSmart(10, 30, 45, false, undefined);
      expect(result).toBe('10:30');
    });

    it('should handle countdown minutes of 0', () => {
      const result = formatTimeSmart(10, 30, 45, false, 0);
      expect(result).toBe('10:30:45');
    });

    it('should handle countdown minutes of 4 (below 5)', () => {
      const result = formatTimeSmart(10, 30, 45, false, 4);
      expect(result).toBe('10:30:45');
    });

    it('should handle countdown minutes of 5 (at threshold)', () => {
      const result = formatTimeSmart(10, 30, 45, false, 5);
      expect(result).toBe('10:30');
    });

    it('should handle countdown minutes of 6 (above 5)', () => {
      const result = formatTimeSmart(10, 30, 45, false, 6);
      expect(result).toBe('10:30');
    });
  });

  describe('edge cases', () => {
    it('should handle negative countdown minutes', () => {
      const result = formatTimeSmart(10, 30, 45, false, -1);
      expect(result).toBe('10:30:45');
    });

    it('should handle very large countdown minutes', () => {
      const result = formatTimeSmart(10, 30, 45, false, 1000);
      expect(result).toBe('10:30');
    });

    it('should handle negative seconds', () => {
      const result = formatTimeSmart(10, 30, -1, true, 10);
      expect(result).toBe('10:30:-1');
    });

    it('should handle seconds greater than 59', () => {
      const result = formatTimeSmart(10, 30, 65, true, 10);
      expect(result).toBe('10:30:65');
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly for typical trading session start', () => {
      // 9:30 AM with 2 minutes countdown
      const result = formatTimeSmart(9, 30, 0, false, 2);
      expect(result).toBe('09:30:00');
    });

    it('should work correctly for typical trading session end', () => {
      // 4:00 PM with 10 minutes countdown
      const result = formatTimeSmart(16, 0, 0, false, 10);
      expect(result).toBe('16:00');
    });

    it('should work correctly for user with showSeconds enabled', () => {
      // Any time with showSeconds enabled
      const result = formatTimeSmart(14, 15, 30, true, 20);
      expect(result).toBe('14:15:30');
    });

    it('should work correctly for user with showSeconds disabled but urgent countdown', () => {
      // Urgent countdown (1 minute) should show seconds even if user disabled it
      const result = formatTimeSmart(15, 45, 15, false, 1);
      expect(result).toBe('15:45:15');
    });
  });
});
