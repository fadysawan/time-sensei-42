import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TimePicker } from '@/components/ui/time-picker';
import { TimeIntervalPicker } from '@/components/ui/time-interval-picker';
import { Plus, Trash2, RotateCcw, Clock, TrendingUp, Zap, Newspaper, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { TradingParameters, MacroSession, KillzoneSession, TimeRange } from '../utils/tradingLogic';
import { NewsTemplate, NewsInstance } from '../models';
import { NewsSettings } from './settings/NewsSettings';

interface ExtendedTradingParameters extends TradingParameters {
  newsTemplates: NewsTemplate[];
  newsInstances: NewsInstance[];
}

interface SettingsPageContentProps {
  parameters: ExtendedTradingParameters;
  onParametersChange: (parameters: ExtendedTradingParameters) => void;
  onResetParameters: () => void;
}

export const SettingsPageContent: React.FC<SettingsPageContentProps> = ({
  parameters,
  onParametersChange,
  onResetParameters
}) => {
  // Use parameters directly for real-time updates - no local state
  const [expandedMacros, setExpandedMacros] = useState<Set<string>>(new Set());
  const [expandedKillzones, setExpandedKillzones] = useState<Set<string>>(new Set());

  const handleReset = () => {
    onResetParameters();
  };

  // Toggle expand/collapse functions
  const toggleMacroExpand = (id: string) => {
    const newExpanded = new Set(expandedMacros);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMacros(newExpanded);
  };

  const toggleKillzoneExpand = (id: string) => {
    const newExpanded = new Set(expandedKillzones);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedKillzones(newExpanded);
  };



  // Macro management functions with real-time updates
  const addMacro = () => {
    const newMacro: MacroSession = {
      id: `macro-${Date.now()}`,
      name: 'New Macro Event',
      start: { hours: 9, minutes: 0 },
      end: { hours: 10, minutes: 0 },
      region: 'London'
    };
    
    const updatedParams = {
      ...parameters,
      macros: [...parameters.macros, newMacro]
    };
    onParametersChange(updatedParams);
    // Auto-expand the new macro
    setExpandedMacros(prev => new Set(prev).add(newMacro.id));
  };

  const removeMacro = (index: number) => {
    const updatedParams = {
      ...parameters,
      macros: parameters.macros.filter((_, i) => i !== index)
    };
    onParametersChange(updatedParams);
  };

  const updateMacro = (index: number, field: keyof MacroSession, value: any) => {
    const newMacros = [...parameters.macros];
    newMacros[index] = { ...newMacros[index], [field]: value };
    
    const updatedParams = {
      ...parameters,
      macros: newMacros
    };
    onParametersChange(updatedParams);
  };

  // Killzone management functions with real-time updates
  const addKillzone = () => {
    const newKillzone: KillzoneSession = {
      id: `killzone-${Date.now()}`,
      name: 'New Killzone',
      start: { hours: 14, minutes: 0 },
      end: { hours: 16, minutes: 0 },
      region: 'New York'
    };
    
    const updatedParams = {
      ...parameters,
      killzones: [...parameters.killzones, newKillzone]
    };
    onParametersChange(updatedParams);
    // Auto-expand the new killzone
    setExpandedKillzones(prev => new Set(prev).add(newKillzone.id));
  };

  const removeKillzone = (index: number) => {
    const updatedParams = {
      ...parameters,
      killzones: parameters.killzones.filter((_, i) => i !== index)
    };
    onParametersChange(updatedParams);
  };

  const updateKillzone = (index: number, field: keyof KillzoneSession, value: any) => {
    const newKillzones = [...parameters.killzones];
    newKillzones[index] = { ...newKillzones[index], [field]: value };
    
    const updatedParams = {
      ...parameters,
      killzones: newKillzones
    };
    onParametersChange(updatedParams);
  };



  // Market sessions management with real-time updates
  const updateSession = (sessionType: 'premarket' | 'lunch', timeType: 'start' | 'end', time: TimeRange) => {
    const updatedParams = {
      ...parameters,
      sessions: {
        ...parameters.sessions,
        [sessionType]: {
          ...parameters.sessions[sessionType],
          [timeType]: time
        }
      }
    };
    onParametersChange(updatedParams);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Market</span>
          </TabsTrigger>
          <TabsTrigger value="macros" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Macros</span>
          </TabsTrigger>
          <TabsTrigger value="killzones" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Killzones</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center space-x-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
        </TabsList>

        {/* Market Hours Tab */}
        <TabsContent value="market" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-400">Market Sessions</CardTitle>
              <CardDescription>Configure pre-market and lunch break timings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pre-market Session */}
              <div className="space-y-4">
                <TimeIntervalPicker
                  label="Pre-Market Session"
                  startTime={parameters.sessions.premarket.start}
                  endTime={parameters.sessions.premarket.end}
                  onStartTimeChange={(time) => updateSession('premarket', 'start', time)}
                  onEndTimeChange={(time) => updateSession('premarket', 'end', time)}
                />
              </div>

              {/* Lunch Break */}
              <div className="space-y-4">
                <TimeIntervalPicker
                  label="Lunch Break"
                  startTime={parameters.sessions.lunch.start}
                  endTime={parameters.sessions.lunch.end}
                  onStartTimeChange={(time) => updateSession('lunch', 'start', time)}
                  onEndTimeChange={(time) => updateSession('lunch', 'end', time)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Macro Events Tab */}
        <TabsContent value="macros" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-blue-400">Macro Events</CardTitle>
                <CardDescription>High-impact economic events and sessions</CardDescription>
              </div>
              <Button onClick={addMacro} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Macro
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parameters.macros.map((macro, index) => (
                  <Collapsible
                    key={macro.id}
                    open={expandedMacros.has(macro.id)}
                    onOpenChange={() => toggleMacroExpand(macro.id)}
                  >
                    <div className="border rounded-lg">
                      <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {expandedMacros.has(macro.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                            <span className="font-medium text-left">{macro.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {macro.start.hours.toString().padStart(2, '0')}:{macro.start.minutes.toString().padStart(2, '0')} - {macro.end.hours.toString().padStart(2, '0')}:{macro.end.minutes.toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                          <Input
                            value={macro.name}
                            onChange={(e) => updateMacro(index, 'name', e.target.value)}
                            className="flex-1 mr-4"
                            placeholder="Macro event name"
                          />
                          <Button
                            onClick={() => removeMacro(index)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <TimeIntervalPicker
                              label="Macro Time Range"
                              startTime={macro.start}
                              endTime={macro.end}
                              onStartTimeChange={(time) => updateMacro(index, 'start', time)}
                              onEndTimeChange={(time) => updateMacro(index, 'end', time)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Region</Label>
                            <Select value={macro.region} onValueChange={(value) => updateMacro(index, 'region', value)}>
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
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
                
                {parameters.macros.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No macro events configured</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Killzones Tab */}
        <TabsContent value="killzones" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-purple-400">Killzones</CardTitle>
                <CardDescription>High-volatility trading periods</CardDescription>
              </div>
              <Button onClick={addKillzone} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Killzone
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parameters.killzones.map((killzone, index) => (
                  <Collapsible
                    key={killzone.id}
                    open={expandedKillzones.has(killzone.id)}
                    onOpenChange={() => toggleKillzoneExpand(killzone.id)}
                  >
                    <div className="border rounded-lg">
                      <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {expandedKillzones.has(killzone.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                            <span className="font-medium text-left">{killzone.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {killzone.start.hours.toString().padStart(2, '0')}:{killzone.start.minutes.toString().padStart(2, '0')} - {killzone.end.hours.toString().padStart(2, '0')}:{killzone.end.minutes.toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                          <Input
                            value={killzone.name}
                            onChange={(e) => updateKillzone(index, 'name', e.target.value)}
                            className="flex-1 mr-4"
                            placeholder="Killzone name"
                          />
                          <Button
                            onClick={() => removeKillzone(index)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <TimeIntervalPicker
                              label="Killzone Time Range"
                              startTime={killzone.start}
                              endTime={killzone.end}
                              onStartTimeChange={(time) => updateKillzone(index, 'start', time)}
                              onEndTimeChange={(time) => updateKillzone(index, 'end', time)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Region</Label>
                            <Select value={killzone.region} onValueChange={(value) => updateKillzone(index, 'region', value)}>
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
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
                
                {parameters.killzones.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No killzones configured</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Events Tab - New System */}
        <TabsContent value="news" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-400">News Management</CardTitle>
              <CardDescription>Manage news templates and create scheduled instances with countdown/cooldown periods</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsSettings
                newsTemplates={parameters.newsTemplates || []}
                newsInstances={parameters.newsInstances || []}
                onUpdateNewsTemplates={(newsTemplates) => {
                  onParametersChange({
                    ...parameters,
                    newsTemplates
                  });
                }}
                onUpdateNewsInstances={(newsInstances) => {
                  onParametersChange({
                    ...parameters,
                    newsInstances
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-6 border-t bg-background/50 backdrop-blur-sm sticky bottom-0 p-4 rounded-lg">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset All</span>
        </Button>
        
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Changes saved automatically</span>
        </div>
      </div>
    </div>
  );
};