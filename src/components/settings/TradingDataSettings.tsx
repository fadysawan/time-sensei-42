import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MacroSettings } from './MacroSettings';
import { KillzoneSettings } from './KillzoneSettings';
import { MarketSessionsSettings } from './MarketSessionsSettings';
import { NewsSettings } from './NewsSettings';
import { Timeline } from '../Timeline';
import { TradingData } from '../../types/tradingData';
import { TradingParameters } from '../../models';
import { TrendingUp, Target, Clock, Newspaper, RotateCcw } from 'lucide-react';

interface TradingDataSettingsProps {
  tradingData: TradingData;
  userTimezone: string;
  onTradingDataChange: (data: TradingData) => void;
  onMacrosChange: (macros: TradingData['macros']) => void;
  onKillzonesChange: (killzones: TradingData['killzones']) => void;
  onMarketSessionsChange: (sessions: TradingData['marketSessions']) => void;
  onNewsTemplatesChange: (templates: TradingData['newsTemplates']) => void;
  onNewsInstancesChange: (instances: TradingData['newsInstances']) => void;
  onResetTradingData: () => void;
  parameters: TradingParameters; // Combined parameters for timeline preview
  currentTime: string; // Current time for timeline preview
}

export const TradingDataSettings: React.FC<TradingDataSettingsProps> = ({
  tradingData,
  userTimezone,
  onTradingDataChange,
  onMacrosChange,
  onKillzonesChange,
  onMarketSessionsChange,
  onNewsTemplatesChange,
  onNewsInstancesChange,
  onResetTradingData,
  parameters,
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<'macros' | 'killzones' | 'sessions' | 'news'>('macros');

  // Wrapper functions that update data - status refresh is handled automatically by context
  const handleMacrosChange = (macros: TradingData['macros']) => {
    onMacrosChange(macros);
  };

  const handleKillzonesChange = (killzones: TradingData['killzones']) => {
    console.log('🔧 TradingDataSettings: handleKillzonesChange called', {
      killzonesCount: killzones.length,
      killzones: killzones.map(k => ({ name: k.name, start: k.start, end: k.end }))
    });
    
    // Update killzones - the context will handle the status refresh automatically
    onKillzonesChange(killzones);
  };

  const handleMarketSessionsChange = (sessions: TradingData['marketSessions']) => {
    onMarketSessionsChange(sessions);
  };

  const handleNewsTemplatesChange = (templates: TradingData['newsTemplates']) => {
    onNewsTemplatesChange(templates);
  };

  const handleNewsInstancesChange = (instances: TradingData['newsInstances']) => {
    onNewsInstancesChange(instances);
  };

  const handleResetTradingData = () => {
    onResetTradingData();
  };

  const tabs = [
    { id: 'macros', label: 'Macros', icon: TrendingUp },
    { id: 'killzones', label: 'Killzones', icon: Target },
    { id: 'sessions', label: 'Sessions', icon: Clock },
    { id: 'news', label: 'News', icon: Newspaper },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Column - Settings (1/2 width) */}
      <div className="space-y-6">
        {/* Header with Reset Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Trading Data Management</h2>
            <p className="text-muted-foreground">
              Manage your trading sessions, macros, killzones, and news events.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleResetTradingData}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset All Trading Data</span>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted/20 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2 flex-1"
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
        {activeTab === 'macros' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <span>Macro Sessions</span>
              </CardTitle>
              <CardDescription>
                Configure high-probability trading periods based on market analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MacroSettings
                parameters={{
                  macros: tradingData.macros,
                  killzones: tradingData.killzones,
                  marketSessions: tradingData.marketSessions,
                  newsTemplates: tradingData.newsTemplates,
                  newsInstances: tradingData.newsInstances,
                  userTimezone,
                }}
                onParametersChange={(params) => {
                  console.log('🔧 TradingDataSettings: MacroSettings onParametersChange called', {
                    macrosCount: params.macros.length,
                  });
                  handleMacrosChange(params.macros);
                }}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'killzones' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-400" />
                <span>Killzone Sessions</span>
              </CardTitle>
              <CardDescription>
                Define periods when trading should be avoided due to high volatility or low liquidity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KillzoneSettings
                parameters={{
                  macros: tradingData.macros,
                  killzones: tradingData.killzones,
                  marketSessions: tradingData.marketSessions,
                  newsTemplates: tradingData.newsTemplates,
                  newsInstances: tradingData.newsInstances,
                  userTimezone,
                }}
                onParametersChange={(params) => {
                  console.log('🔧 TradingDataSettings: KillzoneSettings onParametersChange called', {
                    killzonesCount: params.killzones.length,
                    killzones: params.killzones.map(k => ({ name: k.name, start: k.start, end: k.end }))
                  });
                  handleKillzonesChange(params.killzones);
                }}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'sessions' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>Market Sessions</span>
              </CardTitle>
              <CardDescription>
                Configure different market session types (pre-market, lunch, after-hours, custom).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketSessionsSettings
                marketSessions={tradingData.marketSessions}
                onSessionsChange={handleMarketSessionsChange}
                userTimezone={userTimezone}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'news' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5 text-orange-400" />
                <span>News Events</span>
              </CardTitle>
              <CardDescription>
                Manage news event templates and scheduled news instances.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsSettings
                newsTemplates={tradingData.newsTemplates}
                newsInstances={tradingData.newsInstances}
                onTemplatesChange={handleNewsTemplatesChange}
                onInstancesChange={handleNewsInstancesChange}
                userTimezone={userTimezone}
              />
            </CardContent>
          </Card>
        )}
        </div>
      </div>

      {/* Right Column - Live Timeline Preview (1/2 width) */}
      <div className="space-y-6">
        <div className="trading-card p-6 h-[calc(100vh-12rem)] sticky top-6 max-h-[calc(100vh-12rem)] overflow-visible">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-purple-400 mb-2">Live Preview</h2>
            <p className="text-sm text-muted-foreground">
              See your changes reflected on the timeline.
            </p>
          </div>
          
          <div className="h-[calc(100%-8rem)] overflow-visible pt-4">
            <Timeline parameters={parameters} currentTime={currentTime} />
          </div>
        </div>
      </div>
    </div>
  );
};
