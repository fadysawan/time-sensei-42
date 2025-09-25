import React from 'react';
import { TradingStatus } from '../models';
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
          color: 'bg-green-400',
          shadowColor: 'shadow-[0_0_20px_hsl(142_76%_36%/0.6)]',
          text: 'TRADE',
          description: 'Trading allowed',
          textColor: 'text-green-400'
        };
      case 'amber':
        return {
          color: 'bg-yellow-400',
          shadowColor: 'shadow-[0_0_20px_hsl(45_96%_55%/0.6)]',
          text: 'CAUTION',
          description: 'Proceed with caution',
          textColor: 'text-yellow-400'
        };
      case 'red':
        return {
          color: 'bg-red-400',
          shadowColor: 'shadow-[0_0_20px_hsl(0_75%_55%/0.6)]',
          text: 'HALT',
          description: 'Trading halted',
          textColor: 'text-red-400'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="group relative">
      {/* Main traffic light with enhanced styling */}
      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 glass-effect trading-hover">
        <div className="relative">
          {/* Traffic light container with gradient */}
          <div className="flex flex-col space-y-1 p-2 bg-secondary/80 rounded-lg border border-border/30">
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              status === 'green' ? `${config.color} ${config.shadowColor}` : 'bg-muted/30 opacity-30'
            )}></div>
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              status === 'amber' ? `${config.color} ${config.shadowColor}` : 'bg-muted/30 opacity-30'
            )}></div>
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              status === 'red' ? `${config.color} ${config.shadowColor}` : 'bg-muted/30 opacity-30'
            )}></div>
          </div>
        </div>
        
        <div className="text-sm">
          <div className={cn(
            "font-bold text-xs tracking-wider",
            config.textColor
          )}>
            {config.text}
          </div>
          <div className="text-xs text-muted-foreground font-medium">{config.description}</div>
        </div>
      </div>
      
      {/* Enhanced hover tooltip */}
      <div className="absolute right-0 top-full mt-2 w-64 p-3 glass-effect trading-card
                      opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 pointer-events-none
                      transform translate-y-1 group-hover:translate-y-0">
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-blue-400">Current Period:</span>
            <div className="text-sm font-medium">{reason}</div>
          </div>
          <div>
            <span className="text-xs font-medium text-purple-400">Next Event:</span>
            <div className="text-sm font-medium">{nextEvent}</div>
          </div>
        </div>
        
        {/* Enhanced tooltip arrow */}
        <div className="absolute -top-1 right-4 w-2 h-2 bg-card border-l border-t border-border/50
                        transform rotate-45"></div>
      </div>
    </div>
  );
};