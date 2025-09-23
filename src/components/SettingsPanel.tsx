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
import { TimePicker } from '@/components/ui/time-picker';
import { Plus, Trash2 } from 'lucide-react';
import { TradingParameters, MacroSession, NewsEvent } from '../utils/tradingLogic';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: TradingParameters;
  onParametersChange: (parameters: TradingParameters) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  parameters,
  onParametersChange
}) => {
  const [localParams, setLocalParams] = useState(parameters);

  const handleTimeChange = (
    section: keyof TradingParameters,
    field: string,
    time: { hours: number; minutes: number }
  ) => {
    // Handle nested field paths like "london.start" or "newYork.end"
    if (field.includes('.')) {
      const [subSection, timeField] = field.split('.');
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
      newMacros[index] = {
        ...newMacros[index],
        [field]: value as { hours: number; minutes: number }
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
  };

  const removeMacro = (index: number) => {
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
  };

  const removeNewsEvent = (index: number) => {
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
    onClose();
  };

  const handleCancel = () => {
    setLocalParams(parameters);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleCancel}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Trading Parameters</SheetTitle>
          <SheetDescription>
            Customize your ICT macros, killzones, and trading sessions.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* ICT Macros */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">ICT Macros</h3>
              <Button onClick={addMacro} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Macro
              </Button>
            </div>
            <div className="space-y-3">
              {localParams.macros.map((macro, index) => (
                <div key={macro.id} className="grid grid-cols-4 gap-2 p-3 border rounded-lg">
                  <div className="col-span-4">
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={macro.name}
                      onChange={(e) => handleMacroChange(index, 'name', e.target.value)}
                      className="h-8"
                      placeholder="Macro name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Start</Label>
                    <TimePicker
                      value={macro.start}
                      onChange={(time) => handleMacroChange(index, 'start', time)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End</Label>
                    <TimePicker
                      value={macro.end}
                      onChange={(time) => handleMacroChange(index, 'end', time)}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <Button
                      onClick={() => removeMacro(index)}
                      size="sm"
                      variant="outline"
                      className="h-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Killzones */}
          <div>
            <h3 className="text-sm font-medium mb-3">Killzones</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">London</Label>
                <div>
                  <TimePicker
                    value={localParams.killzones.london.start}
                    onChange={(time) => handleTimeChange('killzones', 'london.start', time)}
                  />
                </div>
                <div>
                  <TimePicker
                    value={localParams.killzones.london.end}
                    onChange={(time) => handleTimeChange('killzones', 'london.end', time)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">New York</Label>
                <div>
                  <TimePicker
                    value={localParams.killzones.newYork.start}
                    onChange={(time) => handleTimeChange('killzones', 'newYork.start', time)}
                  />
                </div>
                <div>
                  <TimePicker
                    value={localParams.killzones.newYork.end}
                    onChange={(time) => handleTimeChange('killzones', 'newYork.end', time)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sessions */}
          <div>
            <h3 className="text-sm font-medium mb-3">Trading Sessions</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">Pre-Market</Label>
                <div>
                  <TimePicker
                    value={localParams.sessions.premarket.start}
                    onChange={(time) => handleTimeChange('sessions', 'premarket.start', time)}
                  />
                </div>
                <div>
                  <TimePicker
                    value={localParams.sessions.premarket.end}
                    onChange={(time) => handleTimeChange('sessions', 'premarket.end', time)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">Lunch</Label>
                <div>
                  <TimePicker
                    value={localParams.sessions.lunch.start}
                    onChange={(time) => handleTimeChange('sessions', 'lunch.start', time)}
                  />
                </div>
                <div>
                  <TimePicker
                    value={localParams.sessions.lunch.end}
                    onChange={(time) => handleTimeChange('sessions', 'lunch.end', time)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* News Events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">News Events</h3>
              <Button onClick={addNewsEvent} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Event
              </Button>
            </div>
            <div className="space-y-3">
              {localParams.newsEvents.map((event, index) => (
                <div key={event.id} className="grid grid-cols-4 gap-2 p-3 border rounded-lg">
                  <div className="col-span-4">
                    <Label className="text-xs">Event Name</Label>
                    <Input
                      value={event.name}
                      onChange={(e) => handleNewsChange(index, 'name', e.target.value)}
                      className="h-8"
                      placeholder="Event name"
                    />
                  </div>
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
                  <div className="col-span-2 flex items-end">
                    <Button
                      onClick={() => removeNewsEvent(index)}
                      size="sm"
                      variant="outline"
                      className="h-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};