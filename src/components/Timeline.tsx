import React, { useMemo } from 'react';
import { TradingParameters, TimeBlock, generateTimeBlocks } from '../utils/tradingLogic';
import { formatTime, convertUTCToUserTimezone, getTimezoneAbbreviation, calculateDuration } from '../utils/timeUtils';

interface TimelineProps {
  parameters: TradingParameters;
  currentTime: string;
}

export const Timeline: React.FC<TimelineProps> = ({ parameters, currentTime }) => {
  const timeBlocks = useMemo(() => generateTimeBlocks(parameters), [parameters]);
  const currentHour = parseInt(currentTime.split(':')[0]);
  const currentMinute = parseInt(currentTime.split(':')[1]);
  const currentPosition = ((currentHour * 60 + currentMinute) / (24 * 60)) * 100;

  // Helper function to render timeline blocks, handling overnight ranges
  const renderTimelineBlocks = (blocks: TimeBlock[], blockType: string) => {
    return blocks.map((block, index) => {
      // Convert UTC times to user timezone for positioning
      const startTime = convertUTCToUserTimezone(block.startHour, block.startMinute, parameters.userTimezone);
      const endTime = convertUTCToUserTimezone(block.endHour, block.endMinute, parameters.userTimezone);
      
      const startMinutes = startTime.hours * 60 + startTime.minutes;
      const endMinutes = endTime.hours * 60 + endTime.minutes;
      const isOvernight = endMinutes < startMinutes;
      
      if (isOvernight) {
        // Split overnight block into two parts
        const firstPartEnd = 24 * 60; // End of day
        const secondPartStart = 0; // Start of next day
        const secondPartEnd = endMinutes;
        
        const firstPartLeft = (startMinutes / (24 * 60)) * 100;
        const firstPartWidth = ((firstPartEnd - startMinutes) / (24 * 60)) * 100;
        const secondPartLeft = 0;
        const secondPartWidth = (secondPartEnd / (24 * 60)) * 100;
        
        return (
          <React.Fragment key={`${blockType}-${index}`}>
            {/* First part: from start to end of day */}
            <div
              className={`absolute top-0 h-full ${getBlockColor(block.type)} opacity-90 
                         hover:opacity-100 transition-all duration-200 cursor-pointer group rounded-sm
                         hover:scale-105 hover:z-10`}
              style={{ left: `${firstPartLeft}%`, width: `${firstPartWidth}%` }}
            >
              {firstPartWidth > 6 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white px-1 bg-black/30 rounded truncate">
                    {block.name}
                  </span>
                </div>
              )}
              
              {/* Enhanced tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                             px-3 py-2 bg-background border border-border text-xs rounded-lg
                             shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                             whitespace-nowrap z-[99999] pointer-events-none
                             min-w-max">
                <div className="font-bold text-yellow-400 mb-1 text-sm">{block.name}</div>
                <div className="text-xs text-muted-foreground/80 mb-1">{getBlockLabel(block)}</div>
                <div className="text-muted-foreground">
                  {(() => {
                    const startTime = convertUTCToUserTimezone(block.startHour, block.startMinute, parameters.userTimezone);
                    const endTime = convertUTCToUserTimezone(block.endHour, block.endMinute, parameters.userTimezone);
                    return `${formatTime(startTime.hours, startTime.minutes)} - ${formatTime(endTime.hours, endTime.minutes)} (${getTimezoneAbbreviation(parameters.userTimezone)})`;
                  })()}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  Duration: {Math.round(calculateDuration({ hours: block.startHour, minutes: block.startMinute }, { hours: block.endHour, minutes: block.endMinute }) / 60 * 10) / 10}h
                </div>
                <div className="text-xs text-component-purple mt-1">
                  High Probability Zone
                </div>
                
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                               w-2 h-2 bg-background border-r border-b border-border/50 rotate-45"></div>
              </div>
            </div>
            
            {/* Second part: from start of next day to end */}
            <div
              className={`absolute top-0 h-full ${getBlockColor(block.type)} opacity-90 
                         hover:opacity-100 transition-all duration-200 cursor-pointer group rounded-sm
                         hover:scale-105 hover:z-10`}
              style={{ left: `${secondPartLeft}%`, width: `${secondPartWidth}%` }}
            >
              {secondPartWidth > 6 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white px-1 bg-black/30 rounded truncate">
                    {block.name}
                  </span>
                </div>
              )}
              
              {/* Enhanced tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                             px-3 py-2 bg-background border border-border text-xs rounded-lg
                             shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                             whitespace-nowrap z-[99999] pointer-events-none
                             min-w-max">
                <div className="font-bold text-yellow-400 mb-1 text-sm">{block.name}</div>
                <div className="text-xs text-muted-foreground/80 mb-1">{getBlockLabel(block)}</div>
                <div className="text-muted-foreground">
                  {(() => {
                    const startTime = convertUTCToUserTimezone(block.startHour, block.startMinute, parameters.userTimezone);
                    const endTime = convertUTCToUserTimezone(block.endHour, block.endMinute, parameters.userTimezone);
                    return `${formatTime(startTime.hours, startTime.minutes)} - ${formatTime(endTime.hours, endTime.minutes)} (${getTimezoneAbbreviation(parameters.userTimezone)})`;
                  })()}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  Duration: {Math.round(calculateDuration({ hours: block.startHour, minutes: block.startMinute }, { hours: block.endHour, minutes: block.endMinute }) / 60 * 10) / 10}h
                </div>
                <div className="text-xs text-component-purple mt-1">
                  High Probability Zone
                </div>
                
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                               w-2 h-2 bg-background border-r border-b border-border/50 rotate-45"></div>
              </div>
            </div>
          </React.Fragment>
        );
      } else {
        // Normal same-day block
        const left = (startMinutes / (24 * 60)) * 100;
        const durationMinutes = calculateDuration({ hours: startTime.hours, minutes: startTime.minutes }, { hours: endTime.hours, minutes: endTime.minutes });
        const width = (durationMinutes / (24 * 60)) * 100;
        
        return (
          <div
            key={`${blockType}-${index}`}
            className={`absolute top-0 h-full ${getBlockColor(block.type)} opacity-90 
                       hover:opacity-100 transition-all duration-200 cursor-pointer group rounded-sm
                       hover:scale-105 hover:z-10`}
            style={{ left: `${left}%`, width: `${width}%` }}
          >
            {width > 6 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white px-1 bg-black/30 rounded truncate">
                  {block.name}
                </span>
              </div>
            )}
            
            {/* Enhanced tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                           px-3 py-2 bg-background border border-border text-xs rounded-lg
                           shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                           whitespace-nowrap z-[99999] pointer-events-none
                           min-w-max">
              <div className="font-bold text-yellow-400 mb-1 text-sm">{block.name}</div>
              <div className="text-xs text-muted-foreground/80 mb-1">{getBlockLabel(block)}</div>
              <div className="text-muted-foreground">
                {(() => {
                  const startTime = convertUTCToUserTimezone(block.startHour, block.startMinute, parameters.userTimezone);
                  const endTime = convertUTCToUserTimezone(block.endHour, block.endMinute, parameters.userTimezone);
                  return `${formatTime(startTime.hours, startTime.minutes)} - ${formatTime(endTime.hours, endTime.minutes)} (${getTimezoneAbbreviation(parameters.userTimezone)})`;
                })()}
              </div>
              <div className="text-xs text-muted-foreground/70 mt-1">
                Duration: {Math.round(calculateDuration({ hours: block.startHour, minutes: block.startMinute }, { hours: block.endHour, minutes: block.endMinute }) / 60 * 10) / 10}h
              </div>
              <div className="text-xs text-purple-400 mt-1">
                High Probability Zone
              </div>
              
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                             w-2 h-2 bg-background border-r border-b border-border/50 rotate-45"></div>
            </div>
          </div>
        );
      }
    });
  };

  const getBlockColor = (type: TimeBlock['type']) => {
    switch (type) {
      case 'macro':
        return 'timeline-macro';
      case 'killzone':
        return 'timeline-killzone';
      case 'premarket':
        return 'bg-component-yellow';
      case 'market-open':
        return 'bg-component-green';
      case 'lunch':
        return 'bg-component-red';
      case 'after-hours':
        return 'bg-component-blue';
      case 'custom':
        return 'bg-component-teal';
      case 'news':
        return 'timeline-news';
      default:
        return 'timeline-inactive';
    }
  };

  const getBlockLabel = (block: TimeBlock) => {
    switch (block.type) {
      case 'macro':
        return `${block.name} Macro`;
      case 'killzone':
        return `${block.name} Killzone`;
      case 'premarket':
        return 'Pre-Market Session';
      case 'market-open':
        return 'Market Open Session';
      case 'lunch':
        return 'Lunch Break Session';
      case 'after-hours':
        return 'After Hours Session';
      case 'custom':
        return `Custom Session: ${block.name}`;
      case 'news':
        return `News: ${block.name}`;
      default:
        return 'Inactive';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-component-blue">Trading Timeline</h2>
      </div>
      
      {/* Timeline Container with enhanced styling */}
      <div className="trading-card p-4 pt-4 overflow-visible">
        {/* Hour markers */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2 mt-2 overflow-x-hidden ml-20">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className="text-center" style={{ minWidth: '3ch' }}>
              {i.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
        
        {/* Timeline tracks */}
        <div className="relative space-y-3 overflow-visible mt-4 ml-20">
          {/* Track labels sidebar */}
          <div className="absolute -left-20 top-0 space-y-3 w-16">
            <div className="h-8 flex items-center justify-end">
            <span className="text-xs font-medium text-component-purple">Killzones</span>
          </div>
          <div className="h-8 flex items-center justify-end">
            <span className="text-xs font-medium text-component-blue">Macros</span>
          </div>
          <div className="h-8 flex items-center justify-end">
            <span className="text-xs font-medium text-component-orange">News</span>
            </div>
            <div className="h-8 flex items-center justify-end">
              <span className="text-xs font-medium text-component-yellow">Sessions</span>
            </div>
          </div>
          {/* Current time marker - positioned to use the space above timeline */}
          <div
            className="absolute -top-12 bottom-0 w-0.5 z-50 pointer-events-none"
            style={{ 
              left: `${currentPosition}%`,
              background: 'linear-gradient(to bottom, hsl(var(--component-blue)), hsl(var(--component-blue)))'
            }}
          >
            {/* Time indicator dot */}
            <div 
              className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 shadow-lg"
              style={{
                backgroundColor: 'hsl(var(--component-blue))',
                borderColor: 'hsl(var(--background))',
                boxShadow: '0 0 0 2px hsl(var(--component-blue) / 0.3)'
              }}
            ></div>
            
            {/* Time display label - positioned in the space above */}
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 px-3 py-1.5 text-white text-xs rounded-lg whitespace-nowrap shadow-xl font-medium"
              style={{
                background: 'linear-gradient(to right, hsl(var(--component-blue)), hsl(var(--component-blue)))',
                border: '1px solid hsl(var(--component-blue) / 0.3)'
              }}
            >
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-75"></div>
                <span>{currentTime}</span>
              </div>
              {/* Elegant arrow pointer */}
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-0.5 w-2 h-2 rotate-45 border-r border-b"
                style={{
                  backgroundColor: 'hsl(var(--component-blue))',
                  borderColor: 'hsl(var(--component-blue) / 0.3)'
                }}
              ></div>
            </div>
          </div>
          {/* Killzones track */}
          <div className="relative h-8 bg-secondary/30 rounded-md border border-border/30 overflow-visible">
            {renderTimelineBlocks(timeBlocks.filter(block => block.type === 'killzone'), 'killzone')}
          </div>

          {/* Macros track */}
          <div className="relative h-8 bg-secondary/30 rounded-md border border-border/30 overflow-visible">
            {renderTimelineBlocks(timeBlocks.filter(block => block.type === 'macro'), 'macro')}
          </div>

          {/* News Events track */}
          <div className="relative h-8 bg-secondary/30 rounded-md border border-border/30 overflow-visible">
            {renderTimelineBlocks(timeBlocks.filter(block => block.type === 'news'), 'news')}
          </div>

          {/* Market Sessions track (All types) */}
          <div className="relative h-8 bg-secondary/30 rounded-md border border-border/30 overflow-visible">
            {renderTimelineBlocks(timeBlocks.filter(block => ['premarket', 'market-open', 'lunch', 'after-hours', 'custom'].includes(block.type)), 'session')}
          </div>
        </div>
        

      </div>
    </div>
  );
};