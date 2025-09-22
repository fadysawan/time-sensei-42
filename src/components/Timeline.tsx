import React, { useMemo } from 'react';
import { TradingParameters, TimeBlock, generateTimeBlocks } from '../utils/tradingLogic';
import { formatTime } from '../utils/timeUtils';

interface TimelineProps {
  parameters: TradingParameters;
  currentTime: string;
}

export const Timeline: React.FC<TimelineProps> = ({ parameters, currentTime }) => {
  const timeBlocks = useMemo(() => generateTimeBlocks(parameters), [parameters]);
  const currentHour = parseInt(currentTime.split(':')[0]);
  const currentMinute = parseInt(currentTime.split(':')[1]);
  const currentPosition = ((currentHour * 60 + currentMinute) / (24 * 60)) * 100;

  const getBlockColor = (type: TimeBlock['type']) => {
    switch (type) {
      case 'macro':
        return 'bg-timeline-macro';
      case 'killzone':
        return 'bg-timeline-killzone';
      case 'premarket':
        return 'bg-timeline-premarket';
      case 'lunch':
        return 'bg-timeline-lunch';
      case 'news':
        return 'bg-trading-red';
      default:
        return 'bg-timeline-inactive';
    }
  };

  const getBlockLabel = (block: TimeBlock) => {
    switch (block.type) {
      case 'macro':
        return `${block.name} Macro`;
      case 'killzone':
        return `${block.name} Killzone`;
      case 'premarket':
        return 'Pre-Market';
      case 'lunch':
        return 'Lunch Break';
      case 'news':
        return `News: ${block.name}`;
      default:
        return 'Inactive';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Trading Timeline</h2>
        <div className="text-sm text-muted-foreground">Beirut Time (GMT+2)</div>
      </div>
      
      {/* Timeline Container */}
      <div className="relative">
        {/* Hour markers */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className="text-center" style={{ minWidth: '3ch' }}>
              {i.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
        
        {/* Timeline track */}
        <div className="relative h-16 bg-secondary rounded-lg overflow-hidden">
          {/* Time blocks */}
          {timeBlocks.map((block, index) => {
            const startMinutes = block.startHour * 60 + block.startMinute;
            const endMinutes = block.endHour * 60 + block.endMinute;
            const left = (startMinutes / (24 * 60)) * 100;
            const width = ((endMinutes - startMinutes) / (24 * 60)) * 100;
            
            return (
              <div
                key={index}
                className={`absolute top-0 h-full ${getBlockColor(block.type)} opacity-80 
                           hover:opacity-100 transition-opacity cursor-pointer group`}
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${getBlockLabel(block)} - ${formatTime(block.startHour, block.startMinute)} to ${formatTime(block.endHour, block.endMinute)}`}
              >
                {/* Block label */}
                {width > 8 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white px-1 bg-black/20 rounded">
                      {block.name}
                    </span>
                  </div>
                )}
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                               px-2 py-1 bg-popover text-popover-foreground text-xs rounded 
                               shadow-lg opacity-0 group-hover:opacity-100 transition-opacity 
                               whitespace-nowrap z-10">
                  {getBlockLabel(block)}
                  <br />
                  {formatTime(block.startHour, block.startMinute)} - {formatTime(block.endHour, block.endMinute)}
                </div>
              </div>
            );
          })}
          
          {/* Current time marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-primary z-20"
            style={{ left: `${currentPosition}%` }}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 
                           w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 
                           px-1 py-0.5 bg-primary text-primary-foreground text-xs rounded 
                           whitespace-nowrap">
              {currentTime}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-timeline-macro rounded"></div>
            <span>ICT Macro</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-timeline-killzone rounded"></div>
            <span>Killzone</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-timeline-premarket rounded"></div>
            <span>Pre-Market</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-timeline-lunch rounded"></div>
            <span>Lunch</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-trading-red rounded"></div>
            <span>News Event</span>
          </div>
        </div>
      </div>
    </div>
  );
};