import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserConfiguration, defaultUserConfiguration } from '../types/userConfig';
import { getUserTimezone } from '../utils/timeUtils';

const USER_CONFIG_STORAGE_KEY = 'userConfiguration';

interface UserConfigurationContextType {
  config: UserConfiguration;
  updateConfiguration: (config: UserConfiguration) => void;
  updateTimezone: (timezone: string) => void;
  updateDisplayPreferences: (displayPreferences: Partial<UserConfiguration['displayPreferences']>) => void;
  updateUIPreferences: (uiPreferences: Partial<UserConfiguration['uiPreferences']>) => void;
  updateTimezoneDisplay: (timezoneDisplay: Partial<UserConfiguration['timezoneDisplay']>) => void;
  resetConfiguration: () => void;
}

const UserConfigurationContext = createContext<UserConfigurationContextType | undefined>(undefined);

interface UserConfigurationProviderProps {
  children: ReactNode;
}

export const UserConfigurationProvider: React.FC<UserConfigurationProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<UserConfiguration>(() => {
    const detectedTimezone = getUserTimezone();
    console.log('🕐 Initializing with detected timezone:', detectedTimezone);
    return {
      ...defaultUserConfiguration,
      timezone: detectedTimezone // Initialize with user's detected timezone
    };
  });

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(USER_CONFIG_STORAGE_KEY);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed && typeof parsed === 'object') {
          // Merge with defaults to ensure all properties exist
          const mergedConfig = {
            ...defaultUserConfiguration,
            ...parsed,
            displayPreferences: {
              ...defaultUserConfiguration.displayPreferences,
              ...parsed.displayPreferences,
              notifications: {
                ...defaultUserConfiguration.displayPreferences.notifications,
                ...parsed.displayPreferences?.notifications,
              },
            },
            uiPreferences: {
              ...defaultUserConfiguration.uiPreferences,
              ...parsed.uiPreferences,
            },
            timezoneDisplay: {
              ...defaultUserConfiguration.timezoneDisplay,
              ...parsed.timezoneDisplay,
              headerTimezones: {
                ...defaultUserConfiguration.timezoneDisplay.headerTimezones,
                ...parsed.timezoneDisplay?.headerTimezones,
              },
              hoverTimezones: {
                ...defaultUserConfiguration.timezoneDisplay.hoverTimezones,
                ...parsed.timezoneDisplay?.hoverTimezones,
              },
            },
          };
          
          // Ensure timezone is valid, fallback to detected timezone if not
          // Also fix any hardcoded Beirut timezone
          if (!mergedConfig.timezone || mergedConfig.timezone === 'UTC' || mergedConfig.timezone === 'Asia/Beirut') {
            const detectedTimezone = getUserTimezone();
            console.log('🕐 Fixing timezone from', mergedConfig.timezone, 'to detected timezone:', detectedTimezone);
            mergedConfig.timezone = detectedTimezone;
          }
          
          setConfig(mergedConfig);
        }
      }
    } catch (error) {
      console.warn('Failed to load user configuration from localStorage:', error);
    }
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(USER_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save user configuration to localStorage:', error);
    }
  }, [config]);

  // Update entire configuration
  const updateConfiguration = (newConfig: UserConfiguration) => {
    setConfig(newConfig);
  };

  // Update specific configuration section
  const updateTimezone = (timezone: string) => {
    updateConfiguration({
      ...config,
      timezone,
    });
  };

  const updateDisplayPreferences = (displayPreferences: Partial<UserConfiguration['displayPreferences']>) => {
    updateConfiguration({
      ...config,
      displayPreferences: {
        ...config.displayPreferences,
        ...displayPreferences,
      },
    });
  };

  const updateUIPreferences = (uiPreferences: Partial<UserConfiguration['uiPreferences']>) => {
    updateConfiguration({
      ...config,
      uiPreferences: {
        ...config.uiPreferences,
        ...uiPreferences,
      },
    });
  };

  const updateTimezoneDisplay = (timezoneDisplay: Partial<UserConfiguration['timezoneDisplay']>) => {
    updateConfiguration({
      ...config,
      timezoneDisplay: {
        ...config.timezoneDisplay,
        ...timezoneDisplay,
      },
    });
  };

  const resetConfiguration = () => {
    const detectedTimezone = getUserTimezone();
    const resetConfig = {
      ...defaultUserConfiguration,
      timezone: detectedTimezone,
    };
    setConfig(resetConfig);
    
    // Clear localStorage
    try {
      localStorage.removeItem(USER_CONFIG_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear user configuration from localStorage:', error);
    }
  };

  const value: UserConfigurationContextType = {
    config,
    updateConfiguration,
    updateTimezone,
    updateDisplayPreferences,
    updateUIPreferences,
    updateTimezoneDisplay,
    resetConfiguration,
  };

  return (
    <UserConfigurationContext.Provider value={value}>
      {children}
    </UserConfigurationContext.Provider>
  );
};

export const useUserConfiguration = (): UserConfigurationContextType => {
  const context = useContext(UserConfigurationContext);
  if (context === undefined) {
    throw new Error('useUserConfiguration must be used within a UserConfigurationProvider');
  }
  return context;
};
