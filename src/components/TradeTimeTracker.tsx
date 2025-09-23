import React, { useState } from 'react';
import { Timeline } from './Timeline';
import { TrafficLight } from './TrafficLight';
import { SettingsPanel } from './SettingsPanel';
import { NextEventsPanel } from './NextEventsPanel';
import { Button } from '@/components/ui/button';
import { Settings, Clock, TrendingUp, AlertTriangle, Timer, Zap, Calendar, Target, Newspaper, Activity, Globe, DollarSign } from 'lucide-react';
import { useTradeTime } from '../hooks/useTradeTime';
import { useTradingParameters } from '../hooks/useTradingParameters';
import { formatCountdownSeconds, getEventTypeStyles, getStatusStyles } from '../utils/timeUtils';

export const TradeTimeTracker: React.FC = () => {
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
    countdown 
  } = useTradeTime(parameters);

  const countdownInfo = formatCountdownSeconds(countdown);
  const statusStyles = getStatusStyles(tradingStatus);

  // Helper function to get event type icon
  const getEventIcon = (eventType: string, size: string = "w-4 h-4") => {
    switch (eventType) {
      case 'macro':
        return <TrendingUp className={`${size} text-blue-400`} />;
      case 'killzone':
        return <Target className={`${size} text-purple-400`} />;
      case 'news':
        return <Newspaper className={`${size} text-orange-400`} />;
      case 'premarket':
        return <Activity className={`${size} text-yellow-400`} />;
      case 'lunch':
        return <DollarSign className={`${size} text-red-400`} />;
      default:
        return <Globe className={`${size} text-gray-400`} />;
    }
  };

  // Helper function to render active events
  const renderActiveEvents = () => {
    if (activeEvents.length === 0) return null;
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Active Events</span>
          <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-medium">
            {activeEvents.length}
          </span>
        </h4>
        <div className="space-y-1.5">
          {activeEvents.map((activeEvent, index) => {
            const eventStyles = getEventTypeStyles(activeEvent.block.type);
            const eventCountdown = formatCountdownSeconds(activeEvent.timeLeft);
            return (
              <div key={`active-${index}`} 
                   className={`p-2.5 rounded-md border ${eventStyles.bg} ${eventStyles.border} bg-gradient-to-r from-green-500/5 to-transparent`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1.5">
                      {getEventIcon(activeEvent.block.type, "w-3.5 h-3.5")}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium text-sm ${eventStyles.text}`}>
                        {activeEvent.block.name}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold uppercase ${eventStyles.badge}`}>
                        {activeEvent.block.type}
                      </span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-medium uppercase">
                        LIVE
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-0.5">Ends in:</div>
                    <span className={`font-mono font-bold text-sm ${
                      eventCountdown.isUrgent ? 'text-red-400 animate-pulse' : 
                      eventCountdown.isSoon ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {eventCountdown.display}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper function to get next events by type
  const getNextEventByType = (type: 'macro' | 'killzone' | 'news') => {
    return upcomingEvents.find(event => event.block.type === type) || null;
  };

  // Helper function to render next events summary
  const renderNextEventsSummary = () => {
    const nextMacro = getNextEventByType('macro');
    const nextKillzone = getNextEventByType('killzone');
    const nextNews = getNextEventByType('news');

    return (
      <div className="grid grid-cols-1 gap-3">
        {/* Next Macro */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Next Macro</span>
            </div>
            {nextMacro ? (
              <div className="text-right">
                <div className="text-xs font-mono text-blue-400">
                  {formatCountdownSeconds(nextMacro.timeUntilStart).display}
                </div>
                <div className="text-xs text-muted-foreground truncate max-w-20">
                  {nextMacro.block.name}
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">None today</span>
            )}
          </div>
        </div>

        {/* Next Killzone */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Next Killzone</span>
            </div>
            {nextKillzone ? (
              <div className="text-right">
                <div className="text-xs font-mono text-purple-400">
                  {formatCountdownSeconds(nextKillzone.timeUntilStart).display}
                </div>
                <div className="text-xs text-muted-foreground truncate max-w-20">
                  {nextKillzone.block.name}
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">None today</span>
            )}
          </div>
        </div>

        {/* Next News */}
        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Next News</span>
            </div>
            {nextNews ? (
              <div className="text-right">
                <div className="text-xs font-mono text-orange-400">
                  {formatCountdownSeconds(nextNews.timeUntilStart).display}
                </div>
                <div className="text-xs text-muted-foreground truncate max-w-20">
                  {nextNews.block.name}
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">None today</span>
            )}
          </div>
        </div>
      </div>
    );
  };
  const renderUpcomingEvents = () => {
    if (upcomingEvents.length === 0) {
      return (
        <div className="text-center py-6">
          <Timer className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-muted-foreground/50 text-xs">No upcoming events</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {upcomingEvents.slice(0, 6).map((event, index) => {
          const eventStyles = getEventTypeStyles(event.block.type);
          const countdown = formatCountdownSeconds(event.timeUntilStart);
          const startTime = `${String(event.block.startHour).padStart(2, '0')}:${String(event.block.startMinute).padStart(2, '0')}`;
          
          return (
            <div 
              key={`upcoming-${index}`}
              className={`p-2.5 rounded-md border transition-all duration-150 hover:shadow-sm ${eventStyles.bg} ${eventStyles.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    {getEventIcon(event.block.type, "w-3.5 h-3.5")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h4 className={`font-medium text-sm truncate ${eventStyles.text}`}>
                        {event.block.name}
                      </h4>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold uppercase ${eventStyles.badge} flex-shrink-0`}>
                        {event.block.type}
                      </span>
                      {index === 0 && (
                        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full uppercase font-medium flex-shrink-0">
                          NEXT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs text-muted-foreground font-mono">
                        {startTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className={`font-mono font-semibold text-sm ${
                    countdown.isUrgent ? 'text-red-400' : 
                    countdown.isSoon ? 'text-yellow-400' : 
                    'text-blue-400'
                  }`}>
                    {countdown.display}
                  </div>
                </div>
              </div>
              
              {countdown.isUrgent && (
                <div className="mt-2 pt-1.5 border-t border-border/20">
                  <div className="flex items-center space-x-1.5 text-red-400">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Starting soon</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {upcomingEvents.length > 6 && (
          <div className="text-center pt-1">
            <span className="text-xs text-muted-foreground/50 bg-muted/30 px-2.5 py-1 rounded-full">
              +{upcomingEvents.length - 6} more
            </span>
          </div>
        )}
      </div>
    );
  };

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
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-300">Beirut:</span>
                <span className="font-mono text-blue-400 font-semibold">{currentTime}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                <span className="text-purple-300">New York:</span>
                <span className="font-mono text-purple-400 font-semibold">{newYorkTime}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <TrafficLight status={tradingStatus} reason={currentPeriod} nextEvent={nextEvent} />
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

      {/* Main Timeline */}
      <main className="container px-6 py-8">
        <div className="space-y-6">
          {/* Current Status and Upcoming Events Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Current Status Card with dynamic highlighting */}
            <div className={`trading-card p-4 trading-hover border-2 transition-all duration-300 ${statusStyles.border} ${statusStyles.bg}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-blue-400 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Current Status</span>
                  </h2>
                  <div className="flex items-center space-x-2">
                    {/* Event summary indicators */}
                    {activeEvents.length > 0 && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-medium">{activeEvents.length} Active</span>
                      </div>
                    )}
                    {upcomingEvents.length > 0 && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                        <Timer className="w-2.5 h-2.5 text-blue-400" />
                        <span className="text-xs text-blue-400 font-medium">{upcomingEvents.length} Next</span>
                      </div>
                    )}
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${statusStyles.gradient} text-white`}>
                      {tradingStatus.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-muted-foreground font-medium text-sm">{currentPeriod}</p>
                  
                  {/* Active Events Display Only */}
                  <div className="space-y-3">
                    {/* Active Events Display */}
                    {renderActiveEvents()}
                    
                    {/* No active events message */}
                    {activeEvents.length === 0 && (
                      <div className="p-3 rounded-lg border border-dashed border-border/50 text-center">
                        <div className="text-muted-foreground/60 text-xs">
                          No active trading events
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Warning for urgent events */}
                  {countdownInfo.isUrgent && (
                    <div className="flex items-center space-x-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-xs text-red-400 font-medium">
                        {activeEvents.length > 0 ? 'Event ending soon!' : 'Event starting soon!'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Clean Upcoming Events Section - Right Side */}
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
              
              {renderUpcomingEvents()}
            </div>
          </div>

          {/* Timeline with enhanced visual separation */}
          <Timeline parameters={parameters} currentTime={currentTime} />
          
          {/* Quick Stats with trading theme */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="trading-card p-4 trading-hover">
              <div className="text-sm text-muted-foreground mb-1">Active Macros Today</div>
              <div className="text-2xl font-bold text-green-400">4</div>
              <div className="w-full bg-green-500/20 rounded-full h-1 mt-2">
                <div className="bg-green-400 h-1 rounded-full w-4/5"></div>
              </div>
            </div>
            <div className="trading-card p-4 trading-hover">
              <div className="text-sm text-muted-foreground mb-1">Trading Hours Left</div>
              <div className="text-2xl font-bold text-yellow-400">6h 23m</div>
              <div className="w-full bg-yellow-500/20 rounded-full h-1 mt-2">
                <div className="bg-yellow-400 h-1 rounded-full w-3/5"></div>
              </div>
            </div>
            <div className="trading-card p-4 trading-hover">
              <div className="text-sm text-muted-foreground mb-1">Risk Status</div>
              <div className="text-2xl font-bold text-green-400">Clear</div>
              <div className="w-full bg-green-500/20 rounded-full h-1 mt-2">
                <div className="bg-green-400 h-1 rounded-full w-full"></div>
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