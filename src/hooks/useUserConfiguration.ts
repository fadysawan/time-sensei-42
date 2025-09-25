import { useState, useEffect } from 'react';
import { UserConfiguration, defaultUserConfiguration } from '../types/userConfig';
import { getUserTimezone } from '../utils/timeUtils';

const USER_CONFIG_STORAGE_KEY = 'userConfiguration';

export const useUserConfiguration = () => {
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
  const updateConfiguration = (newConfig: UserConfiguration) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(USER_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Failed to save user configuration to localStorage:', error);
    }
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

  // Reset configuration to default values
  const resetConfiguration = () => {
    const resetConfig = {
      ...defaultUserConfiguration,
      timezone: getUserTimezone(),
    };
    setConfig(resetConfig);
    try {
      localStorage.removeItem(USER_CONFIG_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear user configuration from localStorage:', error);
    }
  };

  return {
    config,
    updateConfiguration,
    updateTimezone,
    updateDisplayPreferences,
    updateUIPreferences,
    resetConfiguration,
  };
};
