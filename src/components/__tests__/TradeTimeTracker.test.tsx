import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TradeTimeTracker } from '../TradeTimeTracker';
import { convertUTCToUserTimezone } from '../../utils/timeUtils';

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
        timeUntilStart: 1800 // 30 minutes in seconds
      }
    ],
    countdown: 1800
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
  formatCountdownSmart: jest.fn((hours, minutes, seconds, showSeconds, countdownMinutes) => 
    `${hours}h ${minutes}m ${seconds}s`
  ),
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
    return {
      hours: utcHours,
      minutes: utcMinutes,
      seconds: 0,
      formatted: `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`
    };
  })
}));

describe('TradeTimeTracker Timezone Display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display event times in user timezone', async () => {
    render(<TradeTimeTracker />);

    await waitFor(() => {
      // Verify that convertUTCToUserTimezone was called with the correct parameters
      expect(convertUTCToUserTimezone).toHaveBeenCalledWith(8, 0, 'Asia/Beirut');
    });

    // The event should display at 11:00 (8:00 UTC + 3 hours for Beirut)
    await waitFor(() => {
      expect(screen.getByText('11:00')).toBeInTheDocument();
    });
  });

  it('should display event name correctly', async () => {
    render(<TradeTimeTracker />);

    await waitFor(() => {
      expect(screen.getByText('London Session')).toBeInTheDocument();
    });
  });

  it('should display countdown correctly', async () => {
    render(<TradeTimeTracker />);

    await waitFor(() => {
      expect(screen.getByText('0h 30m 0s')).toBeInTheDocument();
    });
  });
});
