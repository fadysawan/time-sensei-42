import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Zap, ChevronDown } from 'lucide-react';
import { TradingParameters, getNextMacro, getNextKillzone, getNextNewsEvent, NextEvent } from '../utils/tradingLogic';
import { getBeirutTime, formatCountdownDetailed, formatTime } from '../utils/timeUtils';

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

  if (!event) {
    return (
      <div className="border-b border-border/50 last:border-0">
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-xs font-medium">{title}</span>
          </div>
          <span className="text-xs text-muted-foreground">None today</span>
        </div>
      </div>
    );
  }

  const countdownInfo = formatCountdownDetailed(event.timeUntilMinutes);
  const nextCountdownInfo = nextEvent ? formatCountdownDetailed(nextEvent.timeUntilMinutes) : null;
  
  return (
    <div className="border-b border-border/50 last:border-0">
      <div 
        className="flex items-center justify-between py-1.5 cursor-pointer trading-hover rounded-md px-2 -mx-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {icon}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium truncate">{event.name}</span>
              {event.impact && (
                <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                  event.impact === 'high' ? 'bg-red-400' : 
                  event.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`} />
              )}
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
          <div className={`text-xs font-mono ${
            countdownInfo.isUrgent ? 'countdown-urgent' : 
            countdownInfo.isSoon ? 'countdown-soon' : 'countdown-normal'
          }`}>
            {countdownInfo.display}
          </div>
          {nextEvent && nextCountdownInfo && (
            <div className="text-xs font-mono text-muted-foreground/60">
              +{nextCountdownInfo.display}
            </div>
          )}
        </div>
      </div>

      {isExpanded && futureEvents.length > 0 && (
        <div className="pb-2 pl-6 pr-2">
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
  const getNextAfter = (currentEvent: NextEvent | null, events: any[], timeField: string = 'start'): NextEvent | null => {
    if (!currentEvent) return null;
    
    const currentEventTime = currentEvent.timeUntilMinutes;
    return events
      .map(event => {
        const time = timeField === 'start' ? event.start : event.time;
        const startTime = time.hours * 60 + time.minutes;
        const timeUntil = startTime - (new Date().getHours() * 60 + new Date().getMinutes());
        
        return {
          name: event.name,
          startTime: time,
          timeUntilMinutes: timeUntil > 0 ? timeUntil : timeUntil + 24 * 60,
          region: event.region,
          impact: event.impact
        };
      })
      .filter(event => event.timeUntilMinutes > currentEventTime)
      .sort((a, b) => a.timeUntilMinutes - b.timeUntilMinutes)[0] || null;
  };

  // Get future events of specific type
  const getFutureEventsOfType = (currentEvent: NextEvent | null, events: any[], timeField: string = 'start'): NextEvent[] => {
    if (!currentEvent) return [];
    
    const currentEventTime = currentEvent.timeUntilMinutes;
    return events
      .map(event => {
        const time = timeField === 'start' ? event.start : event.time;
        const startTime = time.hours * 60 + time.minutes;
        const timeUntil = startTime - (new Date().getHours() * 60 + new Date().getMinutes());
        
        return {
          name: event.name,
          startTime: time,
          timeUntilMinutes: timeUntil > 0 ? timeUntil : timeUntil + 24 * 60,
          region: event.region,
          impact: event.impact
        };
      })
      .filter(event => event.timeUntilMinutes > currentEventTime)
      .sort((a, b) => a.timeUntilMinutes - b.timeUntilMinutes);
  };

  useEffect(() => {
    const updateNextEvents = () => {
      const beirutTime = getBeirutTime();
      
      const macro = getNextMacro(beirutTime.hours, beirutTime.minutes, parameters);
      const killzone = getNextKillzone(beirutTime.hours, beirutTime.minutes, parameters);
      const newsEvent = getNextNewsEvent(beirutTime.hours, beirutTime.minutes, parameters);
      
      setNextMacro(macro);
      setNextKillzone(killzone);
      setNextNewsEvent(newsEvent);
      
      // Get next occurrence after current
      setNextMacroAfter(getNextAfter(macro, parameters.macros, 'start'));
      setNextKillzoneAfter(getNextAfter(killzone, parameters.killzones, 'start'));
      setNextNewsEventAfter(getNextAfter(newsEvent, parameters.newsEvents, 'time'));
      
      // Get future events for each type
      setFutureMacros(getFutureEventsOfType(macro, parameters.macros, 'start'));
      setFutureKillzones(getFutureEventsOfType(killzone, parameters.killzones, 'start'));
      setFutureNewsEvents(getFutureEventsOfType(newsEvent, parameters.newsEvents, 'time'));
    };

    // Update immediately
    updateNextEvents();
    
    // Update every second for real-time countdown
    const interval = setInterval(updateNextEvents, 1000);
    
    return () => clearInterval(interval);
  }, [parameters]);

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