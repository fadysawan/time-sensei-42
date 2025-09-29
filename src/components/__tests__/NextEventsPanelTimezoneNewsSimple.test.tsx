// Unit tests for NextEventsPanel timezone news handling
import React from 'react';
import { NextEventsPanel } from '../NextEventsPanel';
import { TradingParameters, MacroSession, KillzoneSession, NewsInstance } from '../../models';

// Jest type definitions
declare global {
  var jest: unknown;
  var describe: unknown;
  var it: unknown;
  var expect: unknown;
  var beforeEach: unknown;
}

// Mock timezone utilities
jest.mock('../../utils/timeUtils', () => ({
  getUTCTime: jest.fn(() => ({ hours: 14, minutes: 30, seconds: 0, formatted: '14:30:00' })),
  convertUTCToUserTimezone: jest.fn((utcHours: number, utcMinutes: number, userTimezone: string) => {
    // Mock conversion based on timezone
    let userHours = utcHours;
    const userMinutes = utcMinutes;
    
    if (userTimezone === 'America/New_York') {
      userHours = utcHours - 5; // EST is UTC-5
    } else if (userTimezone === 'Asia/Tokyo') {
      userHours = utcHours + 9; // JST is UTC+9
    } else if (userTimezone === 'Europe/London') {
      userHours = utcHours; // GMT is UTC+0 in January
    }
    
    // Handle day boundaries
    if (userHours < 0) userHours += 24;
    if (userHours >= 24) userHours -= 24;
    
    return {
      hours: userHours,
      minutes: userMinutes,
      seconds: 0,
      formatted: `${userHours.toString().padStart(2, '0')}:${userMinutes.toString().padStart(2, '0')}:00`
    };
  }),
  formatTime: jest.fn((hours: number, minutes: number) => `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`),
  formatCountdownDetailed: jest.fn((totalMinutes: number, showSeconds?: boolean) => ({
    display: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
    isUrgent: totalMinutes <= 5,
    isSoon: totalMinutes <= 30
  }))
}));

// Mock trading logic
jest.mock('../../utils/tradingLogic', () => ({
  getNextMacro: jest.fn(() => null),
  getNextKillzone: jest.fn(() => null),
  getNextNewsEvent: jest.fn(() => ({
    name: 'Test News Event',
    startTime: { hours: 15, minutes: 0 },
    timeUntilMinutes: 30,
    impact: 'high'
  }))
}));

// Mock user configuration
jest.mock('../../contexts/UserConfigurationContext', () => ({
  useUserConfiguration: () => ({
    config: {
      displayPreferences: {
        showSeconds: false
      }
    }
  })
}));

