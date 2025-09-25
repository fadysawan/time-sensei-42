import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TimezoneAwareTimeIntervalPicker } from '@/components/ui/timezone-aware-time-interval-picker';
import { TimezoneAwareTimePicker } from '@/components/ui/timezone-aware-time-picker';
import { Plus, Trash2, TrendingUp, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { MacroSession } from '../../utils/tradingLogic';
import { MacroSettingsProps, MacroFormState, Region } from './types';
import { convertUTCToUserTimezone, formatTime, getTimezoneAbbreviation, calculateDuration } from '../../utils/timeUtils';

export const MacroSettings: React.FC<MacroSettingsProps> = ({
  parameters,
  onParametersChange
}) => {
  const [expandedMacros, setExpandedMacros] = useState<Set<string>>(new Set());
  
  // Add macro form state
  const [newMacroForm, setNewMacroForm] = useState<MacroFormState>({
    name: '',
    start: { hours: 9, minutes: 0 },
    end: { hours: 10, minutes: 0 },
    region: 'London'
  });

  const toggleMacroExpand = (id: string) => {
    const newExpanded = new Set(expandedMacros);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMacros(newExpanded);
  };

  const addMacro = () => {
    if (!newMacroForm.name.trim()) return;

    const newMacro: MacroSession = {
      id: `macro-${Date.now()}`,
      name: newMacroForm.name.trim(),
      start: { ...newMacroForm.start },
      end: { ...newMacroForm.end },
      region: newMacroForm.region
    };
    
    const updatedParams = {
      ...parameters,
      macros: [...parameters.macros, newMacro]
    };
    onParametersChange(updatedParams);
    
    // Auto-expand the new macro
    setExpandedMacros(prev => new Set(prev).add(newMacro.id));
    
    // Reset form
    setNewMacroForm({
      name: '',
      start: { hours: 9, minutes: 0 },
      end: { hours: 10, minutes: 0 },
      region: 'London'
    });
  };

  const removeMacro = (index: number) => {
    const updatedParams = {
      ...parameters,
      macros: parameters.macros.filter((_, i) => i !== index)
    };
    onParametersChange(updatedParams);
  };

  const updateMacro = (macroId: string, field: keyof MacroSession, value: any) => {
    console.log('🔧 Updating macro:', { macroId, field, value, currentMacros: parameters.macros });
    const newMacros = [...parameters.macros];
    const index = newMacros.findIndex(m => m.id === macroId);
    
    if (index === -1) {
      console.error('❌ Macro not found with ID:', macroId);
      return;
    }
    
    console.log('📍 Found macro at index:', index, 'Old value:', newMacros[index][field]);
    newMacros[index] = { ...newMacros[index], [field]: value };
    console.log('📝 Updated macro:', newMacros[index]);
    
    const updatedParams = {
      ...parameters,
      macros: newMacros
    };
    console.log('📤 Sending updated params:', updatedParams);
    onParametersChange(updatedParams);
  };

  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-blue-400">Macro Events</CardTitle>
          </div>
        </div>
        <CardDescription>
          Configure macro economic events and data releases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Macro Panel */}
        <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/10">
          <h3 className="font-medium text-blue-400 mb-3 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New Macro Event
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input
                placeholder="e.g., Non-Farm Payrolls"
                value={newMacroForm.name}
                onChange={(e) => setNewMacroForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select 
                value={newMacroForm.region} 
                onValueChange={(value: Region) => setNewMacroForm(prev => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tokyo">Tokyo</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <TimezoneAwareTimeIntervalPicker
                label="Event Time Range"
                startTime={newMacroForm.start}
                endTime={newMacroForm.end}
                userTimezone={parameters.userTimezone}
                onStartTimeChange={(time) => setNewMacroForm(prev => ({ ...prev, start: time }))}
                onEndTimeChange={(time) => setNewMacroForm(prev => ({ ...prev, end: time }))}
              />
            </div>
            <div className="md:col-span-2">
              <Button 
                onClick={addMacro}
                disabled={!newMacroForm.name.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Macro Event
              </Button>
            </div>
          </div>
        </div>

        {/* Existing Macros */}
        <div className="space-y-4">
          {parameters.macros.map((macro, index) => (
            <Collapsible
              key={macro.id}
              open={expandedMacros.has(macro.id)}
              onOpenChange={() => toggleMacroExpand(macro.id)}
            >
              <div className="border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border-blue-500/20 bg-card hover:bg-card/80">
                <CollapsibleTrigger className="w-full p-5 hover:bg-muted/30 transition-all duration-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {expandedMacros.has(macro.id) ? 
                          <ChevronDown className="h-4 w-4 text-blue-400" /> : 
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        }
                        <div className="p-1.5 rounded-full bg-blue-500/20">
                          <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-foreground">{macro.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-md font-medium border border-blue-500/30 bg-blue-500/10 text-blue-400">
                            {macro.region}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {(() => {
                            const startTime = convertUTCToUserTimezone(macro.start.hours, macro.start.minutes, parameters.userTimezone);
                            const endTime = convertUTCToUserTimezone(macro.end.hours, macro.end.minutes, parameters.userTimezone);
                            return `${formatTime(startTime.hours, startTime.minutes)} - ${formatTime(endTime.hours, endTime.minutes)}`;
                          })()} <span className="text-xs text-muted-foreground ml-1">{getTimezoneAbbreviation(parameters.userTimezone)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-5 border-t bg-muted/20 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <Label className="text-sm font-medium mb-2 block">Event Name</Label>
                      <Input
                        value={macro.name}
                        onChange={(e) => updateMacro(macro.id, 'name', e.target.value)}
                        placeholder="Macro event name"
                      />
                    </div>
                    <Button
                      onClick={() => removeMacro(index)}
                      variant="destructive"
                      size="sm"
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">Time Range</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <TimezoneAwareTimePicker
                            label="Start Time"
                            utcTime={macro.start}
                            userTimezone={parameters.userTimezone}
                            onTimeChange={(time) => {
                              console.log('🕐 TimePicker start time changed:', time, 'for macro:', macro.id);
                              updateMacro(macro.id, 'start', time);
                            }}
                            showTimezoneInfo={false}
                          />
                          <TimezoneAwareTimePicker
                            label="End Time"
                            utcTime={macro.end}
                            userTimezone={parameters.userTimezone}
                            onTimeChange={(time) => {
                              console.log('🕐 TimePicker end time changed:', time, 'for macro:', macro.id);
                              updateMacro(macro.id, 'end', time);
                            }}
                            showTimezoneInfo={false}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                          {(() => {
                            const durationMinutes = calculateDuration(macro.start, macro.end);
                            const hours = Math.floor(durationMinutes / 60);
                            const minutes = durationMinutes % 60;
                            return `Duration: ${hours}h ${minutes}m (${durationMinutes} minutes)`;
                          })()}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Region</Label>
                        <Select value={macro.region} onValueChange={(value) => updateMacro(macro.id, 'region', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tokyo">Tokyo</SelectItem>
                            <SelectItem value="London">London</SelectItem>
                            <SelectItem value="New York">New York</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>

        {parameters.macros.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No macro events configured</p>
            <p className="text-sm">Add your first macro event above</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};