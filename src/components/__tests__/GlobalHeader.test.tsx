import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GlobalHeader } from '../GlobalHeader';
import { UserConfiguration } from '../../types/userConfig';

// Mock the contexts
jest.mock('../../contexts/TradingStatusContext', () => ({
  useTradingStatus: jest.fn(() => ({
    currentTime: '10:30:45',
    utcTime: '07:30:45',
    newYorkTime: '03:30:45',
    londonTime: '08:30:45',
    tokyoTime: '16:30:45',
    currentDate: '2025-01-25 (New York)',
    utcDate: '2025-01-25 (UTC)',
    newYorkDate: '2025-01-25 (New York)',
    londonDate: '2025-01-25 (London)',
    tokyoDate: '2025-01-25 (Tokyo)',
    tradingStatus: 'green',
    currentPeriod: 'Active Trading',
    nextEvent: 'Next Macro in 30 minutes',
  }))
}));

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: jest.fn(() => ({
    theme: 'dark',
    resolvedTheme: 'dark',
  }))
}));

jest.mock('../../contexts/UserConfigurationContext', () => ({
  useUserConfiguration: jest.fn(() => ({
    config: {
      timezone: 'America/New_York',
      displayPreferences: {
        showSeconds: false,
        showCountdown: true,
        theme: 'dark',
        notifications: {
          enabled: true,
          sound: true,
          desktop: false,
        },
      },
      uiPreferences: {
        compactMode: false,
        showTooltips: true,
        autoRefresh: true,
        refreshInterval: 1,
      },
      timezoneDisplay: {
        enabled: true,
        displayMode: 'hover',
        timezones: {
          utc: true,
          tokyo: true,
          london: true,
          newYork: true,
        },
      },
    },
    updateDisplayPreferences: jest.fn(),
  }))
}));

