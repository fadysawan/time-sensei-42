// UpcomingEventCard Component - Single Responsibility: Display individual upcoming event
import React from 'react';
import { UpcomingEvent } from '../../models';
import { CountdownService } from '../../services';
import { EventIcon } from './EventIcon';
import { getEventTypeStyles } from '../../utils/styleUtils';

interface UpcomingEventCardProps {
  event: UpcomingEvent;
  index: number;
  isNext?: boolean;
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({ 
  event, 
  index, 
  isNext = false 
}) => {
  const eventStyles = getEventTypeStyles(event.block.type);
  const countdown = CountdownService.formatCountdownSeconds(event.timeUntilStart);
  const startTime = `${String(event.block.startHour).padStart(2, '0')}:${String(event.block.startMinute).padStart(2, '0')}`;

  return (
    <div 
      key={`upcoming-${index}`}
      className={`p-2.5 rounded-md border transition-all duration-150 hover:shadow-sm ${eventStyles.bg} ${eventStyles.border}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="flex items-center space-x-1.5">
            <EventIcon eventType={event.block.type} size="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <h4 className={`font-medium text-sm truncate ${eventStyles.text}`}>
                {event.block.name}
              </h4>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold uppercase ${eventStyles.badge} flex-shrink-0`}>
                {event.block.type}
              </span>
              {isNext && (
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
};