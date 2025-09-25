import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { TradingStatusProvider, useTradingStatus } from '../TradingStatusContext';
import { TradingParameters } from '../../models';
import { UserConfiguration } from '../../types/userConfig';

// Mock the trading logic functions
jest.mock('../../utils/tradingLogic', () => ({
  getTradingStatus: jest.fn(() => ({
    status: 'green',
    period: 'Active Trading',
    nextEvent: 'Next Macro in 30 minutes'
  })),
  generateTimeBlocks: jest.fn(() => [
    {
      type: 'macro',
      name: 'London Session',
      startHour: 8,
      startMinute: 0,
      endHour: 9,
      endMinute: 0,
      description: 'High volatility period',
      probability: 'High'
    }
  ]),
  isTimeInRange: jest.fn(() => false)
}));

// Mock the time utilities
jest.mock('../../utils/timeUtils', () => ({
  getUTCTime: jest.fn(() => ({
    hours: 10,
    minutes: 30,
    seconds: 45,
    formatted: '10:30:45'
  })),
  getTimeInTimezone: jest.fn((timezone) => {
    if (timezone === 'Asia/Beirut') {
      return { hours: 13, minutes: 30, seconds: 45, formatted: '13:30:45' };
    }
    if (timezone === 'America/New_York') {
      return { hours: 5, minutes: 30, seconds: 45, formatted: '05:30:45' };
    }
    if (timezone === 'Europe/London') {
      return { hours: 10, minutes: 30, seconds: 45, formatted: '10:30:45' };
    }
    if (timezone === 'Asia/Tokyo') {
      return { hours: 19, minutes: 30, seconds: 45, formatted: '19:30:45' };
    }
    return { hours: 10, minutes: 30, seconds: 45, formatted: '10:30:45' };
  }),
  formatTimeSmart: jest.fn((hours, minutes, seconds, showSeconds, countdownMinutes) => {
    if (showSeconds && seconds !== undefined) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }),
  formatDateForDisplay: jest.fn((timezone) => `2024-01-15 (${timezone})`)
}));

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { currentTime, utcTime, newYorkTime, londonTime, tokyoTime } = useTradingStatus();
  
  return (
    <div>
      <div data-testid="current-time">{currentTime}</div>
      <div data-testid="utc-time">{utcTime}</div>
      <div data-testid="new-york-time">{newYorkTime}</div>
      <div data-testid="london-time">{londonTime}</div>
      <div data-testid="tokyo-time">{tokyoTime}</div>
    </div>
  );
};

const mockParameters: TradingParameters = {
  macros: [],
  killzones: [],
  marketSessions: [],
  newsTemplates: [],
  newsInstances: [],
  userTimezone: 'Asia/Beirut'
};

const mockConfigWithSeconds: UserConfiguration = {
  timezone: 'Asia/Beirut',
  displayPreferences: {
    showSeconds: true,
    showCountdown: true,
    theme: 'system'
  },
  uiPreferences: {
    sidebarCollapsed: false,
    compactMode: false
  }
};

const mockConfigWithoutSeconds: UserConfiguration = {
  timezone: 'Asia/Beirut',
  displayPreferences: {
    showSeconds: false,
    showCountdown: true,
    theme: 'system'
  },
  uiPreferences: {
    sidebarCollapsed: false,
    compactMode: false
  }
};

describe('TradingStatusContext ShowSeconds Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show seconds in time displays when showSeconds is enabled', async () => {
    const { formatTimeSmart } = require('../../utils/timeUtils');
    
    render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Verify that formatTimeSmart was called with showSeconds: true
      expect(formatTimeSmart).toHaveBeenCalledWith(
        13, 30, 45, true, expect.any(Number)
      );
    });

    // Verify that seconds are included in the time format
    await waitFor(() => {
      expect(screen.getByTestId('current-time')).toHaveTextContent('13:30:45');
    });
  });

  it('should not show seconds in time displays when showSeconds is disabled', async () => {
    const { formatTimeSmart } = require('../../utils/timeUtils');
    
    render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithoutSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Verify that formatTimeSmart was called with showSeconds: false
      expect(formatTimeSmart).toHaveBeenCalledWith(
        13, 30, undefined, false, expect.any(Number)
      );
    });

    // Verify that seconds are not included in the time format
    await waitFor(() => {
      expect(screen.getByTestId('current-time')).toHaveTextContent('13:30');
    });
  });

  it('should update time displays when showSeconds configuration changes', async () => {
    const { formatTimeSmart } = require('../../utils/timeUtils');
    
    const { rerender } = render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithoutSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    // Initially should not show seconds
    await waitFor(() => {
      expect(formatTimeSmart).toHaveBeenCalledWith(
        13, 30, undefined, false, expect.any(Number)
      );
    });

    // Change configuration to show seconds
    rerender(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    // Should now show seconds
    await waitFor(() => {
      expect(formatTimeSmart).toHaveBeenCalledWith(
        13, 30, 45, true, expect.any(Number)
      );
    });
  });

  it('should show seconds for all timezone displays when enabled', async () => {
    const { formatTimeSmart } = require('../../utils/timeUtils');
    
    render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Verify that formatTimeSmart was called for all timezones with showSeconds: true
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, 45, true, expect.any(Number)); // UTC
      expect(formatTimeSmart).toHaveBeenCalledWith(13, 30, 45, true, expect.any(Number)); // Beirut
      expect(formatTimeSmart).toHaveBeenCalledWith(5, 30, 45, true, expect.any(Number));  // New York
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, 45, true, expect.any(Number)); // London
      expect(formatTimeSmart).toHaveBeenCalledWith(19, 30, 45, true, expect.any(Number)); // Tokyo
    });
  });

  it('should not show seconds for any timezone displays when disabled', async () => {
    const { formatTimeSmart } = require('../../utils/timeUtils');
    
    render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithoutSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Verify that formatTimeSmart was called for all timezones with showSeconds: false
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, undefined, false, expect.any(Number)); // UTC
      expect(formatTimeSmart).toHaveBeenCalledWith(13, 30, undefined, false, expect.any(Number)); // Beirut
      expect(formatTimeSmart).toHaveBeenCalledWith(5, 30, undefined, false, expect.any(Number));  // New York
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, undefined, false, expect.any(Number)); // London
      expect(formatTimeSmart).toHaveBeenCalledWith(19, 30, undefined, false, expect.any(Number)); // Tokyo
    });
  });

  it('should handle countdown-based seconds display correctly', async () => {
    const { formatTimeSmart } = require('../../utils/timeUtils');
    
    // Mock countdown below 5 minutes to trigger automatic seconds display
    const { getTradingStatus } = require('../../utils/tradingLogic');
    getTradingStatus.mockReturnValue({
      status: 'green',
      period: 'Active Trading',
      nextEvent: 'Next Macro in 2 minutes'
    });

    render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithoutSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Even with showSeconds: false, should show seconds when countdown < 5 minutes
      expect(formatTimeSmart).toHaveBeenCalledWith(
        13, 30, 45, false, expect.any(Number)
      );
    });
  });

  it('should update time displays when parameters change', async () => {
    const { formatTimeSmart } = require('../../utils/timeUtils');
    
    const { rerender } = render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    // Change parameters
    const newParameters = {
      ...mockParameters,
      userTimezone: 'America/New_York'
    };

    rerender(
      <TradingStatusProvider parameters={newParameters} config={mockConfigWithSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Should still show seconds with new timezone
      expect(formatTimeSmart).toHaveBeenCalledWith(
        5, 30, 45, true, expect.any(Number)
      );
    });
  });
});