// Mock the TrafficLight component
jest.mock('../TrafficLight', () => ({
  TrafficLight: ({ status, reason, nextEvent }: { status: string; reason: string; nextEvent: string }) => (
    <div data-testid="traffic-light">
      Status: {status}, Reason: {reason}, Next: {nextEvent}
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('GlobalHeader Timezone Display', () => {
  const mockUseUserConfiguration = jest.requireMock('../../contexts/UserConfigurationContext').useUserConfiguration;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show timezone display when enabled', () => {
    renderWithRouter(<GlobalHeader />);

    expect(screen.getByText('Current Time:')).toBeInTheDocument();
    expect(screen.getByText('10:30:45')).toBeInTheDocument();
  });

  it('should hide timezone display when disabled', () => {
    mockUseUserConfiguration.mockReturnValue({
      config: {
        timezone: 'America/New_York',
        displayPreferences: {
          showSeconds: false,
          showCountdown: true,
          theme: 'dark',
          notifications: {
            enabled: true,
            sound: true,
            desktop: false,
          },
        },
        uiPreferences: {
          compactMode: false,
          showTooltips: true,
          autoRefresh: true,
          refreshInterval: 1,
        },
        timezoneDisplay: {
          enabled: false,
          displayMode: 'hover',
          timezones: {
            utc: true,
            tokyo: true,
            london: true,
            newYork: true,
          },
        },
      },
      updateDisplayPreferences: jest.fn(),
    });

    renderWithRouter(<GlobalHeader />);

    expect(screen.queryByText('Current Time:')).not.toBeInTheDocument();
  });

  it('should show clocks in header when displayMode is header', () => {
    mockUseUserConfiguration.mockReturnValue({
      config: {
        timezone: 'America/New_York',
        displayPreferences: {
          showSeconds: false,
          showCountdown: true,
          theme: 'dark',
          notifications: {
            enabled: true,
            sound: true,
            desktop: false,
          },
        },
        uiPreferences: {
          compactMode: false,
          showTooltips: true,
          autoRefresh: true,
          refreshInterval: 1,
        },
        timezoneDisplay: {
          enabled: true,
          displayMode: 'header',
          timezones: {
            utc: true,
            tokyo: true,
            london: true,
            newYork: true,
          },
        },
      },
      updateDisplayPreferences: jest.fn(),
    });

    renderWithRouter(<GlobalHeader />);

    expect(screen.getByText('Current:')).toBeInTheDocument();
    expect(screen.getByText('UTC')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('NY')).toBeInTheDocument();
  });

  it('should show clocks in header when displayMode is both', () => {
    mockUseUserConfiguration.mockReturnValue({
      config: {
        timezone: 'America/New_York',
        displayPreferences: {
          showSeconds: false,
          showCountdown: true,
          theme: 'dark',
          notifications: {
            enabled: true,
            sound: true,
            desktop: false,
          },
        },
        uiPreferences: {
          compactMode: false,
          showTooltips: true,
          autoRefresh: true,
          refreshInterval: 1,
        },
        timezoneDisplay: {
          enabled: true,
          displayMode: 'both',
          timezones: {
            utc: true,
            tokyo: true,
            london: true,
            newYork: true,
          },
        },
      },
      updateDisplayPreferences: jest.fn(),
    });

    renderWithRouter(<GlobalHeader />);

    expect(screen.getByText('Current:')).toBeInTheDocument();
    expect(screen.getByText('UTC')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('NY')).toBeInTheDocument();
  });

  it('should show only enabled timezones in header', () => {
    mockUseUserConfiguration.mockReturnValue({
      config: {
        timezone: 'America/New_York',
        displayPreferences: {
          showSeconds: false,
          showCountdown: true,
          theme: 'dark',
          notifications: {
            enabled: true,
            sound: true,
            desktop: false,
          },
        },
        uiPreferences: {
          compactMode: false,
          showTooltips: true,
          autoRefresh: true,
          refreshInterval: 1,
        },
        timezoneDisplay: {
          enabled: true,
          displayMode: 'header',
          timezones: {
            utc: true,
            tokyo: false,
            london: true,
            newYork: false,
          },
        },
      },
      updateDisplayPreferences: jest.fn(),
    });

    renderWithRouter(<GlobalHeader />);

    expect(screen.getByText('UTC')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.queryByText('Tokyo')).not.toBeInTheDocument();
    expect(screen.queryByText('NY')).not.toBeInTheDocument();
  });

  it('should show only enabled timezones in hover tooltip', () => {
    mockUseUserConfiguration.mockReturnValue({
      config: {
        timezone: 'America/New_York',
        displayPreferences: {
          showSeconds: false,
          showCountdown: true,
          theme: 'dark',
          notifications: {
            enabled: true,
            sound: true,
            desktop: false,
          },
        },
        uiPreferences: {
          compactMode: false,
          showTooltips: true,
          autoRefresh: true,
          refreshInterval: 1,
        },
        timezoneDisplay: {
          enabled: true,
          displayMode: 'hover',
          timezones: {
            utc: false,
            tokyo: true,
            london: false,
            newYork: true,
          },
        },
      },
      updateDisplayPreferences: jest.fn(),
    });

    renderWithRouter(<GlobalHeader />);

    // The tooltip content is not visible by default, but we can check the structure
    expect(screen.getByText('Current Time:')).toBeInTheDocument();
    
    // Check that the hover element exists
    const hoverElement = screen.getByText('Current Time:').closest('.group');
    expect(hoverElement).toBeInTheDocument();
  });

  it('should display correct time values for each timezone', () => {
    mockUseUserConfiguration.mockReturnValue({
      config: {
        timezone: 'America/New_York',
        displayPreferences: {
          showSeconds: false,
          showCountdown: true,
          theme: 'dark',
          notifications: {
            enabled: true,
            sound: true,
            desktop: false,
          },
        },
        uiPreferences: {
          compactMode: false,
          showTooltips: true,
          autoRefresh: true,
          refreshInterval: 1,
        },
        timezoneDisplay: {
          enabled: true,
          displayMode: 'header',
          timezones: {
            utc: true,
            tokyo: true,
            london: true,
            newYork: true,
          },
        },
      },
      updateDisplayPreferences: jest.fn(),
    });

    renderWithRouter(<GlobalHeader />);

    expect(screen.getByText('07:30:45')).toBeInTheDocument(); // UTC
    expect(screen.getByText('16:30:45')).toBeInTheDocument(); // Tokyo
    expect(screen.getByText('08:30:45')).toBeInTheDocument(); // London
    expect(screen.getByText('03:30:45')).toBeInTheDocument(); // New York
  });

  it('should show settings button when not on settings page', () => {
    // Mock useLocation to return home page
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => ({ pathname: '/' }),
    }));

    renderWithRouter(<GlobalHeader />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should show disabled settings button when on settings page', () => {
    // Mock useLocation to return settings page
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => ({ pathname: '/settings' }),
    }));

    renderWithRouter(<GlobalHeader />);

    const settingsButton = screen.getByText('Settings');
    expect(settingsButton.closest('button')).toBeDisabled();
  });
});
