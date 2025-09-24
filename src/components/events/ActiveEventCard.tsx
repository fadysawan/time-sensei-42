// ActiveEventCard Component - Single Responsibility: Display individual active event
import React from 'react';
import { ActiveEvent } from '../../models';
import { CountdownService } from '../../services';
import { EventIcon } from './EventIcon';
import { getEventTypeStyles } from '../../utils/styleUtils';

interface ActiveEventCardProps {
  event: ActiveEvent;
  index: number;
}

export const ActiveEventCard: React.FC<ActiveEventCardProps> = ({ event, index }) => {
  const eventStyles = getEventTypeStyles(event.block.type);
  const eventCountdown = CountdownService.formatCountdownSeconds(event.timeLeft);

  return (
    <div 
      key={`active-${index}`} 
      className={`p-2.5 rounded-md border ${eventStyles.bg} ${eventStyles.border} bg-gradient-to-r from-green-500/5 to-transparent`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <EventIcon eventType={event.block.type} size="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`font-medium text-sm ${eventStyles.text}`}>
              {event.block.name}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold uppercase ${eventStyles.badge}`}>
              {event.block.type}
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
};