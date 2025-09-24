import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, RotateCcw, Clock, Settings as SettingsIcon, TrendingUp, Zap, Newspaper } from 'lucide-react';
import { TradingParameters, TimeBlock, NewsTemplate, NewsInstance } from '../models';
import { NewsSettings } from './settings/NewsSettings';

interface SettingsContentProps {
  parameters: TradingParameters;
  onParametersChange: (parameters: TradingParameters) => void;
  onResetParameters: () => void;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  parameters,
  onParametersChange,
  onResetParameters
}) => {
  const [localParams, setLocalParams] = useState(parameters);

  // Sync localParams with parameters when parameters change
  React.useEffect(() => {
    setLocalParams(parameters);
  }, [parameters]);

  const handleSave = () => {
    onParametersChange(localParams);
  };

  const handleReset = () => {
    onResetParameters();
  };

  // Helper functions for managing time blocks
  const addMacroEvent = () => {
    const newMacro: TimeBlock = {
      id: `macro-${Date.now()}`,
      name: 'New Macro Event',
      type: 'macro',
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
      description: 'New macro event'
    };
    
    const updatedParams = {
      ...localParams,
      macroEvents: [...localParams.macroEvents, newMacro]
    };
    setLocalParams(updatedParams);
    onParametersChange(updatedParams);
  };

  const removeMacroEvent = (index: number) => {
    const updatedParams = {
      ...localParams,
      macroEvents: localParams.macroEvents.filter((_, i) => i !== index)
    };
    setLocalParams(updatedParams);
    onParametersChange(updatedParams);
  };

  const updateMacroEvent = (index: number, field: keyof TimeBlock, value: any) => {
    const newMacros = [...localParams.macroEvents];
    newMacros[index] = { ...newMacros[index], [field]: value };
    
    const updatedParams = {
      ...localParams,
      macroEvents: newMacros
    };
    setLocalParams(updatedParams);
    onParametersChange(updatedParams);
  };

  const addKillzone = () => {
    const newKillzone: TimeBlock = {
      id: `killzone-${Date.now()}`,
      name: 'New Killzone',
      type: 'killzone',
      startHour: 14,
      startMinute: 0,
      endHour: 16,
      endMinute: 0,
      description: 'New killzone session'
    };
    
    const updatedParams = {
      ...localParams,
      killzones: [...localParams.killzones, newKillzone]
    };
    setLocalParams(updatedParams);
    onParametersChange(updatedParams);
  };

  const removeKillzone = (index: number) => {
    const updatedParams = {
      ...localParams,
      killzones: localParams.killzones.filter((_, i) => i !== index)
    };
    setLocalParams(updatedParams);
    onParametersChange(updatedParams);
  };

  const updateKillzone = (index: number, field: keyof TimeBlock, value: any) => {
    const newKillzones = [...localParams.killzones];
    newKillzones[index] = { ...newKillzones[index], [field]: value };
    
    const updatedParams = {
      ...localParams,
      killzones: newKillzones
    };
    setLocalParams(updatedParams);
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-400">Market Hours Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="premarket">Pre-Market Start</Label>
                <div className="flex space-x-2">
                  <Input
                    id="premarket-hour"
                    type="number"
                    min="0"
                    max="23"
                    value={Math.floor(localParams.preMarketStart / 60)}
                    onChange={(e) => {
                      const hour = parseInt(e.target.value) || 0;
                      const minute = localParams.preMarketStart % 60;
                      const updatedParams = { ...localParams, preMarketStart: hour * 60 + minute };
                      setLocalParams(updatedParams);
                      onParametersChange(updatedParams);
                    }}
                    className="w-20"
                  />
                  <Input
                    id="premarket-minute"
                    type="number"
                    min="0"
                    max="59"
                    value={localParams.preMarketStart % 60}
                    onChange={(e) => {
                      const minute = parseInt(e.target.value) || 0;
                      const hour = Math.floor(localParams.preMarketStart / 60);
                      const updatedParams = { ...localParams, preMarketStart: hour * 60 + minute };
                      setLocalParams(updatedParams);
                      onParametersChange(updatedParams);
                    }}
                    className="w-20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="market-open">Market Open</Label>
                <div className="flex space-x-2">
                  <Input
                    id="market-open-hour"
                    type="number"
                    min="0"
                    max="23"
                    value={Math.floor(localParams.marketOpen / 60)}
                    onChange={(e) => {
                      const hour = parseInt(e.target.value) || 0;
                      const minute = localParams.marketOpen % 60;
                      const updatedParams = { ...localParams, marketOpen: hour * 60 + minute };
                      setLocalParams(updatedParams);
                      onParametersChange(updatedParams);
                    }}
                    className="w-20"
                  />
                  <Input
                    id="market-open-minute"
                    type="number"
                    min="0"
                    max="59"
                    value={localParams.marketOpen % 60}
                    onChange={(e) => {
                      const minute = parseInt(e.target.value) || 0;
                      const hour = Math.floor(localParams.marketOpen / 60);
                      const updatedParams = { ...localParams, marketOpen: hour * 60 + minute };
                      setLocalParams(updatedParams);
                      onParametersChange(updatedParams);
                    }}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Macro Events Tab */}
        <TabsContent value="macros" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-blue-400">Macro Events</h3>
            <Button onClick={addMacroEvent} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Macro
            </Button>
          </div>

          <div className="space-y-3">
            {localParams.macroEvents.map((macro, index) => (
              <div key={macro.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={macro.name}
                    onChange={(e) => updateMacroEvent(index, 'name', e.target.value)}
                    className="flex-1 mr-2"
                    placeholder="Event name"
                  />
                  <Button
                    onClick={() => removeMacroEvent(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={macro.startHour}
                        onChange={(e) => updateMacroEvent(index, 'startHour', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={macro.startMinute}
                        onChange={(e) => updateMacroEvent(index, 'startMinute', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={macro.endHour}
                        onChange={(e) => updateMacroEvent(index, 'endHour', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={macro.endMinute}
                        onChange={(e) => updateMacroEvent(index, 'endMinute', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Killzones Tab */}
        <TabsContent value="killzones" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-purple-400">Killzones</h3>
            <Button onClick={addKillzone} size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Killzone
            </Button>
          </div>

          <div className="space-y-3">
            {localParams.killzones.map((killzone, index) => (
              <div key={killzone.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={killzone.name}
                    onChange={(e) => updateKillzone(index, 'name', e.target.value)}
                    className="flex-1 mr-2"
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
                    <Label>Start Time</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={killzone.startHour}
                        onChange={(e) => updateKillzone(index, 'startHour', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={killzone.startMinute}
                        onChange={(e) => updateKillzone(index, 'startMinute', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={killzone.endHour}
                        onChange={(e) => updateKillzone(index, 'endHour', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={killzone.endMinute}
                        onChange={(e) => updateKillzone(index, 'endMinute', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-4 mt-6">
          <NewsSettings
            newsTemplates={localParams.newsTemplates || []}
            newsInstances={localParams.newsInstances || []}
            onUpdateNewsTemplates={(newsTemplates) => {
              const updatedParams = {
                ...localParams,
                newsTemplates
              };
              setLocalParams(updatedParams);
              onParametersChange(updatedParams);
            }}
            onUpdateNewsInstances={(newsInstances) => {
              const updatedParams = {
                ...localParams,
                newsInstances
              };
              setLocalParams(updatedParams);
              onParametersChange(updatedParams);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleReset}
          className="flex items-center space-x-1"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset All</span>
        </Button>
        
        <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <SettingsIcon className="h-3 w-3 mr-1" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};