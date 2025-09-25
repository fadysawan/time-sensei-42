import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NextEventsPanel } from '../NextEventsPanel';
import { TradingParameters } from '../../models';
import { getNextMacro, getNextKillzone, getNextNewsEvent } from '../../utils/tradingLogic';
import { convertUTCToUserTimezone, formatTime } from '../../utils/timeUtils';

// Mock the trading logic functions
jest.mock('../../utils/tradingLogic', () => ({
  getNextMacro: jest.fn(() => ({
    name: 'Test Macro',
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
  formatTime: jest.fn((hours, minutes) => {
    console.log(`formatTime called with: ${hours}:${minutes}`);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }),
  convertUTCToUserTimezone: jest.fn((utcHours, utcMinutes, userTimezone) => {
    console.log(`convertUTCToUserTimezone called with: ${utcHours}:${utcMinutes} for ${userTimezone}`);
    // Mock conversion: add 3 hours for Beirut timezone
    const userHours = (utcHours + 3) % 24;
    const result = {
      hours: userHours,
      minutes: utcMinutes,
      seconds: 0,
      formatted: `${userHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
    };
    console.log(`convertUTCToUserTimezone returning: ${result.hours}:${result.minutes}`);
    return result;
  })
}));

// Mock UI components
jest.mock('../ui/collapsible', () => ({
  Collapsible: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible">{children}</div>,
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-content">{children}</div>,
  CollapsibleTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-trigger">{children}</div>,
}));

describe('NextEventsPanel Timezone Display', () => {
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

  it('should display event times in user timezone', async () => {
    console.log('Testing NextEventsPanel timezone display...');
    
    render(<NextEventsPanel parameters={mockParameters} />);

    await waitFor(() => {
      // Verify that convertUTCToUserTimezone was called
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'Asia/Beirut');
    });

    await waitFor(() => {
      // Verify that formatTime was called with the converted time (11:00)
      expect(formatTime).toHaveBeenCalledWith(11, 0);
    });
  });
});
