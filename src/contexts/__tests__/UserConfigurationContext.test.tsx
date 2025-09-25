import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { UserConfigurationProvider, useUserConfiguration } from '../UserConfigurationContext';
import { UserConfiguration } from '../../types/userConfig';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock timeUtils
jest.mock('../../utils/timeUtils', () => ({
  getUserTimezone: jest.fn(() => 'America/New_York'),
}));

const TestComponent: React.FC = () => {
  const { config, updateTimezoneDisplay } = useUserConfiguration();
  
  return (
    <div>
      <div data-testid="timezone-display-enabled">{config.timezoneDisplay.enabled.toString()}</div>
      <div data-testid="timezone-display-mode">{config.timezoneDisplay.displayMode}</div>
      <div data-testid="header-timezone-utc">{config.timezoneDisplay.headerTimezones.utc.toString()}</div>
      <div data-testid="header-timezone-tokyo">{config.timezoneDisplay.headerTimezones.tokyo.toString()}</div>
      <div data-testid="header-timezone-london">{config.timezoneDisplay.headerTimezones.london.toString()}</div>
      <div data-testid="header-timezone-newyork">{config.timezoneDisplay.headerTimezones.newYork.toString()}</div>
      <div data-testid="hover-timezone-utc">{config.timezoneDisplay.hoverTimezones.utc.toString()}</div>
      <div data-testid="hover-timezone-tokyo">{config.timezoneDisplay.hoverTimezones.tokyo.toString()}</div>
      <div data-testid="hover-timezone-london">{config.timezoneDisplay.hoverTimezones.london.toString()}</div>
      <div data-testid="hover-timezone-newyork">{config.timezoneDisplay.hoverTimezones.newYork.toString()}</div>
      <button 
        data-testid="toggle-enabled"
        onClick={() => updateTimezoneDisplay({ enabled: !config.timezoneDisplay.enabled })}
      >
        Toggle Enabled
      </button>
      <button 
        data-testid="change-mode"
        onClick={() => updateTimezoneDisplay({ displayMode: 'header' })}
      >
        Change Mode
      </button>
      <button 
        data-testid="toggle-header-utc"
        onClick={() => updateTimezoneDisplay({
          headerTimezones: { ...config.timezoneDisplay.headerTimezones, utc: !config.timezoneDisplay.headerTimezones.utc }
        })}
      >
        Toggle Header UTC
      </button>
      <button 
        data-testid="toggle-hover-utc"
        onClick={() => updateTimezoneDisplay({
          hoverTimezones: { ...config.timezoneDisplay.hoverTimezones, utc: !config.timezoneDisplay.hoverTimezones.utc }
        })}
      >
        Toggle Hover UTC
      </button>
    </div>
  );
};

describe('UserConfigurationContext Timezone Display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with default timezone display settings', async () => {
    render(
      <UserConfigurationProvider>
        <TestComponent />
      </UserConfigurationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timezone-display-enabled')).toHaveTextContent('true');
      expect(screen.getByTestId('timezone-display-mode')).toHaveTextContent('hover');
      expect(screen.getByTestId('header-timezone-utc')).toHaveTextContent('true');
      expect(screen.getByTestId('header-timezone-tokyo')).toHaveTextContent('false');
      expect(screen.getByTestId('header-timezone-london')).toHaveTextContent('true');
      expect(screen.getByTestId('header-timezone-newyork')).toHaveTextContent('false');
      expect(screen.getByTestId('hover-timezone-utc')).toHaveTextContent('true');
      expect(screen.getByTestId('hover-timezone-tokyo')).toHaveTextContent('true');
      expect(screen.getByTestId('hover-timezone-london')).toHaveTextContent('true');
      expect(screen.getByTestId('hover-timezone-newyork')).toHaveTextContent('true');
    });
  });

  it('should update timezone display enabled state', async () => {
    render(
      <UserConfigurationProvider>
        <TestComponent />
      </UserConfigurationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timezone-display-enabled')).toHaveTextContent('true');
    });

    act(() => {
      screen.getByTestId('toggle-enabled').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('timezone-display-enabled')).toHaveTextContent('false');
    });
  });

  it('should update timezone display mode', async () => {
    render(
      <UserConfigurationProvider>
        <TestComponent />
      </UserConfigurationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timezone-display-mode')).toHaveTextContent('hover');
    });

    act(() => {
      screen.getByTestId('change-mode').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('timezone-display-mode')).toHaveTextContent('header');
    });
  });

  it('should update individual timezone settings', async () => {
    render(
      <UserConfigurationProvider>
        <TestComponent />
      </UserConfigurationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timezone-utc')).toHaveTextContent('true');
    });

    act(() => {
      screen.getByTestId('toggle-utc').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('timezone-utc')).toHaveTextContent('false');
    });
  });

  it('should load timezone display settings from localStorage', async () => {
    const savedConfig = {
      timezone: 'America/New_York',
      displayPreferences: {
        showSeconds: false,
        showCountdown: true,
        theme: 'dark' as const,
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
        displayMode: 'header' as const,
        timezones: {
          utc: false,
          tokyo: true,
          london: false,
          newYork: true,
        },
      },
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedConfig));

    render(
      <UserConfigurationProvider>
        <TestComponent />
      </UserConfigurationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timezone-display-enabled')).toHaveTextContent('false');
      expect(screen.getByTestId('timezone-display-mode')).toHaveTextContent('header');
      expect(screen.getByTestId('timezone-utc')).toHaveTextContent('false');
      expect(screen.getByTestId('timezone-tokyo')).toHaveTextContent('true');
      expect(screen.getByTestId('timezone-london')).toHaveTextContent('false');
      expect(screen.getByTestId('timezone-newyork')).toHaveTextContent('true');
    });
  });

  it('should save timezone display settings to localStorage', async () => {
    render(
      <UserConfigurationProvider>
        <TestComponent />
      </UserConfigurationProvider>
    );

    act(() => {
      screen.getByTestId('toggle-enabled').click();
    });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'userConfiguration',
        expect.stringContaining('"enabled":false')
      );
    });
  });

  it('should handle partial timezone display updates', async () => {
    render(
      <UserConfigurationProvider>
        <TestComponent />
      </UserConfigurationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('timezone-display-enabled')).toHaveTextContent('true');
      expect(screen.getByTestId('timezone-display-mode')).toHaveTextContent('hover');
    });

    act(() => {
      screen.getByTestId('change-mode').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('timezone-display-enabled')).toHaveTextContent('true');
      expect(screen.getByTestId('timezone-display-mode')).toHaveTextContent('header');
      // Other settings should remain unchanged
      expect(screen.getByTestId('timezone-utc')).toHaveTextContent('true');
      expect(screen.getByTestId('timezone-tokyo')).toHaveTextContent('true');
    });
  });
});
