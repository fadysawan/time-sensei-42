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
import { MarketSessionsManager } from './market/MarketSessionsManager';

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
  
  // Add macro form state
  const [newMacroName, setNewMacroName] = useState('');
  const [newMacroStart, setNewMacroStart] = useState<TimeRange>({ hours: 9, minutes: 0 });
  const [newMacroEnd, setNewMacroEnd] = useState<TimeRange>({ hours: 10, minutes: 0 });
  const [newMacroRegion, setNewMacroRegion] = useState<'Tokyo' | 'London' | 'New York'>('London');
  
  // Add killzone form state
  const [newKillzoneName, setNewKillzoneName] = useState('');
  const [newKillzoneStart, setNewKillzoneStart] = useState<TimeRange>({ hours: 14, minutes: 0 });
  const [newKillzoneEnd, setNewKillzoneEnd] = useState<TimeRange>({ hours: 16, minutes: 0 });
  const [newKillzoneRegion, setNewKillzoneRegion] = useState<'Tokyo' | 'London' | 'New York'>('New York');

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
    if (!newMacroName.trim()) return;

    const newMacro: MacroSession = {
      id: `macro-${Date.now()}`,
      name: newMacroName.trim(),
      start: { ...newMacroStart },
      end: { ...newMacroEnd },
      region: newMacroRegion
    };
    
    const updatedParams = {
      ...parameters,
      macros: [...parameters.macros, newMacro]
    };
    onParametersChange(updatedParams);
    // Auto-expand the new macro
    setExpandedMacros(prev => new Set(prev).add(newMacro.id));
    
    // Reset form
    setNewMacroName('');
    setNewMacroStart({ hours: 9, minutes: 0 });
    setNewMacroEnd({ hours: 10, minutes: 0 });
    setNewMacroRegion('London');
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

  // Killzone management functions with real-time updates
  const addKillzone = () => {
    if (!newKillzoneName.trim()) return;

    const newKillzone: KillzoneSession = {
      id: `killzone-${Date.now()}`,
      name: newKillzoneName.trim(),
      start: { ...newKillzoneStart },
      end: { ...newKillzoneEnd },
      region: newKillzoneRegion
    };
    
    const updatedParams = {
      ...parameters,
      killzones: [...parameters.killzones, newKillzone]
    };
    onParametersChange(updatedParams);
    // Auto-expand the new killzone
    setExpandedKillzones(prev => new Set(prev).add(newKillzone.id));
    
    // Reset form
    setNewKillzoneName('');
    setNewKillzoneStart({ hours: 14, minutes: 0 });
    setNewKillzoneEnd({ hours: 16, minutes: 0 });
    setNewKillzoneRegion('New York');
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

        {/* Market Sessions Tab */}
        <TabsContent value="market" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-cyan-400">Market Sessions</CardTitle>
                <CardDescription>Configure trading session periods and market hours</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <MarketSessionsManager
                marketSessions={parameters.marketSessions || []}
                onSessionsChange={(sessions) => 
                  onParametersChange({
                    ...parameters,
                    marketSessions: sessions
                  })
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Macro Events Tab */}
        <TabsContent value="macros" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-blue-400">Macro Events</CardTitle>
                <CardDescription>High-impact economic events and sessions</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Add New Macro Panel */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-sm font-medium text-blue-400 flex items-center space-x-2 mb-4">
                    <Plus className="h-4 w-4" />
                    <span>Add New Macro Event</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="macro-name">Macro Name</Label>
                        <Input
                          id="macro-name"
                          placeholder="e.g., London Session 1"
                          value={newMacroName}
                          onChange={(e) => setNewMacroName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="macro-region">Region</Label>
                        <Select value={newMacroRegion} onValueChange={(value: 'Tokyo' | 'London' | 'New York') => setNewMacroRegion(value)}>
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

                    <div className="space-y-2">
                      <Label>Macro Time Range</Label>
                      <TimeIntervalPicker
                        label=""
                        startTime={newMacroStart}
                        endTime={newMacroEnd}
                        onStartTimeChange={setNewMacroStart}
                        onEndTimeChange={setNewMacroEnd}
                      />
                    </div>

                    <Button 
                      onClick={addMacro}
                      disabled={!newMacroName.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Macro Event
                    </Button>
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
                            onChange={(e) => updateMacro(macro.id, 'name', e.target.value)}
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
                              onStartTimeChange={(time) => {
                                console.log('🕐 TimeIntervalPicker start time changed:', time, 'for macro:', macro.id);
                                updateMacro(macro.id, 'start', time);
                              }}
                              onEndTimeChange={(time) => {
                                console.log('🕐 TimeIntervalPicker end time changed:', time, 'for macro:', macro.id);
                                updateMacro(macro.id, 'end', time);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Region</Label>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Killzones Tab */}
        <TabsContent value="killzones" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-purple-400">Killzones</CardTitle>
                <CardDescription>High-volatility trading periods</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Add New Killzone Panel */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-sm font-medium text-purple-400 flex items-center space-x-2 mb-4">
                    <Plus className="h-4 w-4" />
                    <span>Add New Killzone</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="killzone-name">Killzone Name</Label>
                        <Input
                          id="killzone-name"
                          placeholder="e.g., London Killzone"
                          value={newKillzoneName}
                          onChange={(e) => setNewKillzoneName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="killzone-region">Region</Label>
                        <Select value={newKillzoneRegion} onValueChange={(value: 'Tokyo' | 'London' | 'New York') => setNewKillzoneRegion(value)}>
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

                    <div className="space-y-2">
                      <Label>Killzone Time Range</Label>
                      <TimeIntervalPicker
                        label=""
                        startTime={newKillzoneStart}
                        endTime={newKillzoneEnd}
                        onStartTimeChange={setNewKillzoneStart}
                        onEndTimeChange={setNewKillzoneEnd}
                      />
                    </div>

                    <Button 
                      onClick={addKillzone}
                      disabled={!newKillzoneName.trim()}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Killzone
                    </Button>
                  </div>
                </div>

                {/* Existing Killzones */}
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Events Tab - New System */}
        <TabsContent value="news" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-orange-400">News Management</CardTitle>
                <CardDescription>Manage news templates and create scheduled instances with countdown/cooldown periods</CardDescription>
              </div>
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