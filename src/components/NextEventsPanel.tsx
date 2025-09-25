import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Calendar, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TradingParameters } from '../models';
import { getNextMacro, getNextKillzone, getNextNewsEvent, NextEvent } from '../utils/tradingLogic';
import { getBeirutTime, formatCountdownDetailed, formatTime, convertUTCToUserTimezone, getUTCTime } from '../utils/timeUtils';

interface NextEventsPanelProps {
  parameters: TradingParameters;
}

interface CompactEventProps {
  title: string;
  icon: React.ReactNode;
  event: NextEvent | null;
  nextEvent: NextEvent | null;
  futureEvents: NextEvent[];
  color: string;
  parameters: TradingParameters;
}

const CompactEvent: React.FC<CompactEventProps> = ({ title, icon, event, nextEvent, futureEvents, color, parameters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!event) {
    return (
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <div className="border-b border-border/50 last:border-0">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between py-1.5 hover:bg-muted/30 rounded-md px-2 -mx-2 transition-colors">
              <div className="flex items-center space-x-2">
                <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${
                  !isCollapsed ? 'rotate-90' : ''
                }`} />
                {icon}
                <span className="text-xs font-medium">{title}</span>
              </div>
              <span className="text-xs text-muted-foreground">None today</span>
            </div>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    );
  }

  const countdownInfo = formatCountdownDetailed(event.timeUntilMinutes);
  const nextCountdownInfo = nextEvent ? formatCountdownDetailed(nextEvent.timeUntilMinutes) : null;
  
  return (
    <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
      <div className="border-b border-border/50 last:border-0">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between py-1.5 hover:bg-muted/30 rounded-md px-2 -mx-2 transition-colors">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${
                !isCollapsed ? 'rotate-90' : ''
              }`} />
              {icon}
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1 text-left">
                  <span className="text-xs font-medium truncate">{title}</span>
                  {event.impact && (
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                      event.impact === 'high' ? 'bg-red-400' : 
                      event.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                  )}
                </div>
                <div className="text-xs text-muted-foreground text-left">
                  {event.name}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`text-xs font-mono ${
                countdownInfo.isUrgent ? 'countdown-urgent' : 
                countdownInfo.isSoon ? 'countdown-soon' : 'countdown-normal'
              }`}>
                {countdownInfo.display}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="pb-2 pl-6 pr-2">
            <div 
              className="flex items-center justify-between py-1 cursor-pointer trading-hover rounded-md px-2 -mx-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium truncate">{event.name}</span>
                    {futureEvents.length > 0 && (
                      <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(event.startTime.hours, event.startTime.minutes)}
                    {event.region && ` • ${event.region}`}
                    {nextEvent && (
                      <span className="ml-1 text-blue-400/70">
                        • Next: {formatTime(nextEvent.startTime.hours, nextEvent.startTime.minutes)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {nextEvent && nextCountdownInfo && (
                  <div className="text-xs font-mono text-muted-foreground/60">
                    +{nextCountdownInfo.display}
                  </div>
                )}
              </div>
            </div>

            {isExpanded && futureEvents.length > 0 && (
              <div className="mt-2 pl-4">
                <div className="text-xs font-medium text-blue-400/80 mb-1">Upcoming {title}s</div>
                <div className="space-y-1">
                  {futureEvents.slice(0, 4).map((futureEvent, index) => {
                    const futureCountdownInfo = formatCountdownDetailed(futureEvent.timeUntilMinutes);
                    
                    return (
                      <div key={index} className="flex items-center justify-between py-0.5 trading-hover rounded px-2 -mx-2">
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <span className="text-xs truncate">{futureEvent.name}</span>
                          {futureEvent.impact && (
                            <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                              futureEvent.impact === 'high' ? 'bg-red-400' : 
                              futureEvent.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`} />
                          )}
                          <span className="text-xs text-muted-foreground">
                            • {formatTime(futureEvent.startTime.hours, futureEvent.startTime.minutes)}
                          </span>
                        </div>
                        <div className={`text-xs font-mono ml-2 ${
                          futureCountdownInfo.isUrgent ? 'text-red-400' : 
                          futureCountdownInfo.isSoon ? 'text-yellow-400' : 'text-muted-foreground'
                        }`}>
                          {futureCountdownInfo.display}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export const NextEventsPanel: React.FC<NextEventsPanelProps> = ({ parameters }) => {
  const [nextMacro, setNextMacro] = useState<NextEvent | null>(null);
  const [nextKillzone, setNextKillzone] = useState<NextEvent | null>(null);
  const [nextNewsEvent, setNextNewsEvent] = useState<NextEvent | null>(null);
  
  const [nextMacroAfter, setNextMacroAfter] = useState<NextEvent | null>(null);
  const [nextKillzoneAfter, setNextKillzoneAfter] = useState<NextEvent | null>(null);
  const [nextNewsEventAfter, setNextNewsEventAfter] = useState<NextEvent | null>(null);
  
  const [futureMacros, setFutureMacros] = useState<NextEvent[]>([]);
  const [futureKillzones, setFutureKillzones] = useState<NextEvent[]>([]);
  const [futureNewsEvents, setFutureNewsEvents] = useState<NextEvent[]>([]);

  // Get next occurrence after the immediate next event
  const getNextAfter = useCallback((currentEvent: NextEvent | null, events: (MacroSession | KillzoneSession | NewsInstance)[], timeField: string = 'start'): NextEvent | null => {
    if (!currentEvent) return null;
    
    const currentEventTime = currentEvent.timeUntilMinutes;
    const utcTime = getUTCTime();
    
    return events
      .map(event => {
        const time = timeField === 'start' ? event.start : event.time;
        const startTime = time.hours * 60 + time.minutes;
        const timeUntil = startTime - (utcTime.hours * 60 + utcTime.minutes);
        
        // Convert UTC time to user timezone for display
        const userTime = convertUTCToUserTimezone(time.hours, time.minutes, parameters.userTimezone);
        
        return {
          name: event.name,
          startTime: userTime,
          timeUntilMinutes: timeUntil > 0 ? timeUntil : timeUntil + 24 * 60,
          region: event.region,
          impact: event.impact
        };
      })
      .filter(event => event.timeUntilMinutes > currentEventTime)
      .sort((a, b) => a.timeUntilMinutes - b.timeUntilMinutes)[0] || null;
  }, [parameters.userTimezone]);

  // Get future events of specific type
  const getFutureEventsOfType = useCallback((currentEvent: NextEvent | null, events: (MacroSession | KillzoneSession | NewsInstance)[], timeField: string = 'start'): NextEvent[] => {
    if (!currentEvent) return [];
    
    const currentEventTime = currentEvent.timeUntilMinutes;
    const utcTime = getUTCTime();
    
    return events
      .map(event => {
        const time = timeField === 'start' ? event.start : event.time;
        const startTime = time.hours * 60 + time.minutes;
        const timeUntil = startTime - (utcTime.hours * 60 + utcTime.minutes);
        
        // Convert UTC time to user timezone for display
        const userTime = convertUTCToUserTimezone(time.hours, time.minutes, parameters.userTimezone);
        
        return {
          name: event.name,
          startTime: userTime,
          timeUntilMinutes: timeUntil > 0 ? timeUntil : timeUntil + 24 * 60,
          region: event.region,
          impact: event.impact
        };
      })
      .filter(event => event.timeUntilMinutes > currentEventTime)
      .sort((a, b) => a.timeUntilMinutes - b.timeUntilMinutes);
  }, [parameters.userTimezone]);

  useEffect(() => {
    const updateNextEvents = () => {
      const utcTime = getUTCTime();
      
      const macro = getNextMacro(utcTime.hours, utcTime.minutes, parameters);
      const killzone = getNextKillzone(utcTime.hours, utcTime.minutes, parameters);
      const newsEvent = getNextNewsEvent(utcTime.hours, utcTime.minutes, parameters);
      
      // Convert event times to user timezone for display
      const convertEventToUserTimezone = (event: NextEvent | null): NextEvent | null => {
        if (!event) return null;
        const userTime = convertUTCToUserTimezone(event.startTime.hours, event.startTime.minutes, parameters.userTimezone);
        return {
          ...event,
          startTime: userTime
        };
      };
      
      setNextMacro(convertEventToUserTimezone(macro));
      setNextKillzone(convertEventToUserTimezone(killzone));
      setNextNewsEvent(convertEventToUserTimezone(newsEvent));
      
      // Get next occurrence after current
      setNextMacroAfter(getNextAfter(macro, parameters.macros, 'start'));
      setNextKillzoneAfter(getNextAfter(killzone, parameters.killzones, 'start'));
      setNextNewsEventAfter(getNextAfter(newsEvent, parameters.newsInstances, 'scheduledTime'));
      
      // Get future events for each type
      setFutureMacros(getFutureEventsOfType(macro, parameters.macros, 'start'));
      setFutureKillzones(getFutureEventsOfType(killzone, parameters.killzones, 'start'));
      setFutureNewsEvents(getFutureEventsOfType(newsEvent, parameters.newsInstances, 'scheduledTime'));
    };

    // Update immediately
    updateNextEvents();
    
    // Update every second for real-time countdown
    const interval = setInterval(updateNextEvents, 1000);
    
    return () => clearInterval(interval);
  }, [parameters, getNextAfter, getFutureEventsOfType]);

  return (
    <div className="trading-card p-4 trading-hover">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-blue-400">Upcoming Events</h2>
      </div>
      
      <div className="space-y-0">
        <CompactEvent
          title="Next Macro"
          icon={<TrendingUp className="h-3 w-3 text-blue-400" />}
          event={nextMacro}
          nextEvent={nextMacroAfter}
          futureEvents={futureMacros}
          color="blue"
          parameters={parameters}
        />
        
        <CompactEvent
          title="Next Killzone"
          icon={<Zap className="h-3 w-3 text-purple-400" />}
          event={nextKillzone}
          nextEvent={nextKillzoneAfter}
          futureEvents={futureKillzones}
          color="purple"
          parameters={parameters}
        />
        
        <CompactEvent
          title="Next News Event"
          icon={<Calendar className="h-3 w-3 text-orange-400" />}
          event={nextNewsEvent}
          nextEvent={nextNewsEventAfter}
          futureEvents={futureNewsEvents}
          color="orange"
          parameters={parameters}
        />
      </div>
    </div>
  );
};