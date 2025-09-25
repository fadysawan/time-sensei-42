import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TradeTimeTracker } from '../TradeTimeTracker';
import { NextEventsPanel } from '../NextEventsPanel';
import { useUserConfiguration } from '../../contexts/UserConfigurationContext';
import { formatCountdownSmart, formatCountdownDetailed } from '../../utils/timeUtils';

// Mock the contexts
jest.mock('../../contexts/TradingStatusContext', () => ({
  useTradingStatus: jest.fn(() => ({
    currentTime: '10:30:00',
    tradingStatus: 'green',
    currentPeriod: 'Active Trading',
    nextEvent: 'Next Macro in 30 minutes',
    activeEvents: [],
    upcomingEvents: [
      {
        block: {
          type: 'macro',
          name: 'London Session',
          startHour: 8, // UTC time
          startMinute: 0,
          endHour: 9,
          endMinute: 0,
          description: 'High volatility period',
          probability: 'High'
        },
        timeUntilStart: 180 // 3 minutes in seconds
      }
    ],
    countdown: 180 // 3 minutes
  }))
}));

jest.mock('../../hooks/useTradingParameters', () => ({
  useTradingParameters: jest.fn(() => ({
    parameters: {
      macros: [],
      killzones: [],
      marketSessions: [],
      newsTemplates: [],
      newsInstances: [],
      userTimezone: 'Asia/Beirut' // User timezone
    }
  }))
}));

// Mock the time utilities
jest.mock('../../utils/timeUtils', () => ({
  formatCountdownSeconds: jest.fn((seconds) => ({
    display: `${Math.floor(seconds / 60)}m`,
    isUrgent: seconds < 300,
    isSoon: seconds < 1800
  })),
  formatCountdownSmart: jest.fn((hours, minutes, seconds, showSeconds, countdownMinutes) => {
    if (showSeconds && seconds !== undefined) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${hours}h ${minutes}m`;
  }),
  formatCountdownDetailed: jest.fn((minutes, showSeconds) => {
    if (showSeconds && minutes < 5) {
      const totalSeconds = Math.floor(minutes * 60);
      const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
      const displaySeconds = totalSeconds % 60;
      return {
        display: `${displayMinutes}m ${displaySeconds}s`,
        isUrgent: minutes <= 5,
        isSoon: minutes <= 30
      };
    }
    return {
      display: `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
      isUrgent: minutes <= 5,
      isSoon: minutes <= 30
    };
  }),
  getEventTypeStyles: jest.fn((type) => ({
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800'
  })),
  getStatusStyles: jest.fn((status) => ({
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700'
  })),
  convertUTCToUserTimezone: jest.fn((utcHours, utcMinutes, userTimezone) => {
    if (userTimezone === 'Asia/Beirut') {
      const userHours = (utcHours + 3) % 24;
      return {
        hours: userHours,
        minutes: utcMinutes,
        seconds: 0,
        formatted: `${userHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
      };
    }
    return {
      hours: utcHours,
      minutes: utcMinutes,
      seconds: 0,
      formatted: `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
    };
  })
}));

describe('Show Seconds Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show seconds in TradeTimeTracker when showSeconds is enabled', async () => {
    // Mock user configuration with showSeconds enabled
    jest.doMock('../../contexts/UserConfigurationContext', () => ({
      useUserConfiguration: jest.fn(() => ({
        config: {
          displayPreferences: {
            showSeconds: true
          }
        }
      }))
    }));

    render(<TradeTimeTracker />);

    await waitFor(() => {
      expect(formatCountdownSmart).toHaveBeenCalledWith(0, 3, 0, true, 3);
    });
  });

  it('should not show seconds in TradeTimeTracker when showSeconds is disabled', async () => {
    // Mock user configuration with showSeconds disabled
    jest.doMock('../../contexts/UserConfigurationContext', () => ({
      useUserConfiguration: jest.fn(() => ({
        config: {
          displayPreferences: {
            showSeconds: false
          }
        }
      }))
    }));

    render(<TradeTimeTracker />);

    await waitFor(() => {
      expect(formatCountdownSmart).toHaveBeenCalledWith(0, 3, 0, false, 3);
    });
  });

  it('should show seconds in NextEventsPanel when showSeconds is enabled and countdown is below 5 minutes', async () => {
    // Mock user configuration with showSeconds enabled
    jest.doMock('../../contexts/UserConfigurationContext', () => ({
      useUserConfiguration: jest.fn(() => ({
        config: {
          displayPreferences: {
            showSeconds: true
          }
        }
      }))
    }));

    const mockParameters = {
      macros: [],
      killzones: [],
      marketSessions: [],
      newsTemplates: [],
      newsInstances: [],
      userTimezone: 'Asia/Beirut'
    };

    render(<NextEventsPanel parameters={mockParameters} />);

    await waitFor(() => {
      expect(formatCountdownDetailed).toHaveBeenCalledWith(3, true);
    });
  });

  it('should not show seconds in NextEventsPanel when showSeconds is disabled', async () => {
    // Mock user configuration with showSeconds disabled
    jest.doMock('../../contexts/UserConfigurationContext', () => ({
      useUserConfiguration: jest.fn(() => ({
        config: {
          displayPreferences: {
            showSeconds: false
          }
        }
      }))
    }));

    const mockParameters = {
      macros: [],
      killzones: [],
      marketSessions: [],
      newsTemplates: [],
      newsInstances: [],
      userTimezone: 'Asia/Beirut'
    };

    render(<NextEventsPanel parameters={mockParameters} />);

    await waitFor(() => {
      expect(formatCountdownDetailed).toHaveBeenCalledWith(3, false);
    });
  });
});
