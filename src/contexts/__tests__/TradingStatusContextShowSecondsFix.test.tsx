import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { TradingStatusProvider, useTradingStatus } from '../TradingStatusContext';
import { TradingParameters } from '../../models';
import { UserConfiguration } from '../../types/userConfig';
import { formatTimeSmart } from '../../utils/timeUtils';

// Mock the trading logic functions
jest.mock('../../utils/tradingLogic', () => ({
  getTradingStatus: jest.fn(() => ({
    status: 'green',
    period: 'London Session',
    nextEvent: 'Next Macro in 30 minutes'
  })),
  generateTimeBlocks: jest.fn(() => []),
  isTimeInRange: jest.fn(() => false),
}));

// Mock time utilities
jest.mock('../../utils/timeUtils', () => ({
  getUTCTime: jest.fn(() => ({ hours: 10, minutes: 30, seconds: 45, formatted: '10:30:45' })),
  getTimeInTimezone: jest.fn((timezone: string) => {
    if (timezone === 'Asia/Beirut') return { hours: 13, minutes: 30, seconds: 45, formatted: '13:30:45' };
    if (timezone === 'America/New_York') return { hours: 6, minutes: 30, seconds: 45, formatted: '06:30:45' };
    if (timezone === 'Europe/London') return { hours: 10, minutes: 30, seconds: 45, formatted: '10:30:45' };
    if (timezone === 'Asia/Tokyo') return { hours: 19, minutes: 30, seconds: 45, formatted: '19:30:45' };
    return { hours: 10, minutes: 30, seconds: 45, formatted: '10:30:45' };
  }),
  formatTimeSmart: jest.fn((hours, minutes, seconds, showSeconds, countdownMinutes) => {
    if (showSeconds && seconds !== undefined) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }),
  formatDateForDisplay: jest.fn((timezone: string) => {
    if (timezone === 'Asia/Beirut') return '2025-09-25 (Beirut)';
    return '2025-09-25 (UTC)';
  }),
}));

const mockParameters: TradingParameters = {
  macros: [], killzones: [], marketSessions: [], newsTemplates: [], newsInstances: [], userTimezone: 'Asia/Beirut'
};

const mockConfigWithSeconds: UserConfiguration = {
  timezone: 'Asia/Beirut',
  displayPreferences: { showSeconds: true, enableNotifications: false, enableSound: false }
};

const mockConfigWithoutSeconds: UserConfiguration = {
  timezone: 'Asia/Beirut',
  displayPreferences: { showSeconds: false, enableNotifications: false, enableSound: false }
};

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

