import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NextEventsPanel } from '../NextEventsPanel';
import { TradingParameters } from '../../models';

// Mock the trading logic functions
jest.mock('../../utils/tradingLogic', () => ({
  getNextMacro: jest.fn(() => ({
    name: 'London Session',
    startTime: { hours: 8, minutes: 0 }, // UTC time
    timeUntilMinutes: 30,
    region: 'London'
  })),
  getNextKillzone: jest.fn(() => null),
  getNextNewsEvent: jest.fn(() => null),
}));

// Mock the time utilities
jest.mock('../../utils/timeUtils', () => ({
  getBeirutTime: jest.fn(() => ({ hours: 10, minutes: 30, seconds: 0, formatted: '10:30:00' })),
  getUTCTime: jest.fn(() => ({ hours: 7, minutes: 30, seconds: 0, formatted: '07:30:00' })),
  formatCountdownDetailed: jest.fn((minutes) => ({
    display: `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
    isUrgent: minutes < 5,
    isSoon: minutes < 30
  })),
  formatTime: jest.fn((hours, minutes) => `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`),
  convertUTCToUserTimezone: jest.fn((utcHours, utcMinutes, userTimezone) => {
    // Mock conversion: add 3 hours for Beirut timezone
    if (userTimezone === 'Asia/Beirut') {
      const userHours = (utcHours + 3) % 24;
      return {
        hours: userHours,
        minutes: utcMinutes,
        seconds: 0,
        formatted: `${userHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
      };
    }
    // For other timezones, return as-is for simplicity
    return {
      hours: utcHours,
      minutes: utcMinutes,
      seconds: 0,
      formatted: `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
    };
  })
}));

// Mock UI components
jest.mock('../ui/collapsible', () => ({
  Collapsible: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible">{children}</div>,
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-content">{children}</div>,
  CollapsibleTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-trigger">{children}</div>,
}));

describe('NextEventsPanel Final Tests', () => {
  const mockParameters: TradingParameters = {
    macros: [],
    killzones: [],
    marketSessions: [],
    newsTemplates: [],
    newsInstances: [],
    userTimezone: 'Asia/Beirut'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should convert UTC event times to user timezone for display', async () => {
    render(<NextEventsPanel parameters={mockParameters} />);

    await waitFor(() => {
      // Verify that convertUTCToUserTimezone was called with the correct parameters
      const { convertUTCToUserTimezone } = require('../../utils/timeUtils');
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'Asia/Beirut');
    });

    await waitFor(() => {
      // Verify that formatTime was called with the converted time (11:00)
      const { formatTime } = require('../../utils/timeUtils');
      expect(formatTime).toHaveBeenCalledWith(11, 0);
    });
  });

  it('should handle different timezones correctly', async () => {
    const newYorkParameters = {
      ...mockParameters,
      userTimezone: 'America/New_York'
    };

    render(<NextEventsPanel parameters={newYorkParameters} />);

    await waitFor(() => {
      // Verify that convertUTCToUserTimezone was called with New York timezone
      const { convertUTCToUserTimezone } = require('../../utils/timeUtils');
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'America/New_York');
    });
  });

  it('should handle UTC timezone correctly', async () => {
    const utcParameters = {
      ...mockParameters,
      userTimezone: 'UTC'
    };

    render(<NextEventsPanel parameters={utcParameters} />);

    await waitFor(() => {
      // Verify that convertUTCToUserTimezone was called with UTC timezone
      const { convertUTCToUserTimezone } = require('../../utils/timeUtils');
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'UTC');
    });

    await waitFor(() => {
      // For UTC, the time should remain the same (8:00)
      const { formatTime } = require('../../utils/timeUtils');
      expect(formatTime).toHaveBeenCalledWith(8, 0);
    });
  });

  it('should update times when timezone changes', async () => {
    const { rerender } = render(<NextEventsPanel parameters={mockParameters} />);

    // Wait for initial render
    await waitFor(() => {
      const { convertUTCToUserTimezone } = require('../../utils/timeUtils');
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'Asia/Beirut');
    });

    // Change timezone
    const newParameters = {
      ...mockParameters,
      userTimezone: 'Europe/London'
    };

    rerender(<NextEventsPanel parameters={newParameters} />);

    await waitFor(() => {
      // Should be called with the new timezone
      const { convertUTCToUserTimezone } = require('../../utils/timeUtils');
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'Europe/London');
    });
  });

  it('should handle null events gracefully', () => {
    const { getNextMacro, getNextKillzone, getNextNewsEvent } = require('../../utils/tradingLogic');
    
    getNextMacro.mockReturnValue(null);
    getNextKillzone.mockReturnValue(null);
    getNextNewsEvent.mockReturnValue(null);

    render(<NextEventsPanel parameters={mockParameters} />);

    expect(screen.getByText('None today')).toBeInTheDocument();
  });

  it('should display event name and region correctly', async () => {
    render(<NextEventsPanel parameters={mockParameters} />);

    await waitFor(() => {
      expect(screen.getByText('London Session')).toBeInTheDocument();
    });
  });
});
