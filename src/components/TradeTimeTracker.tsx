import React, { useState, useEffect } from 'react';
import { Timeline } from './Timeline';
import { TrafficLight } from './TrafficLight';
import { SettingsPanel } from './SettingsPanel';
import { Button } from '@/components/ui/button';
import { Settings, Clock } from 'lucide-react';
import { useTradeTime } from '../hooks/useTradeTime';
import { TradingParameters, defaultTradingParameters } from '../utils/tradingLogic';

export const TradeTimeTracker: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [parameters, setParameters] = useState<TradingParameters>(defaultTradingParameters);
  const { currentTime, tradingStatus, currentPeriod, nextEvent } = useTradeTime(parameters);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Trade Time Tracker</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Beirut Time:</span>
              <span className="font-mono text-foreground">{currentTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <TrafficLight status={tradingStatus} reason={currentPeriod} nextEvent={nextEvent} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Timeline */}
      <main className="container px-6 py-8">
        <div className="space-y-6">
          {/* Current Status Card */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Current Status</h2>
                <p className="text-muted-foreground">{currentPeriod}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Next Event</div>
                <div className="font-mono text-lg">{nextEvent}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <Timeline parameters={parameters} currentTime={currentTime} />
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm text-muted-foreground">Active Macros Today</div>
              <div className="text-2xl font-bold text-trading-green">4</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm text-muted-foreground">Trading Hours Left</div>
              <div className="text-2xl font-bold text-trading-amber">6h 23m</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm text-muted-foreground">Risk Status</div>
              <div className="text-2xl font-bold text-trading-green">Clear</div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        parameters={parameters}
        onParametersChange={setParameters}
      />
    </div>
  );
};