import React, { useState } from 'react';
import { Timeline } from './Timeline';

import { TrendingUp, AlertTriangle, Timer, Zap, Calendar, Target, Newspaper, Activity, Globe, DollarSign } from 'lucide-react';
import { useTradingStatus } from '../contexts/TradingStatusContext';
import { useTradingParameters } from '../hooks/useTradingParameters';
import { formatCountdownSeconds, formatCountdownSmart, getEventTypeStyles, getStatusStyles } from '../utils/timeUtils';

export const TradeTimeTracker: React.FC = () => {
  const { parameters } = useTradingParameters();
  const { 
    currentTime,
    tradingStatus, 
    currentPeriod, 
    nextEvent, 
    activeEvents, 
    upcomingEvents, 
    countdown 
  } = useTradingStatus();


  const countdownInfo = formatCountdownSeconds(countdown);
  
  // Use smart formatting for main countdown display
  const countdownMinutes = Math.floor(countdown / 60);
  const hours = Math.floor(countdownMinutes / 60);
  const minutes = countdownMinutes % 60;
  const seconds = countdown % 60;
  const smartCountdownInfo = formatCountdownSmart(
    hours, 
    minutes, 
    seconds, 
    false, // showSeconds will be handled by the context
    countdownMinutes
  );
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
            
            // Use smart formatting for countdown display
            const countdownMinutes = Math.floor(activeEvent.timeLeft / 60);
            const hours = Math.floor(countdownMinutes / 60);
            const minutes = countdownMinutes % 60;
            const seconds = activeEvent.timeLeft % 60;
            const smartCountdown = formatCountdownSmart(
              hours, 
              minutes, 
              seconds, 
              false, // showSeconds will be handled by the context
              countdownMinutes
            );
            
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
                      {smartCountdown}
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
          
          // Use smart formatting for countdown display
          const countdownMinutes = Math.floor(event.timeUntilStart / 60);
          const hours = Math.floor(countdownMinutes / 60);
          const minutes = countdownMinutes % 60;
          const seconds = event.timeUntilStart % 60;
          const smartCountdown = formatCountdownSmart(
            hours, 
            minutes, 
            seconds, 
            false, // showSeconds will be handled by the context
            countdownMinutes
          );
          
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
                    {smartCountdown}
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
    <div>
      {/* Main Timeline */}
      <main className="w-full px-6 py-8">
        <div className="space-y-6">
          {/* Current Status and Upcoming Events Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Current Status Card with dynamic highlighting */}
            <div className={`trading-card p-4 border-2 animate-border-pulse ${statusStyles.border} ${statusStyles.bg}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-blue-400 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Current Status</span>
                  </h2>
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
        </div>
      </main>


    </div>
  );
};
