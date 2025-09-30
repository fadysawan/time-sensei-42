import React, { useMemo } from 'react';
import { GlobalHeader } from './GlobalHeader';
import { GlobalNotifications } from './GlobalNotifications';
import { useUserConfiguration } from '../contexts/UserConfigurationContext';
import { useTradingData } from '../contexts/TradingDataContext';
import { TradingStatusProvider } from '../contexts/TradingStatusContext';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { config } = useUserConfiguration();
  const { tradingData } = useTradingData();
  
  // Add a direct effect to track when tradingData changes
  React.useEffect(() => {
  }, [tradingData]);
  
  
  // Create parameters object using useMemo - only recreate when dependencies actually change
  const parameters = useMemo(() => {
    const params = {
      macros: tradingData.macros,
      killzones: tradingData.killzones,
      marketSessions: tradingData.marketSessions,
      newsTemplates: tradingData.newsTemplates,
      newsInstances: tradingData.newsInstances,
      userTimezone: config.timezone,
    };
    return params;
  }, [
    tradingData.macros,
    tradingData.killzones,
    tradingData.marketSessions,
    tradingData.newsTemplates,
    tradingData.newsInstances,
    config.timezone
  ]);
  
  
  return (
    <TradingStatusProvider 
      parameters={parameters} 
      config={config}
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Global Header */}
        <GlobalHeader />
        
        {/* Global Notifications (handles sound alerts) */}
        <GlobalNotifications />
        
        {/* Main content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </TradingStatusProvider>
  );
};
