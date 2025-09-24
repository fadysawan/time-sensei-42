// UpcomingEventsList Component - Single Responsibility: Display list of upcoming events
import React from 'react';
import { Timer } from 'lucide-react';
import { UpcomingEvent } from '../../models';
import { UpcomingEventCard } from './UpcomingEventCard';

interface UpcomingEventsListProps {
  upcomingEvents: UpcomingEvent[];
  maxDisplay?: number;
}

export const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ 
  upcomingEvents, 
  maxDisplay = 6 
}) => {
  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-6">
        <Timer className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-muted-foreground/50 text-xs">No upcoming events</p>
      </div>
    );
  }

  const displayEvents = upcomingEvents.slice(0, maxDisplay);
  const remainingCount = upcomingEvents.length - maxDisplay;

  return (
    <div className="space-y-2">
      {displayEvents.map((event, index) => (
        <UpcomingEventCard 
          key={`upcoming-${index}`}
          event={event} 
          index={index}
          isNext={index === 0}
        />
      ))}
      
      {remainingCount > 0 && (
        <div className="text-center pt-1">
          <span className="text-xs text-muted-foreground/50 bg-muted/30 px-2.5 py-1 rounded-full">
            +{remainingCount} more
          </span>
        </div>
      )}
    </div>
  );
};