// StatusIndicator Component - Single Responsibility: Display current trading status
import React from 'react';
import { TrendingUp, Timer, AlertTriangle } from 'lucide-react';
import { TradingStatus, ActiveEvent, UpcomingEvent, CountdownInfo } from '../../models';
import { getStatusStyles } from '../../utils/styleUtils';
import { ActiveEventsList } from '../events';

interface StatusIndicatorProps {
  tradingStatus: TradingStatus;
  currentPeriod: string;
  activeEvents: ActiveEvent[];
  upcomingEvents: UpcomingEvent[];
  countdownInfo: CountdownInfo;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  tradingStatus,
  currentPeriod,
  activeEvents,
  upcomingEvents,
  countdownInfo
}) => {
  const statusStyles = getStatusStyles(tradingStatus);

  return (
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
          
          {/* Active Events Display */}
          <div className="space-y-3">
            <ActiveEventsList activeEvents={activeEvents} />
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
  );
};