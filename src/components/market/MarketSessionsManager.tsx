import React, { useState } from 'react';
import { MarketSession, TimeRange } from '../../utils/tradingLogic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TimePicker } from '@/components/ui/time-picker';
import { Plus, Trash2, Clock, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';

interface MarketSessionsManagerProps {
  marketSessions: MarketSession[];
  onSessionsChange: (sessions: MarketSession[]) => void;
}

export const MarketSessionsManager: React.FC<MarketSessionsManagerProps> = ({
  marketSessions,
  onSessionsChange
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
            <div className="space-y-2">
              <Label>Start Time</Label>
              <TimePicker
                value={newSessionStart}
                onChange={setNewSessionStart}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <TimePicker
                value={newSessionEnd}
                onChange={setNewSessionEnd}
              />
            </div>
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
                <div className={`border rounded-lg transition-all duration-200 ${
                  session.isActive ? 'border-border' : 'border-border/30 opacity-60'
                }`}>
                  <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {expandedSessions.has(session.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                        <div className="flex items-center space-x-2">
                          {session.isActive ? (
                            <Eye className="h-4 w-4 text-green-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium text-left">{session.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getSessionTypeColor(session.type)}`}>
                            {session.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {session.start.hours.toString().padStart(2, '0')}:{session.start.minutes.toString().padStart(2, '0')} - {session.end.hours.toString().padStart(2, '0')}:{session.end.minutes.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-t space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={session.isActive}
                          onCheckedChange={() => handleToggleActive(session.id)}
                        />
                        <span className="text-sm text-muted-foreground">
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

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`session-name-${session.id}`} className="text-xs text-muted-foreground">
                          Session Name
                        </Label>
                        <Input
                          id={`session-name-${session.id}`}
                          value={session.name}
                          onChange={(e) => handleSessionNameChange(session.id, e.target.value)}
                          className="mt-1"
                          disabled={['premarket', 'market-open', 'lunch', 'after-hours'].includes(session.type)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Start Time</Label>
                          <TimePicker
                            value={session.start}
                            onChange={(time) => handleSessionTimeChange(session.id, 'start', time)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">End Time</Label>
                          <TimePicker
                            value={session.end}
                            onChange={(time) => handleSessionTimeChange(session.id, 'end', time)}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                        Duration: {Math.abs(
                          (session.end.hours * 60 + session.end.minutes) - 
                          (session.start.hours * 60 + session.start.minutes)
                        )} minutes
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