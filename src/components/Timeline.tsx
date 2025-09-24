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
        return 'timeline-macro';
      case 'killzone':
        return 'timeline-killzone';
      case 'premarket':
        return 'bg-yellow-400';
      case 'lunch':
        return 'bg-red-400';
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
        <h2 className="text-lg font-semibold text-blue-400">Trading Timeline</h2>
      </div>
      
      {/* Timeline Container with enhanced styling */}
      <div className="trading-card p-4">
        {/* Hour markers */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2 mt-8">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className="text-center" style={{ minWidth: '3ch' }}>
              {i.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
        
        {/* Timeline tracks */}
        <div className="relative space-y-3 overflow-visible mt-4">
          {/* Current time marker - positioned to use the space above timeline */}
          <div
            className="absolute -top-12 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-blue-600 z-40 pointer-events-none"
            style={{ left: `${currentPosition}%` }}
          >
            {/* Time indicator dot */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 
                           w-4 h-4 bg-blue-400 rounded-full border-2 border-background shadow-lg
                           ring-2 ring-blue-400/30"></div>
            
            {/* Time display label - positioned in the space above */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 
                           px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg
                           whitespace-nowrap shadow-xl font-medium border border-blue-400/30">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-75"></div>
                <span>{currentTime}</span>
              </div>
              {/* Elegant arrow pointer */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-0.5
                             w-2 h-2 bg-blue-500 rotate-45 border-r border-b border-blue-400/30"></div>
            </div>
          </div>
          {/* Killzones track */}
          <div className="relative h-8 bg-secondary/30 rounded-md border border-border/30 overflow-visible">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-purple-400">
              Killzones
            </div>
            {timeBlocks
              .filter(block => block.type === 'killzone')
              .map((block, index) => {
                const startMinutes = block.startHour * 60 + block.startMinute;
                const endMinutes = block.endHour * 60 + block.endMinute;
                const left = (startMinutes / (24 * 60)) * 100;
                const width = ((endMinutes - startMinutes) / (24 * 60)) * 100;
                
                return (
                  <div
                    key={`killzone-${index}`}
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
                                   px-3 py-2 glass-effect trading-card text-xs rounded-lg
                                   shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                                   whitespace-nowrap z-[9999] border border-border/50 pointer-events-none">
                      <div className="font-bold text-purple-400 mb-1 text-sm">{block.name}</div>
                      <div className="text-xs text-muted-foreground/80 mb-1">{getBlockLabel(block)}</div>
                      <div className="text-muted-foreground">
                        {formatTime(block.startHour, block.startMinute)} - {formatTime(block.endHour, block.endMinute)}
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        Duration: {Math.round(((block.endHour * 60 + block.endMinute) - (block.startHour * 60 + block.startMinute)) / 60 * 10) / 10}h
                      </div>
                      <div className="text-xs text-purple-400 mt-1">
                        High Probability Zone
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                                     w-2 h-2 bg-card border-r border-b border-border/50 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Macros track */}
          <div className="relative h-8 bg-secondary/30 rounded-md border border-border/30 overflow-visible">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-400">
              Macros
            </div>
            {timeBlocks
              .filter(block => block.type === 'macro')
              .map((block, index) => {
                const startMinutes = block.startHour * 60 + block.startMinute;
                const endMinutes = block.endHour * 60 + block.endMinute;
                const left = (startMinutes / (24 * 60)) * 100;
                const width = ((endMinutes - startMinutes) / (24 * 60)) * 100;
                
                return (
                  <div
                    key={`macro-${index}`}
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
                                   px-3 py-2 glass-effect trading-card text-xs rounded-lg
                                   shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                                   whitespace-nowrap z-[9999] border border-border/50 pointer-events-none">
                      <div className="font-bold text-blue-400 mb-1 text-sm">{block.name}</div>
                      <div className="text-xs text-muted-foreground/80 mb-1">{getBlockLabel(block)}</div>
                      <div className="text-muted-foreground">
                        {formatTime(block.startHour, block.startMinute)} - {formatTime(block.endHour, block.endMinute)}
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        Duration: {Math.round(((block.endHour * 60 + block.endMinute) - (block.startHour * 60 + block.startMinute)) / 60 * 10) / 10}h
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                                     w-2 h-2 bg-card border-r border-b border-border/50 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* News Events track */}
          <div className="relative h-8 bg-secondary/30 rounded-md border border-border/30 overflow-visible">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-orange-400">
              News Events
            </div>
            {timeBlocks
              .filter(block => block.type === 'news')
              .map((block, index) => {
                const startMinutes = block.startHour * 60 + block.startMinute;
                const endMinutes = block.endHour * 60 + block.endMinute;
                const left = (startMinutes / (24 * 60)) * 100;
                const width = ((endMinutes - startMinutes) / (24 * 60)) * 100;
                
                return (
                  <div
                    key={`news-${index}`}
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
                                   px-3 py-2 glass-effect trading-card text-xs rounded-lg
                                   shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                                   whitespace-nowrap z-[9999] border border-border/50 pointer-events-none">
                      <div className="font-bold text-orange-400 mb-1 text-sm">{block.name}</div>
                      <div className="text-xs text-muted-foreground/80 mb-1">{getBlockLabel(block)}</div>
                      <div className="text-muted-foreground">
                        {formatTime(block.startHour, block.startMinute)} - {formatTime(block.endHour, block.endMinute)}
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        Duration: {Math.round(((block.endHour * 60 + block.endMinute) - (block.startHour * 60 + block.startMinute)) / 60 * 10) / 10}h
                      </div>
                      <div className="text-xs text-orange-400 mt-1">
                        High Impact Event
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                                     w-2 h-2 bg-card border-r border-b border-border/50 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Sessions track (Premarket & Lunch) */}
          <div className="relative h-8 bg-secondary/30 rounded-md border border-border/30 overflow-visible">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-yellow-400">
              Sessions
            </div>
            {timeBlocks
              .filter(block => ['premarket', 'lunch'].includes(block.type))
              .map((block, index) => {
                const startMinutes = block.startHour * 60 + block.startMinute;
                const endMinutes = block.endHour * 60 + block.endMinute;
                const left = (startMinutes / (24 * 60)) * 100;
                const width = ((endMinutes - startMinutes) / (24 * 60)) * 100;
                
                return (
                  <div
                    key={`session-${index}`}
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
                                   px-3 py-2 glass-effect trading-card text-xs rounded-lg
                                   shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                                   whitespace-nowrap z-[9999] border border-border/50 pointer-events-none">
                      <div className="font-bold text-yellow-400 mb-1 text-sm">{block.name}</div>
                      <div className="text-xs text-muted-foreground/80 mb-1">{getBlockLabel(block)}</div>
                      <div className="text-muted-foreground">
                        {formatTime(block.startHour, block.startMinute)} - {formatTime(block.endHour, block.endMinute)}
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        Duration: {Math.round(((block.endHour * 60 + block.endMinute) - (block.startHour * 60 + block.startMinute)) / 60 * 10) / 10}h
                      </div>
                      {block.type === 'premarket' && (
                        <div className="text-xs text-green-400 mt-1">
                          Lower Volume Period
                        </div>
                      )}
                      {block.type === 'lunch' && (
                        <div className="text-xs text-yellow-400 mt-1">
                          Market Consolidation
                        </div>
                      )}
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                                     w-2 h-2 bg-card border-r border-b border-border/50 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        

      </div>
    </div>
  );
};