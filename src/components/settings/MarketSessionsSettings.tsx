import React, { useState } from 'react';
import { MarketSession, TimeRange } from '../../utils/tradingLogic';
import { convertUTCToUserTimezone, formatTime, getTimezoneAbbreviation, calculateDuration } from '../../utils/timeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TimezoneAwareTimePicker } from '@/components/ui/timezone-aware-time-picker';
import { Plus, Trash2, Clock, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';

interface MarketSessionsSettingsProps {
  marketSessions: MarketSession[];
  onSessionsChange: (sessions: MarketSession[]) => void;
  userTimezone: string;
}

export const MarketSessionsSettings: React.FC<MarketSessionsSettingsProps> = ({
  marketSessions,
  onSessionsChange,
  userTimezone
}) => {
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionType, setNewSessionType] = useState<'custom'>('custom');
  const [newSessionStart, setNewSessionStart] = useState<TimeRange>({ hours: 9, minutes: 0 });
  const [newSessionEnd, setNewSessionEnd] = useState<TimeRange>({ hours: 17, minutes: 0 });
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  // Helper function to generate unique ID
  const generateId = () => {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Toggle expand/collapse function
  const toggleSessionExpand = (id: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSessions(newExpanded);
  };

  // Add new session
  const handleAddSession = () => {
    if (!newSessionName.trim()) return;

    const newSession: MarketSession = {
      id: generateId(),
      name: newSessionName.trim(),
      start: { ...newSessionStart },
      end: { ...newSessionEnd },
      type: newSessionType,
      isActive: true
    };

    const updatedSessions = [...marketSessions, newSession];
    onSessionsChange(updatedSessions);

    // Reset form
    setNewSessionName('');
    setNewSessionStart({ hours: 9, minutes: 0 });
    setNewSessionEnd({ hours: 17, minutes: 0 });
  };

  // Remove session
  const handleRemoveSession = (sessionId: string) => {
    const updatedSessions = marketSessions.filter(session => session.id !== sessionId);
    onSessionsChange(updatedSessions);
  };

  // Toggle session active state
  const handleToggleActive = (sessionId: string) => {
    const updatedSessions = marketSessions.map(session =>
      session.id === sessionId
        ? { ...session, isActive: !session.isActive }
        : session
    );
    onSessionsChange(updatedSessions);
  };

  // Update session time
  const handleSessionTimeChange = (sessionId: string, field: 'start' | 'end', time: TimeRange) => {
    const updatedSessions = marketSessions.map(session =>
      session.id === sessionId
        ? { ...session, [field]: time }
        : session
    );
    onSessionsChange(updatedSessions);
  };

  // Update session name
  const handleSessionNameChange = (sessionId: string, name: string) => {
    const updatedSessions = marketSessions.map(session =>
      session.id === sessionId
        ? { ...session, name }
        : session
    );
    onSessionsChange(updatedSessions);
  };

  // Get session type color
  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'premarket':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'market-open':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'lunch':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'after-hours':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'custom':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  // Sort sessions by start time
  const sortedSessions = [...marketSessions].sort((a, b) => {
    const aTime = a.start.hours * 60 + a.start.minutes;
    const bTime = b.start.hours * 60 + b.start.minutes;
    return aTime - bTime;
  });

  return (
    <div className="space-y-6">
      {/* Add New Session */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="text-sm font-medium text-cyan-400 flex items-center space-x-2 mb-4">
          <Plus className="h-4 w-4" />
          <span>Add New Market Session</span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-name">Session Name</Label>
              <Input
                id="session-name"
                placeholder="e.g., Asian Session"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-type">Session Type</Label>
              <Select value={newSessionType} onValueChange={(value: 'custom') => setNewSessionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TimezoneAwareTimePicker
              label="Start Time"
              utcTime={newSessionStart}
              userTimezone={userTimezone}
              onTimeChange={setNewSessionStart}
              showTimezoneInfo={false}
            />
            <TimezoneAwareTimePicker
              label="End Time"
              utcTime={newSessionEnd}
              userTimezone={userTimezone}
              onTimeChange={setNewSessionEnd}
              showTimezoneInfo={false}
            />
          </div>

          <Button 
            onClick={handleAddSession}
            disabled={!newSessionName.trim()}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Market Session
          </Button>
        </div>
      </div>

      {/* Existing Sessions */}
      <div className="space-y-4">
        {sortedSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No market sessions configured</p>
            <p className="text-xs">Add your first market session above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map((session) => (
              <Collapsible
                key={session.id}
                open={expandedSessions.has(session.id)}
                onOpenChange={() => toggleSessionExpand(session.id)}
              >
                <div className={`border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                  session.isActive 
                    ? 'border-border/60 bg-card hover:bg-card/80' 
                    : 'border-border/30 bg-muted/20 opacity-70 hover:opacity-90'
                }`}>
                  <CollapsibleTrigger className="w-full p-5 hover:bg-muted/30 transition-all duration-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {expandedSessions.has(session.id) ? 
                            <ChevronDown className="h-4 w-4 text-blue-400" /> : 
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          }
                          <div className="flex items-center space-x-3">
                            {session.isActive ? (
                              <div className="p-1.5 rounded-full bg-green-500/20">
                                <Eye className="h-3.5 w-3.5 text-green-400" />
                              </div>
                            ) : (
                              <div className="p-1.5 rounded-full bg-muted/50">
                                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-foreground">{session.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${getSessionTypeColor(session.type)}`}>
                                {session.type.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {(() => {
                              const startTime = convertUTCToUserTimezone(session.start.hours, session.start.minutes, userTimezone);
                              const endTime = convertUTCToUserTimezone(session.end.hours, session.end.minutes, userTimezone);
                              return `${formatTime(startTime.hours, startTime.minutes)} - ${formatTime(endTime.hours, endTime.minutes)}`;
                            })()} <span className="text-xs text-muted-foreground ml-1">{getTimezoneAbbreviation(userTimezone)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 border-t bg-muted/20 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={session.isActive}
                          onCheckedChange={() => handleToggleActive(session.id)}
                        />
                        <span className="text-sm font-medium">
                          {session.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveSession(session.id)}
                        disabled={['premarket', 'market-open', 'lunch', 'after-hours'].includes(session.type)}
                        title={['premarket', 'market-open', 'lunch', 'after-hours'].includes(session.type) 
                          ? 'Default sessions cannot be deleted' 
                          : 'Delete session'
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`session-name-${session.id}`} className="text-sm font-medium mb-2 block">
                          Session Name
                        </Label>
                        <Input
                          id={`session-name-${session.id}`}
                          value={session.name}
                          onChange={(e) => handleSessionNameChange(session.id, e.target.value)}
                          disabled={['premarket', 'market-open', 'lunch', 'after-hours'].includes(session.type)}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TimezoneAwareTimePicker
                          label="Start Time"
                          utcTime={session.start}
                          userTimezone={userTimezone}
                          onTimeChange={(time) => handleSessionTimeChange(session.id, 'start', time)}
                          showTimezoneInfo={false}
                        />
                        <TimezoneAwareTimePicker
                          label="End Time"
                          utcTime={session.end}
                          userTimezone={userTimezone}
                          onTimeChange={(time) => handleSessionTimeChange(session.id, 'end', time)}
                          showTimezoneInfo={false}
                        />
                      </div>

                      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        {(() => {
                          const durationMinutes = calculateDuration(session.start, session.end);
                          const hours = Math.floor(durationMinutes / 60);
                          const minutes = durationMinutes % 60;
                          return `Duration: ${hours}h ${minutes}m (${durationMinutes} minutes)`;
                        })()}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};