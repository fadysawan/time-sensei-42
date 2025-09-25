/**
 * Unit tests for TradingParameters interface
 */
import { TradingParameters } from '../TradingParameters';
import { MacroSession } from '../MacroSession';
import { KillzoneSession } from '../KillzoneSession';
import { MarketSession } from '../MarketSession';
import { NewsTemplate, NewsInstance } from '../index';

describe('TradingParameters', () => {
  describe('interface structure', () => {
    it('should have all required properties', () => {
      const tradingParameters: TradingParameters = {
        macros: [],
        killzones: [],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      expect(Array.isArray(tradingParameters.macros)).toBe(true);
      expect(Array.isArray(tradingParameters.killzones)).toBe(true);
      expect(Array.isArray(tradingParameters.marketSessions)).toBe(true);
      expect(Array.isArray(tradingParameters.newsTemplates)).toBe(true);
      expect(Array.isArray(tradingParameters.newsInstances)).toBe(true);
      expect(typeof tradingParameters.userTimezone).toBe('string');
    });

    it('should accept empty arrays for all collections', () => {
      const emptyParameters: TradingParameters = {
        macros: [],
        killzones: [],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      expect(emptyParameters.macros).toHaveLength(0);
      expect(emptyParameters.killzones).toHaveLength(0);
      expect(emptyParameters.marketSessions).toHaveLength(0);
      expect(emptyParameters.newsTemplates).toHaveLength(0);
      expect(emptyParameters.newsInstances).toHaveLength(0);
    });
  });

  describe('macros property', () => {
    it('should accept array of MacroSession objects', () => {
      const macro: MacroSession = {
        id: 'test-macro',
        name: 'Test Macro',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        region: 'London',
        probability: 'High'
      };

      const tradingParameters: TradingParameters = {
        macros: [macro],
        killzones: [],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      expect(tradingParameters.macros).toHaveLength(1);
      expect(tradingParameters.macros[0]).toBe(macro);
      expect(tradingParameters.macros[0].id).toBe('test-macro');
    });

    it('should accept multiple macros', () => {
      const macro1: MacroSession = {
        id: 'macro-1',
        name: 'Macro 1',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        region: 'London',
        probability: 'High'
      };

      const macro2: MacroSession = {
        id: 'macro-2',
        name: 'Macro 2',
        start: { hours: 14, minutes: 0 },
        end: { hours: 15, minutes: 0 },
        region: 'New York',
        probability: 'Low'
      };

      const tradingParameters: TradingParameters = {
        macros: [macro1, macro2],
        killzones: [],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      expect(tradingParameters.macros).toHaveLength(2);
      expect(tradingParameters.macros[0].region).toBe('London');
      expect(tradingParameters.macros[1].region).toBe('New York');
    });
  });

  describe('killzones property', () => {
    it('should accept array of KillzoneSession objects', () => {
      const killzone: KillzoneSession = {
        id: 'test-killzone',
        name: 'Test Killzone',
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        region: 'London'
      };

      const tradingParameters: TradingParameters = {
        macros: [],
        killzones: [killzone],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      expect(tradingParameters.killzones).toHaveLength(1);
      expect(tradingParameters.killzones[0]).toBe(killzone);
      expect(tradingParameters.killzones[0].id).toBe('test-killzone');
    });
  });

  describe('marketSessions property', () => {
    it('should accept array of MarketSession objects', () => {
      const marketSession: MarketSession = {
        id: 'test-session',
        name: 'Test Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'market-open',
        isActive: true,
        probability: 'High'
      };

      const tradingParameters: TradingParameters = {
        macros: [],
        killzones: [],
        marketSessions: [marketSession],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      expect(tradingParameters.marketSessions).toHaveLength(1);
      expect(tradingParameters.marketSessions[0]).toBe(marketSession);
      expect(tradingParameters.marketSessions[0].id).toBe('test-session');
    });
  });

  describe('userTimezone property', () => {
    it('should accept valid timezone strings', () => {
      const validTimezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

      validTimezones.forEach(timezone => {
        const tradingParameters: TradingParameters = {
          macros: [],
          killzones: [],
          marketSessions: [],
          newsTemplates: [],
          newsInstances: [],
          userTimezone: timezone
        };

        expect(tradingParameters.userTimezone).toBe(timezone);
      });
    });

    it('should accept empty string timezone', () => {
      const tradingParameters: TradingParameters = {
        macros: [],
        killzones: [],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: ''
      };

      expect(tradingParameters.userTimezone).toBe('');
    });
  });

  describe('type safety', () => {
    it('should enforce correct types for all properties', () => {
      const tradingParameters: TradingParameters = {
        macros: [],
        killzones: [],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      // These should compile without errors
      const macros: MacroSession[] = tradingParameters.macros;
      const killzones: KillzoneSession[] = tradingParameters.killzones;
      const marketSessions: MarketSession[] = tradingParameters.marketSessions;
      const newsTemplates: NewsTemplate[] = tradingParameters.newsTemplates;
      const newsInstances: NewsInstance[] = tradingParameters.newsInstances;
      const userTimezone: string = tradingParameters.userTimezone;

      expect(Array.isArray(macros)).toBe(true);
      expect(Array.isArray(killzones)).toBe(true);
      expect(Array.isArray(marketSessions)).toBe(true);
      expect(Array.isArray(newsTemplates)).toBe(true);
      expect(Array.isArray(newsInstances)).toBe(true);
      expect(typeof userTimezone).toBe('string');
    });
  });

  describe('real-world examples', () => {
    it('should handle complete trading parameters', () => {
      const macro: MacroSession = {
        id: 'london-1',
        name: 'London Session 1',
        start: { hours: 7, minutes: 33 },
        end: { hours: 8, minutes: 0 },
        region: 'London',
        description: 'High volatility period during London market open',
        probability: 'High'
      };

      const killzone: KillzoneSession = {
        id: 'london-kz',
        name: 'London KZ',
        start: { hours: 4, minutes: 0 },
        end: { hours: 7, minutes: 0 },
        region: 'London'
      };

      const marketSession: MarketSession = {
        id: 'premarket',
        name: 'Pre-Market',
        start: { hours: 5, minutes: 0 },
        end: { hours: 7, minutes: 30 },
        type: 'premarket',
        isActive: true,
        description: 'Pre-market trading session with low liquidity',
        probability: 'Low'
      };

      const tradingParameters: TradingParameters = {
        macros: [macro],
        killzones: [killzone],
        marketSessions: [marketSession],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      expect(tradingParameters.macros).toHaveLength(1);
      expect(tradingParameters.killzones).toHaveLength(1);
      expect(tradingParameters.marketSessions).toHaveLength(1);
      expect(tradingParameters.macros[0].region).toBe('London');
      expect(tradingParameters.killzones[0].region).toBe('London');
      expect(tradingParameters.marketSessions[0].type).toBe('premarket');
    });
  });

  describe('edge cases', () => {
    it('should handle large arrays', () => {
      const largeMacroArray: MacroSession[] = Array.from({ length: 100 }, (_, i) => ({
        id: `macro-${i}`,
        name: `Macro ${i}`,
        start: { hours: 9, minutes: 0 },
        end: { hours: 10, minutes: 0 },
        region: 'London',
        probability: 'High'
      }));

      const tradingParameters: TradingParameters = {
        macros: largeMacroArray,
        killzones: [],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'UTC'
      };

      expect(tradingParameters.macros).toHaveLength(100);
      expect(tradingParameters.macros[0].id).toBe('macro-0');
      expect(tradingParameters.macros[99].id).toBe('macro-99');
    });

    it('should handle mixed content arrays', () => {
      const mixedMacros: MacroSession[] = [
        {
          id: 'london-macro',
          name: 'London Macro',
          start: { hours: 7, minutes: 33 },
          end: { hours: 8, minutes: 0 },
          region: 'London',
          probability: 'High'
        },
        {
          id: 'ny-macro',
          name: 'NY Macro',
          start: { hours: 13, minutes: 50 },
          end: { hours: 14, minutes: 10 },
          region: 'New York',
          description: 'New York session',
          probability: 'Low'
        }
      ];

      const tradingParameters: TradingParameters = {
        macros: mixedMacros,
        killzones: [],
        marketSessions: [],
        newsTemplates: [],
        newsInstances: [],
        userTimezone: 'America/New_York'
      };

      expect(tradingParameters.macros).toHaveLength(2);
      expect(tradingParameters.macros[0].description).toBeUndefined();
      expect(tradingParameters.macros[1].description).toBe('New York session');
    });
  });
});
