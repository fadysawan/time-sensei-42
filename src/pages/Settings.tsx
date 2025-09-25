import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserConfigurationSettings } from '../components/settings/UserConfigurationSettings';
import { TradingDataSettings } from '../components/settings/TradingDataSettings';
import { useTradingData } from '../contexts/TradingDataContext';
import { useUserConfiguration } from '../contexts/UserConfigurationContext';
import { useTradingStatus } from '../contexts/TradingStatusContext';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'trading'>('trading');

  // Use separated hooks for better control
  const { config: userConfig, updateConfiguration, updateTimezone, updateDisplayPreferences, updateUIPreferences, updateTimezoneDisplay } = useUserConfiguration();
  const { tradingData, updateTradingData, updateMacros, updateKillzones, updateMarketSessions, updateNewsTemplates, updateNewsInstances, resetTradingData } = useTradingData();
  
  // Create combined parameters for backward compatibility
  // Use useMemo to ensure the parameters object only changes when the underlying data changes
  const parameters = useMemo(() => ({
    macros: tradingData.macros,
    killzones: tradingData.killzones,
    marketSessions: tradingData.marketSessions,
    newsTemplates: tradingData.newsTemplates,
    newsInstances: tradingData.newsInstances,
    userTimezone: userConfig.timezone,
  }), [
    tradingData.macros,
    tradingData.killzones,
    tradingData.marketSessions,
    tradingData.newsTemplates,
    tradingData.newsInstances,
    userConfig.timezone
  ]);
  
  // Get current time for components that need it
  const { currentTime } = useTradingStatus();
  
  return (
    <div>

      {/* Main Content - Dynamic Layout */}
      <main className="w-full px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        {activeTab === 'trading' ? (
          /* Trading Data Tab - Full Width Layout */
          <div className="h-[calc(100vh-8rem)]">
            <div className="trading-card p-6 h-full overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-blue-400 mb-2">Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Configure your portal preferences and manage trading data.
                </p>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-muted/20 p-1 rounded-lg">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setActiveTab('trading')}
                  className="flex items-center space-x-2"
                >
                  <Database className="h-4 w-4" />
                  <span>Trading Data</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('config')}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Portal Config</span>
                </Button>
              </div>
              
              {/* Trading Data Content */}
              <TradingDataSettings
                tradingData={tradingData}
                userTimezone={userConfig.timezone}
                onTradingDataChange={updateTradingData}
                onMacrosChange={updateMacros}
                onKillzonesChange={updateKillzones}
                onMarketSessionsChange={updateMarketSessions}
                onNewsTemplatesChange={updateNewsTemplates}
                onNewsInstancesChange={updateNewsInstances}
                onResetTradingData={resetTradingData}
                parameters={parameters}
                currentTime={currentTime}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-8 h-[calc(100vh-8rem)] grid-cols-1">
            {/* Settings Panel */}
            <div className="space-y-6">
              <div className="trading-card p-6 h-full overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-400 mb-2">Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure your portal preferences and manage trading data.
                  </p>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6 bg-muted/20 p-1 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('trading')}
                    className="flex items-center space-x-2"
                  >
                    <Database className="h-4 w-4" />
                    <span>Trading Data</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setActiveTab('config')}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Portal Config</span>
                  </Button>
                </div>
                
                {/* Tab Content */}
                <UserConfigurationSettings
                  config={userConfig}
                  onConfigChange={updateConfiguration}
                  onTimezoneChange={updateTimezone}
                  onDisplayPreferencesChange={updateDisplayPreferences}
                  onUIPreferencesChange={updateUIPreferences}
                  onTimezoneDisplayChange={updateTimezoneDisplay}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;