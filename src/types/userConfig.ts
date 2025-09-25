// User Portal Configuration Types
export interface UserConfiguration {
  timezone: string;
  displayPreferences: {
    showSeconds: boolean;
    showCountdown: boolean;
    theme: 'light' | 'dark';
    notifications: {
      enabled: boolean;
      sound: boolean;
      desktop: boolean;
    };
  };
  uiPreferences: {
    compactMode: boolean;
    showTooltips: boolean;
    autoRefresh: boolean;
    refreshInterval: number; // in seconds
  };
  timezoneDisplay: {
    enabled: boolean;
    displayMode: 'header' | 'hover' | 'both' | 'hidden';
    headerTimezones: {
      utc: boolean;
      tokyo: boolean;
      london: boolean;
      newYork: boolean;
    };
    hoverTimezones: {
      utc: boolean;
      tokyo: boolean;
      london: boolean;
      newYork: boolean;
    };
  };
}

export const defaultUserConfiguration: UserConfiguration = {
  timezone: 'UTC',
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
    refreshInterval: 1, // 1 second
  },
  timezoneDisplay: {
    enabled: true,
    displayMode: 'hover',
    headerTimezones: {
      utc: true,
      tokyo: false,
      london: true,
      newYork: false,
    },
    hoverTimezones: {
      utc: true,
      tokyo: true,
      london: true,
      newYork: true,
    },
  },
};
