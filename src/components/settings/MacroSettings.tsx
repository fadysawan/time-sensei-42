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
import { MacroSession } from '../../models';
import { MacroSettingsProps, MacroFormState, Region } from './types';
import { convertUTCToUserTimezone, formatTime, getTimezoneAbbreviation, calculateDuration } from '../../utils/timeUtils';

export const MacroSettings: React.FC<MacroSettingsProps> = ({
  parameters,
  onParametersChange
}) => {
  const [expandedMacros, setExpandedMacros] = useState<Set<string>>(new Set());
  const [isAddFormExpanded, setIsAddFormExpanded] = useState(false);
  
  // Add macro form state
  const [newMacroForm, setNewMacroForm] = useState<MacroFormState>({
    name: '',
    start: { hours: 9, minutes: 0 },
    end: { hours: 10, minutes: 0 },
    region: 'London',
    description: '',
    probability: undefined
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
      region: newMacroForm.region,
      description: newMacroForm.description?.trim() || undefined,
      probability: newMacroForm.probability || undefined
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
      region: 'London',
      description: '',
      probability: undefined
    });
  };

  const removeMacro = (index: number) => {
    const updatedParams = {
      ...parameters,
      macros: parameters.macros.filter((_, i) => i !== index)
    };
    onParametersChange(updatedParams);
  };

  const updateMacro = (macroId: string, field: keyof MacroSession, value: string | TimeRange | 'High' | 'Low' | undefined) => {
    const newMacros = [...parameters.macros];
    const index = newMacros.findIndex(m => m.id === macroId);
    
    if (index === -1) {
      console.error('❌ Macro not found with ID:', macroId);
      return;
    }
    
    newMacros[index] = { ...newMacros[index], [field]: value };
    
    const updatedParams = {
      ...parameters,
      macros: newMacros
    };
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
        {/* Add New Macro Panel - Collapsible */}
        <Collapsible open={isAddFormExpanded} onOpenChange={setIsAddFormExpanded}>
          <div className="border border-blue-500/30 rounded-lg bg-blue-500/10">
            <CollapsibleTrigger className="w-full p-4 hover:bg-blue-500/20 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-blue-400 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Macro Event
                </h3>
                {isAddFormExpanded ? (
                  <ChevronDown className="h-4 w-4 text-blue-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-blue-400" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Name</Label>
                  <Input
                    placeholder="e.g., Non-Farm Payrolls"
                    value={newMacroForm.name}
                    onChange={(e) => setNewMacroForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <TimezoneAwareTimeIntervalPicker
                    label="Event Time Range"
                    startTime={newMacroForm.start}
                    endTime={newMacroForm.end}
                    userTimezone={parameters.userTimezone}
                    onStartTimeChange={(time) => setNewMacroForm(prev => ({ ...prev, start: time }))}
                    onEndTimeChange={(time) => setNewMacroForm(prev => ({ ...prev, end: time }))}
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
                
                <div className="space-y-2">
                  <Label>Probability (Optional)</Label>
                  <Select 
                    value={newMacroForm.probability || 'none'} 
                    onValueChange={(value: 'High' | 'Low' | 'none') => setNewMacroForm(prev => ({ ...prev, probability: value === 'none' ? undefined : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select probability (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input
                    placeholder="e.g., High volatility period during London market open"
                    value={newMacroForm.description || ''}
                    onChange={(e) => setNewMacroForm(prev => ({ ...prev, description: e.target.value }))}
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
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Macros Summary */}
        {parameters.macros.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {parameters.macros.length} macro event{parameters.macros.length !== 1 ? 's' : ''} configured
              </span>
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-green-400">
                  High: {parameters.macros.filter(m => m.probability === 'High').length}
                </span>
                <span className="text-orange-400">
                  Low: {parameters.macros.filter(m => m.probability === 'Low').length}
                </span>
                <span className="text-gray-400">
                  Unspecified: {parameters.macros.filter(m => !m.probability).length}
                </span>
              </div>
            </div>
          </div>
        )}

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
                              updateMacro(macro.id, 'start', time);
                            }}
                            showTimezoneInfo={false}
                          />
                          <TimezoneAwareTimePicker
                            label="End Time"
                            utcTime={macro.end}
                            userTimezone={parameters.userTimezone}
                            onTimeChange={(time) => {
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
                        
                        <div className="space-y-2">
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
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Probability (Optional)</Label>
                          <Select value={macro.probability || 'none'} onValueChange={(value) => updateMacro(macro.id, 'probability', value === 'none' ? undefined : value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select probability (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Not specified</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Description</Label>
                          <Input
                            value={macro.description || ''}
                            onChange={(e) => updateMacro(macro.id, 'description', e.target.value)}
                            placeholder="Optional description for this macro"
                          />
                        </div>
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