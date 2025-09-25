/**
 * Unit tests for MacroSession interface
 */
import { MacroSession } from '../MacroSession';
import { TimeRange } from '../TimeRange';

describe('MacroSession', () => {
  describe('interface structure', () => {
    it('should have all required properties', () => {
      const macroSession: MacroSession = {
        id: 'test-macro-1',
        name: 'Test Macro',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 30 },
        region: 'London',
        probability: 'High'
      };

      expect(macroSession.id).toBe('test-macro-1');
      expect(macroSession.name).toBe('Test Macro');
      expect(macroSession.start).toEqual({ hours: 9, minutes: 0 });
      expect(macroSession.end).toEqual({ hours: 10, minutes: 30 });
      expect(macroSession.region).toBe('London');
      expect(macroSession.probability).toBe('High');
    });

    it('should allow optional probability', () => {
      const macroSession: MacroSession = {
        id: 'test-macro-2',
        name: 'Test Macro Without Probability',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 30 },
        region: 'Tokyo'
        // probability is optional and not provided
      };

      expect(macroSession.id).toBe('test-macro-2');
      expect(macroSession.name).toBe('Test Macro Without Probability');
      expect(macroSession.probability).toBeUndefined();
    });

    it('should accept all valid regions', () => {
      const validRegions: MacroSession['region'][] = ['Tokyo', 'London', 'New York'];

      validRegions.forEach(region => {
        const macroSession: MacroSession = {
          id: 'test-macro',
          name: 'Test Macro',
          start: { hours: 9, minutes: 0 },
          end: { hours: 10, minutes: 0 },
          region,
          probability: 'High'
        };
        expect(macroSession.region).toBe(region);
      });
    });

    it('should accept all valid probability values', () => {
      const validProbabilities: MacroSession['probability'][] = ['High', 'Low'];

      validProbabilities.forEach(probability => {
        const macroSession: MacroSession = {
          id: 'test-macro',
          name: 'Test Macro',
          start: { hours: 9, minutes: 0 },
          end: { hours: 10, minutes: 0 },
          region: 'London',
          probability
        };
        expect(macroSession.probability).toBe(probability);
      });
    });
  });

  describe('optional properties', () => {
    it('should accept optional description', () => {
      const macroSession: MacroSession = {
        id: 'test-macro',
        name: 'Test Macro',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        region: 'London',
        description: 'This is a test macro description',
        probability: 'High'
      };

      expect(macroSession.description).toBe('This is a test macro description');
    });

    it('should work without optional description', () => {
      const macroSession: MacroSession = {
        id: 'test-macro',
        name: 'Test Macro',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        region: 'London',
        probability: 'High'
      };

      expect(macroSession.description).toBeUndefined();
    });
  });

  describe('TimeRange integration', () => {
    it('should properly integrate with TimeRange interface', () => {
      const startTime: TimeRange = { hours: 9, minutes: 0 };
      const endTime: TimeRange = { hours: 10, minutes: 30 };

      const macroSession: MacroSession = {
        id: 'test-macro',
        name: 'Test Macro',
        start: startTime,
        end: endTime,
        region: 'London',
        probability: 'High'
      };

      expect(macroSession.start).toBe(startTime);
      expect(macroSession.end).toBe(endTime);
      expect(macroSession.start.hours).toBe(9);
      expect(macroSession.start.minutes).toBe(0);
      expect(macroSession.end.hours).toBe(10);
      expect(macroSession.end.minutes).toBe(30);
    });
  });

  describe('edge cases', () => {
    it('should handle overnight macro sessions', () => {
      const overnightMacro: MacroSession = {
        id: 'overnight-macro',
        name: 'Overnight Macro',
        start: { hours: 23, minutes: 30 },
        end: { hours: 1, minutes: 30 },
        region: 'New York',
        probability: 'Low'
      };

      expect(overnightMacro.start.hours).toBe(23);
      expect(overnightMacro.end.hours).toBe(1);
    });

    it('should handle same hour start and end', () => {
      const sameHourMacro: MacroSession = {
        id: 'same-hour-macro',
        name: 'Same Hour Macro',
        start: { hours: 9, minutes: 0 },
        end: { hours: 9, minutes: 30 },
        region: 'Tokyo',
        probability: 'High'
      };

      expect(sameHourMacro.start.hours).toBe(sameHourMacro.end.hours);
      expect(sameHourMacro.start.minutes).toBe(0);
      expect(sameHourMacro.end.minutes).toBe(30);
    });

    it('should handle empty string id and name', () => {
      const emptyMacro: MacroSession = {
        id: '',
        name: '',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        region: 'London',
        probability: 'High'
      };

      expect(emptyMacro.id).toBe('');
      expect(emptyMacro.name).toBe('');
    });
  });

  describe('type safety', () => {
    it('should enforce correct types for all properties', () => {
      const macroSession: MacroSession = {
        id: 'test-macro',
        name: 'Test Macro',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        region: 'London',
        description: 'Test description',
        probability: 'High'
      };

      // These should compile without errors
      const id: string = macroSession.id;
      const name: string = macroSession.name;
      const start: TimeRange = macroSession.start;
      const end: TimeRange = macroSession.end;
      const region: MacroSession['region'] = macroSession.region;
      const description: string | undefined = macroSession.description;
      const probability: MacroSession['probability'] = macroSession.probability;

      expect(typeof id).toBe('string');
      expect(typeof name).toBe('string');
      expect(typeof start).toBe('object');
      expect(typeof end).toBe('object');
      expect(typeof region).toBe('string');
      expect(typeof description).toBe('string');
      expect(typeof probability).toBe('string');
    });
  });

  describe('real-world examples', () => {
    it('should handle London session macro', () => {
      const londonMacro: MacroSession = {
        id: 'london-1',
        name: 'London Session 1',
        start: { hours: 7, minutes: 33 },
        end: { hours: 8, minutes: 0 },
        region: 'London',
        description: 'High volatility period during London market open',
        probability: 'High'
      };

      expect(londonMacro.region).toBe('London');
      expect(londonMacro.probability).toBe('High');
      expect(londonMacro.description).toContain('volatility');
    });

    it('should handle New York session macro', () => {
      const nyMacro: MacroSession = {
        id: 'ny-am-1',
        name: 'NY AM 1',
        start: { hours: 13, minutes: 50 },
        end: { hours: 14, minutes: 10 },
        region: 'New York',
        description: 'Pre-market New York session with high probability moves',
        probability: 'High'
      };

      expect(nyMacro.region).toBe('New York');
      expect(nyMacro.probability).toBe('High');
      expect(nyMacro.description).toContain('New York');
    });

    it('should handle Tokyo session macro', () => {
      const tokyoMacro: MacroSession = {
        id: 'tokyo-1',
        name: 'Tokyo Session',
        start: { hours: 0, minutes: 0 },
        end: { hours: 1, minutes: 0 },
        region: 'Tokyo',
        probability: 'Low'
      };

      expect(tokyoMacro.region).toBe('Tokyo');
      expect(tokyoMacro.probability).toBe('Low');
    });
  });
});
