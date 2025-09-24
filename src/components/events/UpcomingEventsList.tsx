// UpcomingEventsList Component - Single Responsibility: Display list of upcoming events
import React, { useState } from 'react';
import { Timer, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (upcomingEvents.length === 0) {
    return (
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger className="w-full">
          <div className="text-center py-6 hover:bg-muted/30 rounded-md transition-colors">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                !isCollapsed ? 'rotate-90' : ''
              }`} />
              <Timer className="h-6 w-6 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground/50 text-xs">No upcoming events</p>
          </div>
        </CollapsibleTrigger>
      </Collapsible>
    );
  }

  const displayEvents = upcomingEvents.slice(0, maxDisplay);
  const remainingCount = upcomingEvents.length - maxDisplay;

  return (
    <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
      <div className="space-y-2">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between hover:bg-muted/30 rounded-md px-2 py-1 -mx-2 transition-colors">
            <div className="flex items-center space-x-2">
              <ChevronRight className={`w-3 h-3 transition-transform ${
                !isCollapsed ? 'rotate-90' : ''
              }`} />
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Upcoming Events</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full font-medium">
                {upcomingEvents.length}
              </span>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="space-y-2 pl-6">
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};