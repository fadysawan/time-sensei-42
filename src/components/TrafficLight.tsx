import React from 'react';
import { TradingStatus } from '../utils/tradingLogic';
import { cn } from '@/lib/utils';

interface TrafficLightProps {
  status: TradingStatus;
  reason: string;
  nextEvent: string;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({ status, reason, nextEvent }) => {
  const getStatusConfig = (status: TradingStatus) => {
    switch (status) {
      case 'green':
        return {
          color: 'bg-trading-green',
          shadowColor: 'shadow-[0_0_20px_hsl(var(--trading-green)/0.5)]',
          text: 'TRADE',
          description: 'Trading allowed'
        };
      case 'amber':
        return {
          color: 'bg-trading-amber',
          shadowColor: 'shadow-[0_0_20px_hsl(var(--trading-amber)/0.5)]',
          text: 'CAUTION',
          description: 'Proceed with caution'
        };
      case 'red':
        return {
          color: 'bg-trading-red',
          shadowColor: 'shadow-[0_0_20px_hsl(var(--trading-red)/0.5)]',
          text: 'HALT',
          description: 'Trading halted'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="group relative">
      {/* Main traffic light */}
      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-card/50 backdrop-blur">
        <div className="relative">
          {/* Traffic light container */}
          <div className="flex flex-col space-y-1 p-2 bg-secondary rounded-lg">
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              status === 'green' ? `${config.color} ${config.shadowColor}` : 'bg-muted opacity-30'
            )}></div>
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              status === 'amber' ? `${config.color} ${config.shadowColor}` : 'bg-muted opacity-30'
            )}></div>
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              status === 'red' ? `${config.color} ${config.shadowColor}` : 'bg-muted opacity-30'
            )}></div>
          </div>
          
          {/* Active status glow */}
          <div className={cn(
            "absolute inset-0 rounded-lg transition-all duration-300",
            config.shadowColor
          )}></div>
        </div>
        
        <div className="text-sm">
          <div className={cn(
            "font-bold text-xs tracking-wider",
            status === 'green' && 'text-trading-green',
            status === 'amber' && 'text-trading-amber',
            status === 'red' && 'text-trading-red'
          )}>
            {config.text}
          </div>
          <div className="text-xs text-muted-foreground">{config.description}</div>
        </div>
      </div>
      
      {/* Hover tooltip */}
      <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-popover text-popover-foreground 
                      rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200 z-30 pointer-events-none">
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Current Period:</span>
            <div className="text-sm">{reason}</div>
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">Next Event:</span>
            <div className="text-sm">{nextEvent}</div>
          </div>
        </div>
        
        {/* Tooltip arrow */}
        <div className="absolute -top-1 right-4 w-2 h-2 bg-popover border-l border-t border-border 
                        transform rotate-45"></div>
      </div>
    </div>
  );
};