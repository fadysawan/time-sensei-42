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
  console.log('🏗️ GlobalLayout: component called at', new Date().toISOString());
  const { config } = useUserConfiguration();
  const { tradingData } = useTradingData();
  
  // Add a direct effect to track when tradingData changes
  React.useEffect(() => {
    console.log('🚨 GlobalLayout: tradingData EFFECT triggered', {
      killzonesCount: tradingData.killzones.length,
      killzones: tradingData.killzones.map(k => ({ id: k.id, name: k.name, start: k.start, end: k.end })),
      timestamp: new Date().toISOString()
    });
  }, [tradingData]);
  
  console.log('🏗️ GlobalLayout: tradingData received', {
    killzonesCount: tradingData.killzones.length,
    killzonesString: JSON.stringify(tradingData.killzones).substring(0, 100) + '...',
    timestamp: new Date().toISOString()
  });
  
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
    console.log('🔄 GlobalLayout: parameters object created/updated', {
      killzonesCount: params.killzones.length,
      killzones: params.killzones.map(k => ({ id: k.id, name: k.name })),
      timestamp: new Date().toISOString()
    });
    return params;
  }, [
    tradingData.macros,
    tradingData.killzones,
    tradingData.marketSessions,
    tradingData.newsTemplates,
    tradingData.newsInstances,
    config.timezone
  ]);
  
  console.log('🏗️ GlobalLayout: re-rendered', { 
    tradingDataKillzones: tradingData.killzones.length,
    parametersKillzones: parameters.killzones.length,
    tradingDataKillzonesString: JSON.stringify(tradingData.killzones).substring(0, 100),
    killzones: tradingData.killzones.map(k => ({ id: k.id, name: k.name, start: k.start, end: k.end }))
  });
  
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
