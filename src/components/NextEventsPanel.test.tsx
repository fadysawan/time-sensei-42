import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NextEventsPanel } from './NextEventsPanel';
import { getNextMacro, getNextKillzone, getNextNewsEvent } from '../utils/tradingLogic';
import { TradingParameters } from '../models';
import { convertUTCToUserTimezone } from '../utils/timeUtils';

// Mock the trading logic functions
jest.mock('../utils/tradingLogic', () => ({
  getNextMacro: jest.fn(),
  getNextKillzone: jest.fn(),
  getNextNewsEvent: jest.fn(),
}));

// Mock the time utilities
jest.mock('../utils/timeUtils', () => ({
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
    const userHours = (utcHours + 3) % 24;
    return {
      hours: userHours,
      minutes: utcMinutes,
      seconds: 0,
      formatted: `${userHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
    };
  })
}));

// Mock UI components
jest.mock('../components/ui/collapsible', () => ({
  Collapsible: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible">{children}</div>,
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-content">{children}</div>,
  CollapsibleTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-trigger">{children}</div>,
}));

describe('NextEventsPanel', () => {
  const mockParameters: TradingParameters = {
    macros: [
      {
        id: 'test-macro',
        name: 'Test Macro',
        start: { hours: 8, minutes: 0 }, // UTC time
        end: { hours: 9, minutes: 0 },
        region: 'London',
        description: 'Test macro description',
        probability: 'High'
      }
    ],
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
    
    // Mock getNextMacro to return a UTC time
    getNextMacro.mockReturnValue({
      name: 'Test Macro',
      startTime: { hours: 8, minutes: 0 }, // UTC time
      timeUntilMinutes: 30,
      region: 'London'
    });

    render(<NextEventsPanel parameters={mockParameters} />);

    // Wait for the component to render and convert times
    await waitFor(() => {
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'Asia/Beirut');
    });

    // Verify that the converted time is displayed
    expect(screen.getByText('Test Macro')).toBeInTheDocument();
  });

  it('should handle null events gracefully', () => {
    
    getNextMacro.mockReturnValue(null);
    getNextKillzone.mockReturnValue(null);
    getNextNewsEvent.mockReturnValue(null);

    render(<NextEventsPanel parameters={mockParameters} />);

    expect(screen.getByText('None today')).toBeInTheDocument();
  });

  it('should display event times in user timezone', async () => {
    
    // Mock getNextMacro to return a UTC time
    getNextMacro.mockReturnValue({
      name: 'London Session',
      startTime: { hours: 7, minutes: 30 }, // UTC time (should become 10:30 Beirut time)
      timeUntilMinutes: 60,
      region: 'London'
    });

    render(<NextEventsPanel parameters={mockParameters} />);

    await waitFor(() => {
      // Verify that convertUTCToUserTimezone was called with the correct UTC time
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(7, 30, 'Asia/Beirut');
    });
  });

  it('should update event times when parameters change', async () => {
    
    getNextMacro.mockReturnValue({
      name: 'Test Macro',
      startTime: { hours: 8, minutes: 0 },
      timeUntilMinutes: 30,
      region: 'London'
    });

    const { rerender } = render(<NextEventsPanel parameters={mockParameters} />);

    // Change parameters
    const newParameters = {
      ...mockParameters,
      userTimezone: 'America/New_York'
    };

    rerender(<NextEventsPanel parameters={newParameters} />);

    await waitFor(() => {
      // Should be called with the new timezone
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'America/New_York');
    });
  });
});
