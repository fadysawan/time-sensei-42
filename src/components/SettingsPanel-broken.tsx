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
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimePicker } from '@/components/ui/time-picker';
import { Plus, Trash2, RotateCcw, Edit, Save, X, Check, Clock, Settings, Calendar, TrendingUp } from 'lucide-react';
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
  const [editingMacro, setEditingMacro] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

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

  const handleTimeChange = (
    section: keyof TradingParameters,
    field: string,
    time: { hours: number; minutes: number }
  ) => {
    // Handle nested field paths like "london.start" or "newYork.end"
    if (field.includes('.')) {
      const [subSection, timeField] = field.split('.');
      
      // Get current values for validation
      const currentSection = localParams[section] as any;
      const currentSubSection = currentSection[subSection];
      
      // Validate time pairs
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

      setLocalParams(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subSection]: {
            ...(prev[section] as any)[subSection],
            [timeField]: time
          }
        }
      }));
    } else {
      // Handle direct field access
      setLocalParams(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: time
        }
      }));
    }
  };

  const handleMacroChange = (index: number, field: string, value: string | { hours: number; minutes: number }) => {
    const newMacros = [...localParams.macros];
    
    if (field === 'name') {
      newMacros[index] = { ...newMacros[index], [field]: value as string };
    } else if (field === 'start' || field === 'end') {
      const time = value as { hours: number; minutes: number };
      const currentMacro = newMacros[index];
      
      // Validate time pairs for macros
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
    setLocalParams(prev => ({ ...prev, macros: newMacros }));
  };

  const addMacro = () => {
    const newMacro: MacroSession = {
      id: `macro-${Date.now()}`,
      name: 'New Macro',
      start: { hours: 9, minutes: 0 },
      end: { hours: 10, minutes: 0 }
    };
    setLocalParams(prev => ({
      ...prev,
      macros: [...prev.macros, newMacro]
    }));
    setEditingMacro(newMacro.id); // Start in edit mode
  };

  const removeMacro = (index: number) => {
    const macroToRemove = localParams.macros[index];
    if (editingMacro === macroToRemove.id) {
      setEditingMacro(null);
    }
    setLocalParams(prev => ({
      ...prev,
      macros: prev.macros.filter((_, i) => i !== index)
    }));
  };

  const handleNewsChange = (index: number, field: string, value: string | { hours: number; minutes: number }) => {
    const newEvents = [...localParams.newsEvents];
    if (field === 'name' || field === 'impact') {
      newEvents[index] = { ...newEvents[index], [field]: value as string };
    } else if (field === 'time') {
      newEvents[index] = {
        ...newEvents[index],
        time: value as { hours: number; minutes: number }
      };
    }
    setLocalParams(prev => ({ ...prev, newsEvents: newEvents }));
  };

  const addNewsEvent = () => {
    const newEvent: NewsEvent = {
      id: `news-${Date.now()}`,
      time: { hours: 12, minutes: 0 },
      name: 'New Event',
      impact: 'medium'
    };
    setLocalParams(prev => ({
      ...prev,
      newsEvents: [...prev.newsEvents, newEvent]
    }));
    setEditingEvent(newEvent.id); // Start in edit mode
  };

  const removeNewsEvent = (index: number) => {
    const eventToRemove = localParams.newsEvents[index];
    if (editingEvent === eventToRemove.id) {
      setEditingEvent(null);
    }
    setLocalParams(prev => ({
      ...prev,
      newsEvents: prev.newsEvents.filter((_, i) => i !== index)
    }));
  };

  const formatTimeInput = (time: { hours: number; minutes: number }) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    onParametersChange(localParams);
    setEditingMacro(null);
    setEditingEvent(null);
    onClose();
  };

  const handleCancel = () => {
    setLocalParams(parameters);
    setEditingMacro(null);
    setEditingEvent(null);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all trading parameters to their default values? This cannot be undone.')) {
      onResetParameters();
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleCancel}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Trading Parameters</SheetTitle>
          <SheetDescription>
            Customize your ICT macros, killzones, and trading sessions.
          </SheetDescription>
        </SheetHeader>
        
        {/* Tabbed Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="macros" className="h-full flex flex-col p-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
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
            <TabsContent value="macros" className="flex-1 overflow-y-auto mt-0">
              <div className="bg-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
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
                  {localParams.macros.map((macro, index) => (
                    <div key={macro.id} className="p-3 border rounded-md bg-background/50 hover:bg-background transition-colors">
                      {editingMacro === macro.id ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Macro Name</Label>
                            <Input
                              value={macro.name}
                              onChange={(e) => handleMacroChange(index, 'name', e.target.value)}
                              className="h-8"
                              placeholder="Macro name"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Start Time</Label>
                              <TimePicker
                                value={macro.start}
                                onChange={(time) => handleMacroChange(index, 'start', time)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">End Time</Label>
                              <TimePicker
                                value={macro.end}
                                onChange={(time) => handleMacroChange(index, 'end', time)}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => setEditingMacro(null)}
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              onClick={() => setEditingMacro(null)}
                              size="sm"
                              className="h-7 px-2"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{macro.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatTimeDisplay(macro.start)} - {formatTimeDisplay(macro.end)}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              onClick={() => setEditingMacro(macro.id)}
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              title="Edit macro"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => removeMacro(index)}
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              title="Remove macro"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Other tabs - placeholder for now */}
            <TabsContent value="killzones" className="flex-1 overflow-y-auto mt-0">
              <div className="p-4">Killzones content coming soon...</div>
            </TabsContent>
            
            <TabsContent value="sessions" className="flex-1 overflow-y-auto mt-0">
              <div className="p-4">Sessions content coming soon...</div>
            </TabsContent>
            
            <TabsContent value="news" className="flex-1 overflow-y-auto mt-0">
              <div className="p-4">News content coming soon...</div>
            </TabsContent>
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
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
              {localParams.macros.map((macro, index) => (
                <div key={macro.id} className="p-3 border rounded-md bg-background/50 hover:bg-background transition-colors">
                  {editingMacro === macro.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Macro Name</Label>
                        <Input
                          value={macro.name}
                          onChange={(e) => handleMacroChange(index, 'name', e.target.value)}
                          className="h-8"
                          placeholder="Macro name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Start Time</Label>
                          <TimePicker
                            value={macro.start}
                            onChange={(time) => handleMacroChange(index, 'start', time)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">End Time</Label>
                          <TimePicker
                            value={macro.end}
                            onChange={(time) => handleMacroChange(index, 'end', time)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => setEditingMacro(null)}
                          size="sm"
                          variant="outline"
                          className="h-7 px-2"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          onClick={() => setEditingMacro(null)}
                          size="sm"
                          className="h-7 px-2"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{macro.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTimeDisplay(macro.start)} - {formatTimeDisplay(macro.end)}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => setEditingMacro(macro.id)}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          title="Edit macro"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => removeMacro(index)}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          title="Remove macro"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Killzones */}
          <div className="bg-card rounded-lg p-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold">Killzones</h3>
              <p className="text-xs text-muted-foreground">Set your London and New York killzone times</p>
            </div>
            <div className="space-y-4">
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

          <Separator />

          {/* Sessions */}
          <div className="bg-card rounded-lg p-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold">Trading Sessions</h3>
              <p className="text-xs text-muted-foreground">Configure pre-market and lunch session times</p>
            </div>
            <div className="space-y-4">
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

          <Separator />

          {/* News Events */}
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
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
              {localParams.newsEvents.map((event, index) => (
                <div key={event.id} className="p-3 border rounded-md bg-background/50 hover:bg-background transition-colors">
                  {editingEvent === event.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Event Name</Label>
                        <Input
                          value={event.name}
                          onChange={(e) => handleNewsChange(index, 'name', e.target.value)}
                          className="h-8"
                          placeholder="Event name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Time</Label>
                          <TimePicker
                            value={event.time}
                            onChange={(time) => handleNewsChange(index, 'time', time)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Impact</Label>
                          <Select
                            value={event.impact}
                            onValueChange={(value) => handleNewsChange(index, 'impact', value)}
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
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => setEditingEvent(null)}
                          size="sm"
                          variant="outline"
                          className="h-7 px-2"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          onClick={() => setEditingEvent(null)}
                          size="sm"
                          className="h-7 px-2"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
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
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => setEditingEvent(event.id)}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          title="Edit event"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => removeNewsEvent(index)}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          title="Remove event"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};