describe('TradingStatusContext ShowSeconds Fix', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass shouldShowSeconds (not config.showSeconds) to formatTimeSmart when showSeconds is enabled', async () => {
    render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Verify that formatTimeSmart was called with shouldShowSeconds=true (4th parameter)
      expect(formatTimeSmart).toHaveBeenCalledWith(13, 30, 45, true, expect.any(Number)); // Current time
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, 45, true, expect.any(Number)); // UTC time
      expect(formatTimeSmart).toHaveBeenCalledWith(6, 30, 45, true, expect.any(Number)); // New York time
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, 45, true, expect.any(Number)); // London time
      expect(formatTimeSmart).toHaveBeenCalledWith(19, 30, 45, true, expect.any(Number)); // Tokyo time
    });

    // Verify that all times display with seconds
    expect(screen.getByTestId('current-time')).toHaveTextContent('13:30:45');
    expect(screen.getByTestId('utc-time')).toHaveTextContent('10:30:45');
    expect(screen.getByTestId('new-york-time')).toHaveTextContent('06:30:45');
    expect(screen.getByTestId('london-time')).toHaveTextContent('10:30:45');
    expect(screen.getByTestId('tokyo-time')).toHaveTextContent('19:30:45');
  });

  it('should pass shouldShowSeconds (not config.showSeconds) to formatTimeSmart when showSeconds is disabled', async () => {
    render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithoutSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Verify that formatTimeSmart was called with shouldShowSeconds=false (4th parameter)
      expect(formatTimeSmart).toHaveBeenCalledWith(13, 30, undefined, false, expect.any(Number)); // Current time
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, undefined, false, expect.any(Number)); // UTC time
      expect(formatTimeSmart).toHaveBeenCalledWith(6, 30, undefined, false, expect.any(Number)); // New York time
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, undefined, false, expect.any(Number)); // London time
      expect(formatTimeSmart).toHaveBeenCalledWith(19, 30, undefined, false, expect.any(Number)); // Tokyo time
    });

    // Verify that all times display without seconds
    expect(screen.getByTestId('current-time')).toHaveTextContent('13:30');
    expect(screen.getByTestId('utc-time')).toHaveTextContent('10:30');
    expect(screen.getByTestId('new-york-time')).toHaveTextContent('06:30');
    expect(screen.getByTestId('london-time')).toHaveTextContent('10:30');
    expect(screen.getByTestId('tokyo-time')).toHaveTextContent('19:30');
  });

  it('should show seconds when countdown is below 5 minutes even if showSeconds is disabled', async () => {
    // Mock countdown below 5 minutes to trigger automatic seconds display
    const { getTradingStatus } = jest.requireMock('../../utils/tradingLogic');
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
      // Even though showSeconds is false in config, it should show seconds due to low countdown
      // shouldShowSeconds should be true (countdown < 5 minutes)
      expect(formatTimeSmart).toHaveBeenCalledWith(13, 30, 45, true, expect.any(Number)); // Current time
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, 45, true, expect.any(Number)); // UTC time
      expect(formatTimeSmart).toHaveBeenCalledWith(6, 30, 45, true, expect.any(Number)); // New York time
      expect(formatTimeSmart).toHaveBeenCalledWith(10, 30, 45, true, expect.any(Number)); // London time
      expect(formatTimeSmart).toHaveBeenCalledWith(19, 30, 45, true, expect.any(Number)); // Tokyo time
    });

    // Verify that all times display with seconds due to low countdown
    expect(screen.getByTestId('current-time')).toHaveTextContent('13:30:45');
    expect(screen.getByTestId('utc-time')).toHaveTextContent('10:30:45');
    expect(screen.getByTestId('new-york-time')).toHaveTextContent('06:30:45');
    expect(screen.getByTestId('london-time')).toHaveTextContent('10:30:45');
    expect(screen.getByTestId('tokyo-time')).toHaveTextContent('19:30:45');
  });

  it('should update time displays when showSeconds configuration changes', async () => {
    const { rerender } = render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithoutSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-time')).toHaveTextContent('13:30');
    });

    rerender(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-time')).toHaveTextContent('13:30:45');
      // Verify that formatTimeSmart was called with shouldShowSeconds=true
      expect(formatTimeSmart).toHaveBeenCalledWith(
        13, 30, 45, true, expect.any(Number)
      );
    });
  });

  it('should handle the fix correctly - formatTimeSmart receives shouldShowSeconds not config.showSeconds', async () => {
    // This test specifically verifies the fix: formatTimeSmart should receive
    // the calculated shouldShowSeconds value, not the raw config.showSeconds value
    
    render(
      <TradingStatusProvider parameters={mockParameters} config={mockConfigWithSeconds}>
        <TestComponent />
      </TradingStatusProvider>
    );

    await waitFor(() => {
      // Get all calls to formatTimeSmart
      const formatTimeSmartCalls = (formatTimeSmart as jest.Mock).mock.calls;
      
      // Verify that all calls have the 4th parameter as true (shouldShowSeconds)
      // and not the raw config value
      formatTimeSmartCalls.forEach(call => {
        const [, , , shouldShowSeconds, countdownMinutes] = call;
        expect(shouldShowSeconds).toBe(true); // shouldShowSeconds should be true
        expect(typeof countdownMinutes).toBe('number'); // countdownMinutes should be a number
      });
    });
  });
});
