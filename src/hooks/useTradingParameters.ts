import { useMemo, useEffect, useRef } from 'react';
import { useUserConfiguration } from '../contexts/UserConfigurationContext';
import { useTradingData } from '../contexts/TradingDataContext';
import { TradingParameters } from '../models';

// Combined hook that provides both user configuration and trading data
// This maintains backward compatibility with existing components
export const useTradingParameters = () => {
  const { 
    config: userConfig, 
    updateTimezone, 
    resetConfiguration 
  } = useUserConfiguration();
  
  const { 
    tradingData, 
    updateTradingData, 
    resetTradingData 
  } = useTradingData();

  // Debug: Track when dependencies change
  const prevKillzonesRef = useRef(tradingData.killzones);
  useEffect(() => {
    if (prevKillzonesRef.current !== tradingData.killzones) {
      prevKillzonesRef.current = tradingData.killzones;
    }
  }, [tradingData.killzones]);

  // Combine user config and trading data into the old TradingParameters format
  // Use useMemo to ensure the parameters object only changes when the underlying data changes
  const parameters: TradingParameters = useMemo(() => {
    return {
      macros: tradingData.macros,
      killzones: tradingData.killzones,
      marketSessions: tradingData.marketSessions,
      newsTemplates: tradingData.newsTemplates,
      newsInstances: tradingData.newsInstances,
      userTimezone: userConfig.timezone, // Map timezone from user config
    };
  }, [
    tradingData.macros,
    tradingData.killzones,
    tradingData.marketSessions,
    tradingData.newsTemplates,
    tradingData.newsInstances,
    userConfig.timezone
  ]);

  // Update function that handles both user config and trading data
  const updateParameters = (newParameters: TradingParameters) => {
    // Update trading data
    updateTradingData({
      macros: newParameters.macros,
      killzones: newParameters.killzones,
      marketSessions: newParameters.marketSessions,
      newsTemplates: newParameters.newsTemplates,
      newsInstances: newParameters.newsInstances,
    });

    // Update user timezone if it changed
    if (newParameters.userTimezone !== userConfig.timezone) {
      updateTimezone(newParameters.userTimezone);
    }
  };

  // Reset both user config and trading data
  const resetParameters = () => {
    resetTradingData();
    resetConfiguration();
  };

  return {
    parameters,
    updateParameters,
    resetParameters,
    // Expose the separated hooks for components that need them
    userConfig,
    tradingData,
  };
};