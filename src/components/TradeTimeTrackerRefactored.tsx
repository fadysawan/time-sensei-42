// Refactored TradeTimeTracker - Following SOLID principles with separated concerns
import React, { useState } from 'react';
import { Timeline } from './Timeline';
import { TrafficLight } from './TrafficLight';
import { SettingsPanel } from './SettingsPanel';
import { Button } from '@/components/ui/button';
import { Settings, Clock, Timer } from 'lucide-react';
import { useTradingParameters } from '../hooks/useTradingParameters';
import { useTradeTime } from '../hooks/useTradeTimeRefactored';
import { StatusIndicator, TimeDisplay } from './status';
import { UpcomingEventsList } from './events';

export const TradeTimeTrackerRefactored: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { parameters, updateParameters, resetParameters } = useTradingParameters();
  const { 
    currentTime, 
    newYorkTime, 
    tradingStatus, 
    currentPeriod, 
    nextEvent, 
    activeEvents, 
    upcomingEvents, 
    countdownInfo 
  } = useTradeTime(parameters);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with enhanced trading theme */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 glass-effect shadow-lg">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trade Time Tracker
              </h1>
            </div>
            <TimeDisplay currentTime={currentTime} newYorkTime={newYorkTime} />
          </div>
          
          <div className="flex items-center space-x-4">
            <TrafficLight 
              status={tradingStatus} 
              reason={currentPeriod} 
              nextEvent={nextEvent} 
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="trading-button border-border/50 hover:border-primary/50 hover:bg-primary/10"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-6 py-8">
        <div className="space-y-6">
          {/* Current Status and Upcoming Events Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Status Card */}
            <StatusIndicator
              tradingStatus={tradingStatus}
              currentPeriod={currentPeriod}
              activeEvents={activeEvents}
              upcomingEvents={upcomingEvents}
              countdownInfo={countdownInfo}
            />

            {/* Upcoming Events Section */}
            <div className="trading-card p-4 trading-hover border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-blue-400 flex items-center space-x-2">
                  <Timer className="h-4 w-4" />
                  <span>Upcoming Events</span>
                </h2>
                <div className="text-xs text-muted-foreground bg-blue-500/10 px-2 py-1 rounded-full">
                  {upcomingEvents.length}
                </div>
              </div>
              
              <UpcomingEventsList upcomingEvents={upcomingEvents} />
            </div>
          </div>

          {/* Timeline with enhanced visual separation */}
          <Timeline parameters={parameters} currentTime={currentTime} />
          
          {/* Quick Stats with trading theme */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="trading-card p-4 trading-hover">
              <div className="text-sm text-muted-foreground mb-1">Active Events Today</div>
              <div className="text-2xl font-bold text-green-400">{activeEvents.length}</div>
              <div className="w-full bg-green-500/20 rounded-full h-1 mt-2">
                <div className="bg-green-400 h-1 rounded-full w-4/5"></div>
              </div>
            </div>
            <div className="trading-card p-4 trading-hover">
              <div className="text-sm text-muted-foreground mb-1">Upcoming Events</div>
              <div className="text-2xl font-bold text-yellow-400">{upcomingEvents.length}</div>
              <div className="w-full bg-yellow-500/20 rounded-full h-1 mt-2">
                <div className="bg-yellow-400 h-1 rounded-full w-3/5"></div>
              </div>
            </div>
            <div className="trading-card p-4 trading-hover">
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <div className={`text-2xl font-bold ${
                tradingStatus === 'green' ? 'text-green-400' : 
                tradingStatus === 'yellow' ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                {tradingStatus === 'green' ? 'Active' : 
                 tradingStatus === 'yellow' ? 'Limited' : 'Closed'}
              </div>
              <div className="w-full bg-green-500/20 rounded-full h-1 mt-2">
                <div className={`h-1 rounded-full ${
                  tradingStatus === 'green' ? 'bg-green-400 w-full' : 
                  tradingStatus === 'yellow' ? 'bg-yellow-400 w-2/3' : 
                  'bg-red-400 w-1/3'
                }`}></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        parameters={parameters}
        onParametersChange={updateParameters}
        onResetParameters={resetParameters}
      />
    </div>
  );
};