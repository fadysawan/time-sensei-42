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
    value: string
  ) => {
    const [hours, minutes] = value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;
    
    setLocalParams(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: { hours, minutes }
      }
    }));
  };

  const handleMacroChange = (index: number, field: string, value: string) => {
    const newMacros = [...localParams.macros];
    if (field === 'name') {
      newMacros[index] = { ...newMacros[index], [field]: value };
    } else if (field.includes('.')) {
      const [timeField, prop] = field.split('.');
      const [hours, minutes] = value.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        newMacros[index] = {
          ...newMacros[index],
          [timeField]: { hours, minutes }
        };
      }
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

  const handleNewsChange = (index: number, field: string, value: string) => {
    const newEvents = [...localParams.newsEvents];
    if (field === 'name' || field === 'impact') {
      newEvents[index] = { ...newEvents[index], [field]: value };
    } else if (field === 'time') {
      const [hours, minutes] = value.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        newEvents[index] = {
          ...newEvents[index],
          time: { hours, minutes }
        };
      }
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
                    <Input
                      type="time"
                      value={formatTimeInput(macro.start)}
                      onChange={(e) => handleMacroChange(index, 'start', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End</Label>
                    <Input
                      type="time"
                      value={formatTimeInput(macro.end)}
                      onChange={(e) => handleMacroChange(index, 'end', e.target.value)}
                      className="h-8"
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
                  <Input
                    type="time"
                    value={formatTimeInput(localParams.killzones.london.start)}
                    onChange={(e) => handleTimeChange('killzones', 'london.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(localParams.killzones.london.end)}
                    onChange={(e) => handleTimeChange('killzones', 'london.end', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">New York</Label>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(localParams.killzones.newYork.start)}
                    onChange={(e) => handleTimeChange('killzones', 'newYork.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(localParams.killzones.newYork.end)}
                    onChange={(e) => handleTimeChange('killzones', 'newYork.end', e.target.value)}
                    className="h-8"
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
                  <Input
                    type="time"
                    value={formatTimeInput(localParams.sessions.premarket.start)}
                    onChange={(e) => handleTimeChange('sessions', 'premarket.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(localParams.sessions.premarket.end)}
                    onChange={(e) => handleTimeChange('sessions', 'premarket.end', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">Lunch</Label>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(localParams.sessions.lunch.start)}
                    onChange={(e) => handleTimeChange('sessions', 'lunch.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(localParams.sessions.lunch.end)}
                    onChange={(e) => handleTimeChange('sessions', 'lunch.end', e.target.value)}
                    className="h-8"
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
                    <Input
                      type="time"
                      value={formatTimeInput(event.time)}
                      onChange={(e) => handleNewsChange(index, 'time', e.target.value)}
                      className="h-8"
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