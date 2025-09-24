// ActiveEventsList Component - Single Responsibility: Display list of active events
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ActiveEvent } from '../../models';
import { ActiveEventCard } from './ActiveEventCard';

interface ActiveEventsListProps {
  activeEvents: ActiveEvent[];
}

export const ActiveEventsList: React.FC<ActiveEventsListProps> = ({ activeEvents }) => {
  if (activeEvents.length === 0) {
    return (
      <div className="p-3 rounded-lg border border-dashed border-border/50 text-center">
        <div className="text-muted-foreground/60 text-xs">
          No active trading events
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>Active Events</span>
        <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-medium">
          {activeEvents.length}
        </span>
      </h4>
      <div className="space-y-1.5">
        {activeEvents.map((activeEvent, index) => (
          <ActiveEventCard 
            key={`active-${index}`}
            event={activeEvent} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};