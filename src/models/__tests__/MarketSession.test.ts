/**
 * Unit tests for MarketSession interface
 */
import { MarketSession } from '../MarketSession';
import { TimeRange } from '../TimeRange';

describe('MarketSession', () => {
  describe('interface structure', () => {
    it('should have all required properties', () => {
      const marketSession: MarketSession = {
        id: 'test-session-1',
        name: 'Test Market Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'market-open',
        isActive: true,
        probability: 'High'
      };

      expect(marketSession.id).toBe('test-session-1');
      expect(marketSession.name).toBe('Test Market Session');
      expect(marketSession.start).toEqual({ hours: 9, minutes: 0 });
      expect(marketSession.end).toEqual({ hours: 17, minutes: 0 });
      expect(marketSession.type).toBe('market-open');
      expect(marketSession.isActive).toBe(true);
      expect(marketSession.probability).toBe('High');
    });

    it('should allow optional probability', () => {
      const marketSession: MarketSession = {
        id: 'test-session-2',
        name: 'Test Market Session Without Probability',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'custom',
        isActive: true
        // probability is optional and not provided
      };

      expect(marketSession.id).toBe('test-session-2');
      expect(marketSession.name).toBe('Test Market Session Without Probability');
      expect(marketSession.probability).toBeUndefined();
    });

    it('should accept all valid session types', () => {
      const validTypes: MarketSession['type'][] = [
        'premarket', 'market-open', 'lunch', 'after-hours', 'custom'
      ];

      validTypes.forEach(type => {
        const marketSession: MarketSession = {
          id: 'test-session',
          name: 'Test Session',
          start: { hours: 9, minutes: 0 },
          end: { hours: 10, minutes: 0 },
          type,
          isActive: true,
          probability: 'High'
        };
        expect(marketSession.type).toBe(type);
      });
    });

    it('should accept boolean isActive values', () => {
      const activeSession: MarketSession = {
        id: 'active-session',
        name: 'Active Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        type: 'market-open',
        isActive: true,
        probability: 'High'
      };

      const inactiveSession: MarketSession = {
        id: 'inactive-session',
        name: 'Inactive Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        type: 'market-open',
        isActive: false,
        probability: 'Low'
      };

      expect(activeSession.isActive).toBe(true);
      expect(inactiveSession.isActive).toBe(false);
    });

    it('should accept all valid probability values', () => {
      const validProbabilities: MarketSession['probability'][] = ['High', 'Low'];

      validProbabilities.forEach(probability => {
        const marketSession: MarketSession = {
          id: 'test-session',
          name: 'Test Session',
          start: { hours: 9, minutes: 0 },
          end: { hours: 10, minutes: 0 },
          type: 'market-open',
          isActive: true,
          probability
        };
        expect(marketSession.probability).toBe(probability);
      });
    });
  });

  describe('optional properties', () => {
    it('should accept optional description', () => {
      const marketSession: MarketSession = {
        id: 'test-session',
        name: 'Test Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        type: 'market-open',
        isActive: true,
        description: 'This is a test market session description',
        probability: 'High'
      };

      expect(marketSession.description).toBe('This is a test market session description');
    });

    it('should work without optional description', () => {
      const marketSession: MarketSession = {
        id: 'test-session',
        name: 'Test Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        type: 'market-open',
        isActive: true,
        probability: 'High'
      };

      expect(marketSession.description).toBeUndefined();
    });
  });

  describe('TimeRange integration', () => {
    it('should properly integrate with TimeRange interface', () => {
      const startTime: TimeRange = { hours: 9, minutes: 30 };
      const endTime: TimeRange = { hours: 16, minutes: 0 };

      const marketSession: MarketSession = {
        id: 'test-session',
        name: 'Test Session',
        start: startTime,
        end: endTime,
        type: 'market-open',
        isActive: true,
        probability: 'High'
      };

      expect(marketSession.start).toBe(startTime);
      expect(marketSession.end).toBe(endTime);
      expect(marketSession.start.hours).toBe(9);
      expect(marketSession.start.minutes).toBe(30);
      expect(marketSession.end.hours).toBe(16);
      expect(marketSession.end.minutes).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle overnight market sessions', () => {
      const overnightSession: MarketSession = {
        id: 'overnight-session',
        name: 'Overnight Session',
        start: { hours: 23, minutes: 0 },
        end: { hours: 1, minutes: 0 },
        type: 'after-hours',
        isActive: true,
        probability: 'Low'
      };

      expect(overnightSession.start.hours).toBe(23);
      expect(overnightSession.end.hours).toBe(1);
    });

    it('should handle same hour start and end', () => {
      const sameHourSession: MarketSession = {
        id: 'same-hour-session',
        name: 'Same Hour Session',
        start: { hours: 12, minutes: 0 },
        end: { hours: 12, minutes: 30 },
        type: 'lunch',
        isActive: true,
        probability: 'Low'
      };

      expect(sameHourSession.start.hours).toBe(sameHourSession.end.hours);
      expect(sameHourSession.start.minutes).toBe(0);
      expect(sameHourSession.end.minutes).toBe(30);
    });

    it('should handle empty string id and name', () => {
      const emptySession: MarketSession = {
        id: '',
        name: '',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        type: 'market-open',
        isActive: true,
        probability: 'High'
      };

      expect(emptySession.id).toBe('');
      expect(emptySession.name).toBe('');
    });
  });

  describe('type safety', () => {
    it('should enforce correct types for all properties', () => {
      const marketSession: MarketSession = {
        id: 'test-session',
        name: 'Test Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        type: 'market-open',
        isActive: true,
        description: 'Test description',
        probability: 'High'
      };

      // These should compile without errors
      const id: string = marketSession.id;
      const name: string = marketSession.name;
      const start: TimeRange = marketSession.start;
      const end: TimeRange = marketSession.end;
      const type: MarketSession['type'] = marketSession.type;
      const isActive: boolean = marketSession.isActive;
      const description: string | undefined = marketSession.description;
      const probability: MarketSession['probability'] = marketSession.probability;

      expect(typeof id).toBe('string');
      expect(typeof name).toBe('string');
      expect(typeof start).toBe('object');
      expect(typeof end).toBe('object');
      expect(typeof type).toBe('string');
      expect(typeof isActive).toBe('boolean');
      expect(typeof description).toBe('string');
      expect(typeof probability).toBe('string');
    });
  });

  describe('real-world examples', () => {
    it('should handle pre-market session', () => {
      const premarketSession: MarketSession = {
        id: 'premarket',
        name: 'Pre-Market',
        start: { hours: 5, minutes: 0 },
        end: { hours: 7, minutes: 30 },
        type: 'premarket',
        isActive: true,
        description: 'Pre-market trading session with low liquidity',
        probability: 'Low'
      };

      expect(premarketSession.type).toBe('premarket');
      expect(premarketSession.isActive).toBe(true);
      expect(premarketSession.probability).toBe('Low');
      expect(premarketSession.description).toContain('liquidity');
    });

    it('should handle lunch break session', () => {
      const lunchSession: MarketSession = {
        id: 'lunch',
        name: 'Lunch Break',
        start: { hours: 17, minutes: 0 },
        end: { hours: 18, minutes: 0 },
        type: 'lunch',
        isActive: true,
        description: 'Market lunch break with reduced activity',
        probability: 'Low'
      };

      expect(lunchSession.type).toBe('lunch');
      expect(lunchSession.isActive).toBe(true);
      expect(lunchSession.probability).toBe('Low');
      expect(lunchSession.description).toContain('break');
    });

    it('should handle custom session', () => {
      const customSession: MarketSession = {
        id: 'custom-test',
        name: 'Custom Trading Session',
        start: { hours: 8, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        type: 'custom',
        isActive: true,
        description: 'Custom trading session with high probability moves',
        probability: 'High'
      };

      expect(customSession.type).toBe('custom');
      expect(customSession.isActive).toBe(true);
      expect(customSession.probability).toBe('High');
      expect(customSession.description).toContain('Custom');
    });

    it('should handle after-hours session', () => {
      const afterHoursSession: MarketSession = {
        id: 'after-hours',
        name: 'After Hours',
        start: { hours: 20, minutes: 0 },
        end: { hours: 22, minutes: 0 },
        type: 'after-hours',
        isActive: false,
        description: 'After-hours trading session',
        probability: 'Low'
      };

      expect(afterHoursSession.type).toBe('after-hours');
      expect(afterHoursSession.isActive).toBe(false);
      expect(afterHoursSession.probability).toBe('Low');
    });
  });
});
