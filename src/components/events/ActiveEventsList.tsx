// ActiveEventsList Component - Single Responsibility: Display list of active events
import React, { useState } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ActiveEvent } from '../../models';
import { ActiveEventCard } from './ActiveEventCard';

interface ActiveEventsListProps {
  activeEvents: ActiveEvent[];
}

export const ActiveEventsList: React.FC<ActiveEventsListProps> = ({ activeEvents }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (activeEvents.length === 0) {
    return (
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger className="w-full">
          <div className="p-3 rounded-lg border border-dashed border-border/50 hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${
                  !isCollapsed ? 'rotate-90' : ''
                }`} />
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Active Events</span>
              </div>
              <div className="text-xs text-muted-foreground/60">
                No active trading events
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
      </Collapsible>
    );
  }

  return (
    <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
      <div className="space-y-2">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between hover:bg-muted/30 rounded-md px-2 py-1 -mx-2 transition-colors">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <ChevronRight className={`w-3 h-3 transition-transform ${
                !isCollapsed ? 'rotate-90' : ''
              }`} />
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Events</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-medium">
                {activeEvents.length}
              </span>
            </h4>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="space-y-1.5 pl-6">
            {activeEvents.map((activeEvent, index) => (
              <ActiveEventCard 
                key={`active-${index}`}
                event={activeEvent} 
                index={index} 
              />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};