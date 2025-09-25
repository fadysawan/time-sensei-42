import { formatCountdownDetailed } from '../timeUtils';

describe('formatCountdownDetailed Function', () => {
  describe('showSeconds configuration', () => {
    it('should show seconds when showSeconds is true and countdown is below 5 minutes', () => {
      const result = formatCountdownDetailed(3, true);
      expect(result.display).toBe('3m 0s');
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should not show seconds when showSeconds is false', () => {
      const result = formatCountdownDetailed(3, false);
      expect(result.display).toBe('3m');
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should not show seconds when showSeconds is true but countdown is above 5 minutes', () => {
      const result = formatCountdownDetailed(10, true);
      expect(result.display).toBe('0h 10m');
      expect(result.isUrgent).toBe(false);
      expect(result.isSoon).toBe(true);
    });

    it('should not show seconds when showSeconds is undefined', () => {
      const result = formatCountdownDetailed(3, undefined);
      expect(result.display).toBe('3m');
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });
  });

  describe('time formatting with seconds', () => {
    it('should format minutes and seconds correctly', () => {
      const result = formatCountdownDetailed(3.5, true); // 3.5 minutes = 3m 30s
      expect(result.display).toBe('3m 30s');
    });

    it('should format hours, minutes and seconds correctly', () => {
      const result = formatCountdownDetailed(65, true); // 65 minutes = 1h 5m 0s
      expect(result.display).toBe('1h 5m 0s');
    });

    it('should format only seconds when less than 1 minute', () => {
      const result = formatCountdownDetailed(0.5, true); // 0.5 minutes = 30s
      expect(result.display).toBe('30s');
    });

    it('should handle fractional minutes correctly', () => {
      const result = formatCountdownDetailed(2.25, true); // 2.25 minutes = 2m 15s
      expect(result.display).toBe('2m 15s');
    });
  });

  describe('time formatting without seconds', () => {
    it('should format minutes only when less than 1 hour', () => {
      const result = formatCountdownDetailed(30, false);
      expect(result.display).toBe('30m');
    });

    it('should format hours and minutes when 1 hour or more', () => {
      const result = formatCountdownDetailed(90, false);
      expect(result.display).toBe('1h 30m');
    });

    it('should format only hours when exact hour', () => {
      const result = formatCountdownDetailed(120, false);
      expect(result.display).toBe('2h 0m');
    });
  });

  describe('urgency and soon flags', () => {
    it('should mark as urgent when 5 minutes or less', () => {
      const result = formatCountdownDetailed(5, false);
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should mark as urgent when less than 5 minutes', () => {
      const result = formatCountdownDetailed(3, false);
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should not mark as urgent when more than 5 minutes', () => {
      const result = formatCountdownDetailed(10, false);
      expect(result.isUrgent).toBe(false);
      expect(result.isSoon).toBe(true);
    });

    it('should mark as soon when 30 minutes or less', () => {
      const result = formatCountdownDetailed(30, false);
      expect(result.isUrgent).toBe(false);
      expect(result.isSoon).toBe(true);
    });

    it('should not mark as soon when more than 30 minutes', () => {
      const result = formatCountdownDetailed(60, false);
      expect(result.isUrgent).toBe(false);
      expect(result.isSoon).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle zero minutes', () => {
      const result = formatCountdownDetailed(0, false);
      expect(result.display).toBe('Now');
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should handle zero minutes with seconds enabled', () => {
      const result = formatCountdownDetailed(0, true);
      expect(result.display).toBe('Now');
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should handle negative minutes', () => {
      const result = formatCountdownDetailed(-5, false);
      expect(result.display).toBe('Now');
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should handle very large minutes', () => {
      const result = formatCountdownDetailed(1440, false); // 24 hours
      expect(result.display).toBe('24h 0m');
      expect(result.isUrgent).toBe(false);
      expect(result.isSoon).toBe(false);
    });

    it('should handle fractional minutes correctly', () => {
      const result = formatCountdownDetailed(1.5, false);
      expect(result.display).toBe('1m');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical macro session countdown', () => {
      const result = formatCountdownDetailed(15, false);
      expect(result.display).toBe('15m');
      expect(result.isUrgent).toBe(false);
      expect(result.isSoon).toBe(true);
    });

    it('should handle urgent macro session countdown with seconds', () => {
      const result = formatCountdownDetailed(2, true);
      expect(result.display).toBe('2m 0s');
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should handle killzone session countdown', () => {
      const result = formatCountdownDetailed(45, false);
      expect(result.display).toBe('0h 45m');
      expect(result.isUrgent).toBe(false);
      expect(result.isSoon).toBe(false);
    });

    it('should handle news event countdown with seconds', () => {
      const result = formatCountdownDetailed(1.5, true);
      expect(result.display).toBe('1m 30s');
      expect(result.isUrgent).toBe(true);
      expect(result.isSoon).toBe(true);
    });

    it('should handle market session countdown', () => {
      const result = formatCountdownDetailed(120, false);
      expect(result.display).toBe('2h 0m');
      expect(result.isUrgent).toBe(false);
      expect(result.isSoon).toBe(false);
    });
  });

  describe('seconds conversion accuracy', () => {
    it('should convert 0.1 minutes to 6 seconds', () => {
      const result = formatCountdownDetailed(0.1, true);
      expect(result.display).toBe('6s');
    });

    it('should convert 0.5 minutes to 30 seconds', () => {
      const result = formatCountdownDetailed(0.5, true);
      expect(result.display).toBe('30s');
    });

    it('should convert 1.5 minutes to 1m 30s', () => {
      const result = formatCountdownDetailed(1.5, true);
      expect(result.display).toBe('1m 30s');
    });

    it('should convert 61.5 minutes to 1h 1m 30s', () => {
      const result = formatCountdownDetailed(61.5, true);
      expect(result.display).toBe('1h 1m 30s');
    });
  });
});