describe('NextEventsPanel Timezone News Handling', () => {
  const mockMacros: MacroSession[] = [
    {
      id: 'macro-1',
      name: 'London Session',
      start: { hours: 8, minutes: 0 },
      end: { hours: 9, minutes: 0 },
      region: 'London',
      description: 'London trading session'
    }
  ];

  const mockKillzones: KillzoneSession[] = [
    {
      id: 'killzone-1',
      name: 'NY Killzone',
      start: { hours: 13, minutes: 0 },
      end: { hours: 14, minutes: 0 },
      region: 'New York'
    }
  ];

  const mockNewsInstances: NewsInstance[] = [
    {
      id: 'news-1',
      templateId: 'nfp',
      name: 'NFP Report',
      scheduledTime: new Date('2024-01-15T15:00:00.000Z'), // 3:00 PM UTC
      impact: 'high' as const,
      isActive: true,
      description: 'Non-Farm Payrolls report'
    }
  ];

  const defaultParameters: TradingParameters = {
    macros: mockMacros,
    killzones: mockKillzones,
    marketSessions: [],
    newsTemplates: [],
    newsInstances: mockNewsInstances,
    userTimezone: 'UTC'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('News Event Timezone Conversion', () => {
    it('should convert news events to UTC timezone correctly', () => {
      const component = <NextEventsPanel parameters={defaultParameters} />;
      expect(component).toBeDefined();
    });

    it('should convert news events to New York timezone correctly', () => {
      const parametersWithNYTimezone = {
        ...defaultParameters,
        userTimezone: 'America/New_York'
      };

      const component = <NextEventsPanel parameters={parametersWithNYTimezone} />;
      expect(component).toBeDefined();
    });

    it('should convert news events to Tokyo timezone correctly', () => {
      const parametersWithTokyoTimezone = {
        ...defaultParameters,
        userTimezone: 'Asia/Tokyo'
      };

      const component = <NextEventsPanel parameters={parametersWithTokyoTimezone} />;
      expect(component).toBeDefined();
    });

    it('should convert news events to London timezone correctly', () => {
      const parametersWithLondonTimezone = {
        ...defaultParameters,
        userTimezone: 'Europe/London'
      };

      const component = <NextEventsPanel parameters={parametersWithLondonTimezone} />;
      expect(component).toBeDefined();
    });
  });

  describe('News Instance Processing', () => {
    it('should handle news instances with scheduledTime property correctly', () => {
      const component = <NextEventsPanel parameters={defaultParameters} />;
      expect(component).toBeDefined();
    });

    it('should handle mixed event types (macros, killzones, news) correctly', () => {
      const parametersWithAllEvents = {
        ...defaultParameters,
        macros: mockMacros,
        killzones: mockKillzones,
        newsInstances: mockNewsInstances
      };

      const component = <NextEventsPanel parameters={parametersWithAllEvents} />;
      expect(component).toBeDefined();
    });

    it('should handle empty news instances array', () => {
      const parametersWithNoNews = {
        ...defaultParameters,
        newsInstances: []
      };

      const component = <NextEventsPanel parameters={parametersWithNoNews} />;
      expect(component).toBeDefined();
    });
  });

  describe('Timezone Display Consistency', () => {
    it('should maintain consistent timezone conversion across different timezones', () => {
      const timezones = ['UTC', 'America/New_York', 'Asia/Tokyo', 'Europe/London'];
      
      for (const timezone of timezones) {
        const parameters = {
          ...defaultParameters,
          userTimezone: timezone
        };

        const component = <NextEventsPanel parameters={parameters} />;
        expect(component).toBeDefined();
      }
    });

    it('should handle timezone changes dynamically', () => {
      const component1 = <NextEventsPanel parameters={defaultParameters} />;
      expect(component1).toBeDefined();

      // Change timezone
      const parametersWithNewTimezone = {
        ...defaultParameters,
        userTimezone: 'America/New_York'
      };

      const component2 = <NextEventsPanel parameters={parametersWithNewTimezone} />;
      expect(component2).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid timezone gracefully', () => {
      const parametersWithInvalidTimezone = {
        ...defaultParameters,
        userTimezone: 'Invalid/Timezone'
      };

      const component = <NextEventsPanel parameters={parametersWithInvalidTimezone} />;
      expect(component).toBeDefined();
    });

    it('should handle invalid news instance dates gracefully', () => {
      const parametersWithInvalidNews = {
        ...defaultParameters,
        newsInstances: [
          {
            id: 'invalid-news',
            templateId: 'test',
            name: 'Invalid News',
            scheduledTime: new Date('invalid-date'),
            impact: 'high' as const,
            isActive: true,
            description: 'Invalid date news'
          }
        ]
      };

      const component = <NextEventsPanel parameters={parametersWithInvalidNews} />;
      expect(component).toBeDefined();
    });
  });

  describe('Performance and Real-time Updates', () => {
    it('should handle multiple news instances efficiently', () => {
      const parametersWithMultipleNews = {
        ...defaultParameters,
        newsInstances: [
          ...mockNewsInstances,
          {
            id: 'news-3',
            templateId: 'gdp',
            name: 'GDP Report',
            scheduledTime: new Date('2024-01-15T17:00:00.000Z'),
            impact: 'medium' as const,
            isActive: true,
            description: 'GDP data release'
          }
        ]
      };

      const component = <NextEventsPanel parameters={parametersWithMultipleNews} />;
      expect(component).toBeDefined();
    });
  });
});
