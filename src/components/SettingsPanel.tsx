import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TimePicker } from '@/components/ui/time-picker';
import { Plus, Trash2, RotateCcw, X, ChevronDown, ChevronRight, Clock, Settings, Calendar, TrendingUp } from 'lucide-react';
import { TradingParameters, MacroSession, NewsEvent } from '../utils/tradingLogic';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: TradingParameters;
  onParametersChange: (parameters: TradingParameters) => void;
  onResetParameters: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  parameters,
  onParametersChange,
  onResetParameters
}) => {
  const [localParams, setLocalParams] = useState(parameters);
  const [expandedMacros, setExpandedMacros] = useState<Set<string>>(new Set());
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  // Sync localParams with parameters when the panel opens or parameters change
  React.useEffect(() => {
    if (isOpen) {
      setLocalParams(parameters);
    }
  }, [isOpen, parameters]);

  // Helper function to convert time to minutes for comparison
  const timeToMinutes = (time: { hours: number; minutes: number }) => {
    return time.hours * 60 + time.minutes;
  };

  // Helper function to validate time pairs
  const validateTimePair = (startTime: { hours: number; minutes: number }, endTime: { hours: number; minutes: number }) => {
    return timeToMinutes(startTime) < timeToMinutes(endTime);
  };

  // Helper function to format time for display
  const formatTimeDisplay = (time: { hours: number; minutes: number }) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  // Helper function to sort macros by start time
  const sortMacrosByTime = (macros: MacroSession[]) => {
    return [...macros].sort((a, b) => {
      const aMinutes = timeToMinutes(a.start);
      const bMinutes = timeToMinutes(b.start);
      return aMinutes - bMinutes;
    });
  };

  // Helper function to sort news events by time
  const sortNewsByTime = (events: NewsEvent[]) => {
    return [...events].sort((a, b) => {
      const aMinutes = timeToMinutes(a.time);
      const bMinutes = timeToMinutes(b.time);
      return aMinutes - bMinutes;
    });
  };

  const handleTimeChange = (
    section: keyof TradingParameters,
    field: string,
    time: { hours: number; minutes: number }
  ) => {
    if (field.includes('.')) {
      const [subSection, timeField] = field.split('.');
      const currentSection = localParams[section] as any;
      const currentSubSection = currentSection[subSection];
      
      if (timeField === 'start') {
        const endTime = currentSubSection.end;
        if (!validateTimePair(time, endTime)) {
          alert('Start time must be earlier than end time');
          return;
        }
      } else if (timeField === 'end') {
        const startTime = currentSubSection.start;
        if (!validateTimePair(startTime, time)) {
          alert('End time must be later than start time');
          return;
        }
      }

      const updatedParams = {
        ...localParams,
        [section]: {
          ...localParams[section],
          [subSection]: {
            ...(localParams[section] as any)[subSection],
            [timeField]: time
          }
        }
      };
      setLocalParams(updatedParams);
      // Auto-save time changes immediately
      onParametersChange(updatedParams);
    } else {
      const updatedParams = {
        ...localParams,
        [section]: {
          ...localParams[section],
          [field]: time
        }
      };
      setLocalParams(updatedParams);
      // Auto-save time changes immediately
      onParametersChange(updatedParams);
    }
  };

  const handleMacroChange = (index: number, field: string, value: string | { hours: number; minutes: number }) => {
    const newMacros = [...localParams.macros];
    
    if (field === 'name' || field === 'region') {
      newMacros[index] = { ...newMacros[index], [field]: value as string };
    } else if (field === 'start' || field === 'end') {
      const time = value as { hours: number; minutes: number };
      const currentMacro = newMacros[index];
      
      if (field === 'start') {
        if (!validateTimePair(time, currentMacro.end)) {
          alert('Start time must be earlier than end time');
          return;
        }
      } else if (field === 'end') {
        if (!validateTimePair(currentMacro.start, time)) {
          alert('End time must be later than start time');
          return;
        }
      }
      
      newMacros[index] = {
        ...newMacros[index],
        [field]: time
      };
    }
    
    // Sort macros by time if time fields changed
    const finalMacros = (field === 'start' || field === 'end') ? sortMacrosByTime(newMacros) : newMacros;
    const updatedParams = { ...localParams, macros: finalMacros };
    setLocalParams(updatedParams);
    // Auto-save all changes immediately
    onParametersChange(updatedParams);
  };

  // Helper functions for managing expanded state
  const toggleMacroExpanded = (macroId: string) => {
    setExpandedMacros(prev => {
      const newSet = new Set(prev);
      if (newSet.has(macroId)) {
        newSet.delete(macroId);
      } else {
        newSet.add(macroId);
      }
      return newSet;
    });
  };

  const toggleEventExpanded = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const addMacro = () => {
    const newMacro: MacroSession = {
      id: `macro-${Date.now()}`,
      name: 'New Macro',
      start: { hours: 9, minutes: 0 },
      end: { hours: 10, minutes: 0 },
      region: 'London'
    };
    // Insert at beginning and sort by time
    const newMacros = [newMacro, ...localParams.macros];
    const sortedMacros = sortMacrosByTime(newMacros);
    const updatedParams = { ...localParams, macros: sortedMacros };
    setLocalParams(updatedParams);
    onParametersChange(updatedParams);
    // Expand the new macro for immediate editing
    setExpandedMacros(prev => new Set([...prev, newMacro.id]));
  };

  const removeMacro = (index: number) => {
    const macroToRemove = localParams.macros[index];
    // Remove from expanded set if it's expanded
    setExpandedMacros(prev => {
      const newSet = new Set(prev);
      newSet.delete(macroToRemove.id);
      return newSet;
    });
    setLocalParams(prev => ({
      ...prev,
      macros: prev.macros.filter((_, i) => i !== index)
    }));
  };

  const handleNewsChange = (index: number, field: string, value: string | { hours: number; minutes: number }) => {
    const newEvents = [...localParams.newsEvents];
    if (field === 'name' || field === 'impact' || field === 'region') {
      newEvents[index] = { ...newEvents[index], [field]: value as string };
    } else if (field === 'time') {
      newEvents[index] = {
        ...newEvents[index],
        time: value as { hours: number; minutes: number }
      };
    }
    
    // Sort events by time if time field changed
    const finalEvents = (field === 'time') ? sortNewsByTime(newEvents) : newEvents;
    const updatedParams = { ...localParams, newsEvents: finalEvents };
    setLocalParams(updatedParams);
    // Auto-save all changes immediately
    onParametersChange(updatedParams);
  };

  const addNewsEvent = () => {
    const newEvent: NewsEvent = {
      id: `news-${Date.now()}`,
      time: { hours: 12, minutes: 0 },
      name: 'New Event',
      impact: 'medium',
      region: 'New York'
    };
    // Insert at beginning and sort by time
    const newEvents = [newEvent, ...localParams.newsEvents];
    const sortedEvents = sortNewsByTime(newEvents);
    const updatedParams = { ...localParams, newsEvents: sortedEvents };
    setLocalParams(updatedParams);
    onParametersChange(updatedParams);
    // Expand the new event for immediate editing
    setExpandedEvents(prev => new Set([...prev, newEvent.id]));
  };

  const removeNewsEvent = (index: number) => {
    const eventToRemove = localParams.newsEvents[index];
    // Remove from expanded set if it's expanded
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      newSet.delete(eventToRemove.id);
      return newSet;
    });
    setLocalParams(prev => ({
      ...prev,
      newsEvents: prev.newsEvents.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // No longer needed - everything auto-saves
    onClose();
  };

  const handleCancel = () => {
    // Reset to original parameters since changes auto-save
    setLocalParams(parameters);
    setExpandedMacros(new Set());
    setExpandedEvents(new Set());
    onClose();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all trading parameters to their default values? This cannot be undone.')) {
      onResetParameters();
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSave}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Trading Parameters</SheetTitle>
          <SheetDescription>
            Customize your ICT macros, killzones, and trading sessions.
          </SheetDescription>
        </SheetHeader>
        
        {/* Tabbed Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="macros" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="macros" className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">Macros</span>
              </TabsTrigger>
              <TabsTrigger value="killzones" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="hidden sm:inline">Killzones</span>
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center space-x-1">
                <Settings className="w-3 h-3" />
                <span className="hidden sm:inline">Sessions</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
            </TabsList>

            {/* Macros Tab */}
            <TabsContent value="macros" className="flex-1 overflow-y-auto mt-0 px-4">
              <div className="bg-card rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold">ICT Macros</h3>
                    <p className="text-xs text-muted-foreground">Configure your macro trading sessions</p>
                  </div>
                  <Button onClick={addMacro} size="sm" variant="outline" className="h-8">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Macro
                  </Button>
                </div>
                <div className="space-y-2">
                  {sortMacrosByTime(localParams.macros).map((macro, index) => {
                    // Find the original index in the unsorted array for change handling
                    const originalIndex = localParams.macros.findIndex(m => m.id === macro.id);
                    const isExpanded = expandedMacros.has(macro.id);
                    return (
                    <Collapsible key={macro.id} open={isExpanded} onOpenChange={() => toggleMacroExpanded(macro.id)}>
                      <div className="border rounded-md bg-background/50 hover:bg-background transition-colors">
                        <CollapsibleTrigger className="w-full p-3 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{macro.name}</div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center space-x-2">
                                <span>{formatTimeDisplay(macro.start)} - {formatTimeDisplay(macro.end)}</span>
                                <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
                                <span className="font-medium">{macro.region}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMacro(originalIndex);
                                }}
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                title="Remove macro"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3">
                          <div className="space-y-3 border-t pt-3 mt-3">
                            <div>
                              <Label className="text-xs">Macro Name</Label>
                              <Input
                                value={macro.name}
                                onChange={(e) => handleMacroChange(originalIndex, 'name', e.target.value)}
                                className="h-8"
                                placeholder="Macro name"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Session Region</Label>
                              <Select
                                value={macro.region}
                                onValueChange={(value) => handleMacroChange(originalIndex, 'region', value)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Tokyo">Tokyo</SelectItem>
                                  <SelectItem value="London">London</SelectItem>
                                  <SelectItem value="New York">New York</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Start Time</Label>
                                <TimePicker
                                  value={macro.start}
                                  onChange={(time) => handleMacroChange(originalIndex, 'start', time)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">End Time</Label>
                                <TimePicker
                                  value={macro.end}
                                  onChange={(time) => handleMacroChange(originalIndex, 'end', time)}
                                />
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Killzones Tab */}
            <TabsContent value="killzones" className="flex-1 overflow-y-auto mt-0 px-4">
              <div className="bg-card rounded-lg p-3">
                <div className="mb-3">
                  <h3 className="text-base font-semibold">Killzones</h3>
                  <p className="text-xs text-muted-foreground">Set your London and New York killzone times</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border rounded-md bg-background/30">
                    <Label className="text-sm font-medium text-foreground mb-2 block">London Killzone</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start</Label>
                        <TimePicker
                          value={localParams.killzones.london.start}
                          onChange={(time) => handleTimeChange('killzones', 'london.start', time)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End</Label>
                        <TimePicker
                          value={localParams.killzones.london.end}
                          onChange={(time) => handleTimeChange('killzones', 'london.end', time)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md bg-background/30">
                    <Label className="text-sm font-medium text-foreground mb-2 block">New York Killzone</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start</Label>
                        <TimePicker
                          value={localParams.killzones.newYork.start}
                          onChange={(time) => handleTimeChange('killzones', 'newYork.start', time)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End</Label>
                        <TimePicker
                          value={localParams.killzones.newYork.end}
                          onChange={(time) => handleTimeChange('killzones', 'newYork.end', time)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="flex-1 overflow-y-auto mt-0 px-4">
              <div className="bg-card rounded-lg p-3">
                <div className="mb-3">
                  <h3 className="text-base font-semibold">Trading Sessions</h3>
                  <p className="text-xs text-muted-foreground">Configure your trading session times</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border rounded-md bg-background/30">
                    <Label className="text-sm font-medium text-foreground mb-2 block">Pre-Market Session</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start</Label>
                        <TimePicker
                          value={localParams.sessions.premarket.start}
                          onChange={(time) => handleTimeChange('sessions', 'premarket.start', time)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End</Label>
                        <TimePicker
                          value={localParams.sessions.premarket.end}
                          onChange={(time) => handleTimeChange('sessions', 'premarket.end', time)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md bg-background/30">
                    <Label className="text-sm font-medium text-foreground mb-2 block">Lunch Session</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start</Label>
                        <TimePicker
                          value={localParams.sessions.lunch.start}
                          onChange={(time) => handleTimeChange('sessions', 'lunch.start', time)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End</Label>
                        <TimePicker
                          value={localParams.sessions.lunch.end}
                          onChange={(time) => handleTimeChange('sessions', 'lunch.end', time)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* News Events Tab */}
            <TabsContent value="news" className="flex-1 overflow-y-auto mt-0 px-4">
              <div className="bg-card rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold">News Events</h3>
                    <p className="text-xs text-muted-foreground">Add important news events to track</p>
                  </div>
                  <Button onClick={addNewsEvent} size="sm" variant="outline" className="h-8">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Event
                  </Button>
                </div>
                <div className="space-y-2">
                  {sortNewsByTime(localParams.newsEvents).map((event, index) => {
                    // Find the original index in the unsorted array for change handling
                    const originalIndex = localParams.newsEvents.findIndex(e => e.id === event.id);
                    const isExpanded = expandedEvents.has(event.id);
                    return (
                    <Collapsible key={event.id} open={isExpanded} onOpenChange={() => toggleEventExpanded(event.id)}>
                      <div className="border rounded-md bg-background/50 hover:bg-background transition-colors">
                        <CollapsibleTrigger className="w-full p-3 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{event.name}</div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center space-x-2">
                                <span>{formatTimeDisplay(event.time)}</span>
                                <span className={`inline-block w-2 h-2 rounded-full ${
                                  event.impact === 'high' ? 'bg-red-500' : 
                                  event.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></span>
                                <span className="capitalize">{event.impact} impact</span>
                                <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
                                <span className="font-medium">{event.region}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNewsEvent(originalIndex);
                                }}
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                title="Remove event"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3">
                          <div className="space-y-3 border-t pt-3 mt-3">
                            <div>
                              <Label className="text-xs">Event Name</Label>
                              <Input
                                value={event.name}
                                onChange={(e) => handleNewsChange(originalIndex, 'name', e.target.value)}
                                className="h-8"
                                placeholder="Event name"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Session Region</Label>
                              <Select
                                value={event.region}
                                onValueChange={(value) => handleNewsChange(originalIndex, 'region', value)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Tokyo">Tokyo</SelectItem>
                                  <SelectItem value="London">London</SelectItem>
                                  <SelectItem value="New York">New York</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Time</Label>
                                <TimePicker
                                  value={event.time}
                                  onChange={(time) => handleNewsChange(originalIndex, 'time', time)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Impact</Label>
                                <Select
                                  value={event.impact}
                                  onValueChange={(value) => handleNewsChange(originalIndex, 'impact', value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Footer */}
        <div className="border-t bg-background p-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="flex items-center space-x-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
            
            <Button size="sm" onClick={handleSave}>
              <X className="h-3 w-3 mr-1" />
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};