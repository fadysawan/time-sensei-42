import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserConfigurationSettings } from '../UserConfigurationSettings';
import { UserConfiguration } from '../../../types/userConfig';

// Mock the TimezoneSelector component
jest.mock('../../TimezoneSelector', () => ({
  TimezoneSelector: ({ selectedTimezone, onTimezoneChange }: { selectedTimezone: string; onTimezoneChange: (timezone: string) => void }) => (
    <select 
      data-testid="timezone-selector" 
      value={selectedTimezone} 
      onChange={(e) => onTimezoneChange(e.target.value)}
    >
      <option value="UTC">UTC</option>
      <option value="America/New_York">America/New_York</option>
      <option value="Europe/London">Europe/London</option>
      <option value="Asia/Tokyo">Asia/Tokyo</option>
    </select>
  ),
}));

// Mock the useStatusNotifications hook
jest.mock('../../../hooks/useStatusNotifications', () => ({
  useStatusNotifications: jest.fn(() => ({
    playNotificationSound: jest.fn(),
    getStatusMessage: jest.fn(() => ({
      type: 'success',
      title: 'Test notification',
      description: 'Test description',
    })),
  })),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockConfig: UserConfiguration = {
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
};

describe('UserConfigurationSettings Timezone Display', () => {
  const mockOnConfigChange = jest.fn();
  const mockOnTimezoneChange = jest.fn();
  const mockOnDisplayPreferencesChange = jest.fn();
  const mockOnUIPreferencesChange = jest.fn();
  const mockOnTimezoneDisplayChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render timezone display tab', () => {
    render(
      <UserConfigurationSettings
        config={mockConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    expect(screen.getByText('Header Clocks')).toBeInTheDocument();
  });

  it('should switch to timezone display tab when clicked', async () => {
    render(
      <UserConfigurationSettings
        config={mockConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    const timezoneDisplayTab = screen.getByText('Header Clocks');
    fireEvent.click(timezoneDisplayTab);

    await waitFor(() => {
      expect(screen.getByText('Header Clock Display')).toBeInTheDocument();
      expect(screen.getByText('Enable Header Clocks')).toBeInTheDocument();
    });
  });

  it('should display current timezone display settings', async () => {
    render(
      <UserConfigurationSettings
        config={mockConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    // Switch to timezone display tab
    fireEvent.click(screen.getByText('Header Clocks'));

    await waitFor(() => {
      // Check that switches reflect current state
      const enabledSwitch = screen.getByRole('switch', { name: /enable header clocks/i });
      expect(enabledSwitch).toBeChecked();

      // Check display mode selector
      expect(screen.getByDisplayValue('Show on hover only')).toBeInTheDocument();

      // Check timezone switches
      expect(screen.getByRole('switch', { name: /utc/i })).toBeChecked();
      expect(screen.getByRole('switch', { name: /tokyo/i })).toBeChecked();
      expect(screen.getByRole('switch', { name: /london/i })).toBeChecked();
      expect(screen.getByRole('switch', { name: /new york/i })).toBeChecked();
    });
  });

  it('should call onTimezoneDisplayChange when enabled switch is toggled', async () => {
    render(
      <UserConfigurationSettings
        config={mockConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    // Switch to timezone display tab
    fireEvent.click(screen.getByText('Header Clocks'));

    await waitFor(() => {
      const enabledSwitch = screen.getByRole('switch', { name: /enable header clocks/i });
      fireEvent.click(enabledSwitch);
    });

    expect(mockOnTimezoneDisplayChange).toHaveBeenCalledWith({ enabled: false });
  });

  it('should call onTimezoneDisplayChange when display mode is changed', async () => {
    render(
      <UserConfigurationSettings
        config={mockConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    // Switch to timezone display tab
    fireEvent.click(screen.getByText('Header Clocks'));

    await waitFor(() => {
      const displayModeSelect = screen.getByDisplayValue('Show on hover only');
      fireEvent.click(displayModeSelect);
      
      // Select "Show in header" option
      const headerOption = screen.getByText('Show in header');
      fireEvent.click(headerOption);
    });

    expect(mockOnTimezoneDisplayChange).toHaveBeenCalledWith({ displayMode: 'header' });
  });

  it('should call onTimezoneDisplayChange when individual timezone is toggled', async () => {
    render(
      <UserConfigurationSettings
        config={mockConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    // Switch to timezone display tab
    fireEvent.click(screen.getByText('Header Clocks'));

    await waitFor(() => {
      const utcSwitch = screen.getByRole('switch', { name: /utc/i });
      fireEvent.click(utcSwitch);
    });

    expect(mockOnTimezoneDisplayChange).toHaveBeenCalledWith({
      timezones: { ...mockConfig.timezoneDisplay.timezones, utc: false }
    });
  });

  it('should disable controls when timezone display is disabled', async () => {
    const disabledConfig = {
      ...mockConfig,
      timezoneDisplay: {
        ...mockConfig.timezoneDisplay,
        enabled: false,
      },
    };

    render(
      <UserConfigurationSettings
        config={disabledConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    // Switch to timezone display tab
    fireEvent.click(screen.getByText('Header Clocks'));

    await waitFor(() => {
      const enabledSwitch = screen.getByRole('switch', { name: /enable header clocks/i });
      expect(enabledSwitch).not.toBeChecked();

      // Display mode selector should be disabled
      const displayModeSelect = screen.getByDisplayValue('Show on hover only');
      expect(displayModeSelect).toBeDisabled();

      // Timezone switches should be disabled
      expect(screen.getByRole('switch', { name: /utc/i })).toBeDisabled();
      expect(screen.getByRole('switch', { name: /tokyo/i })).toBeDisabled();
      expect(screen.getByRole('switch', { name: /london/i })).toBeDisabled();
      expect(screen.getByRole('switch', { name: /new york/i })).toBeDisabled();
    });
  });

  it('should show all timezone options with correct labels', async () => {
    render(
      <UserConfigurationSettings
        config={mockConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    // Switch to timezone display tab
    fireEvent.click(screen.getByText('Header Clocks'));

    await waitFor(() => {
      expect(screen.getByText('UTC')).toBeInTheDocument();
      expect(screen.getByText('Tokyo (JST)')).toBeInTheDocument();
      expect(screen.getByText('London (GMT/BST)')).toBeInTheDocument();
      expect(screen.getByText('New York (EST/EDT)')).toBeInTheDocument();
    });
  });

  it('should show all display mode options', async () => {
    render(
      <UserConfigurationSettings
        config={mockConfig}
        onConfigChange={mockOnConfigChange}
        onTimezoneChange={mockOnTimezoneChange}
        onDisplayPreferencesChange={mockOnDisplayPreferencesChange}
        onUIPreferencesChange={mockOnUIPreferencesChange}
        onTimezoneDisplayChange={mockOnTimezoneDisplayChange}
      />
    );

    // Switch to timezone display tab
    fireEvent.click(screen.getByText('Header Clocks'));

    await waitFor(() => {
      const displayModeSelect = screen.getByDisplayValue('Show on hover only');
      fireEvent.click(displayModeSelect);

      expect(screen.getByText('Show on hover only')).toBeInTheDocument();
      expect(screen.getByText('Show in header')).toBeInTheDocument();
      expect(screen.getByText('Show both in header and on hover')).toBeInTheDocument();
    });
  });
});
