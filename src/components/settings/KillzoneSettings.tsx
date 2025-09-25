import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TimezoneAwareTimeIntervalPicker } from '@/components/ui/timezone-aware-time-interval-picker';
import { TimezoneAwareTimePicker } from '@/components/ui/timezone-aware-time-picker';
import { Plus, Trash2, Zap, ChevronDown, ChevronRight, Target, Clock } from 'lucide-react';
import { KillzoneSession } from '../../models';
import { KillzoneSettingsProps, KillzoneFormState, Region } from './types';
import { convertUTCToUserTimezone, formatTime, getTimezoneAbbreviation, calculateDuration } from '../../utils/timeUtils';

export const KillzoneSettings: React.FC<KillzoneSettingsProps> = ({
  parameters,
  onParametersChange
}) => {
  const [expandedKillzones, setExpandedKillzones] = useState<Set<string>>(new Set());
  
  // Add killzone form state
  const [newKillzoneForm, setNewKillzoneForm] = useState<KillzoneFormState>({
    name: '',
    start: { hours: 14, minutes: 0 },
    end: { hours: 16, minutes: 0 },
    region: 'New York'
  });

  const toggleKillzoneExpand = (id: string) => {
    const newExpanded = new Set(expandedKillzones);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedKillzones(newExpanded);
  };

  const addKillzone = () => {
    if (!newKillzoneForm.name.trim()) return;

    const newKillzone: KillzoneSession = {
      id: `killzone-${Date.now()}`,
      name: newKillzoneForm.name.trim(),
      start: { ...newKillzoneForm.start },
      end: { ...newKillzoneForm.end },
      region: newKillzoneForm.region
    };
    
    const updatedParams = {
      ...parameters,
      killzones: [...parameters.killzones, newKillzone]
    };
    onParametersChange(updatedParams);
    
    // Auto-expand the new killzone
    setExpandedKillzones(prev => new Set(prev).add(newKillzone.id));
    
    // Reset form
    setNewKillzoneForm({
      name: '',
      start: { hours: 14, minutes: 0 },
      end: { hours: 16, minutes: 0 },
      region: 'New York'
    });
  };

  const removeKillzone = (index: number) => {
    const updatedParams = {
      ...parameters,
      killzones: parameters.killzones.filter((_, i) => i !== index)
    };
    onParametersChange(updatedParams);
  };

  const updateKillzone = (killzoneId: string, field: keyof KillzoneSession, value: any) => {
    const newKillzones = [...parameters.killzones];
    const index = newKillzones.findIndex(k => k.id === killzoneId);
    
    if (index === -1) {
      console.error('❌ Killzone not found with ID:', killzoneId);
      return;
    }
    
    newKillzones[index] = { ...newKillzones[index], [field]: value };
    
    const updatedParams = {
      ...parameters,
      killzones: newKillzones
    };
    onParametersChange(updatedParams);
  };

  return (
    <Card className="border-purple-500/20 bg-purple-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-purple-400">Killzone Sessions</CardTitle>
          </div>
        </div>
        <CardDescription>
          Configure high-impact trading killzones and session periods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Killzone Panel */}
        <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-500/10">
          <h3 className="font-medium text-purple-400 mb-3 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New Killzone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Killzone Name</Label>
              <Input
                placeholder="e.g., New York Killzone"
                value={newKillzoneForm.name}
                onChange={(e) => setNewKillzoneForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select 
                value={newKillzoneForm.region} 
                onValueChange={(value: Region) => setNewKillzoneForm(prev => ({ ...prev, region: value }))}
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
                label="Killzone Time Range"
                startTime={newKillzoneForm.start}
                endTime={newKillzoneForm.end}
                userTimezone={parameters.userTimezone}
                onStartTimeChange={(time) => setNewKillzoneForm(prev => ({ ...prev, start: time }))}
                onEndTimeChange={(time) => setNewKillzoneForm(prev => ({ ...prev, end: time }))}
              />
            </div>
            <div className="md:col-span-2">
              <Button 
                onClick={addKillzone}
                disabled={!newKillzoneForm.name.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Killzone
              </Button>
            </div>
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
              <div className="border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border-purple-500/20 bg-card hover:bg-card/80">
                <CollapsibleTrigger className="w-full p-5 hover:bg-muted/30 transition-all duration-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {expandedKillzones.has(killzone.id) ? 
                          <ChevronDown className="h-4 w-4 text-purple-400" /> : 
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        }
                        <div className="p-1.5 rounded-full bg-purple-500/20">
                          <Target className="h-3.5 w-3.5 text-purple-400" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-foreground">{killzone.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-md font-medium border border-purple-500/30 bg-purple-500/10 text-purple-400">
                            {killzone.region}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {(() => {
                            const startTime = convertUTCToUserTimezone(killzone.start.hours, killzone.start.minutes, parameters.userTimezone);
                            const endTime = convertUTCToUserTimezone(killzone.end.hours, killzone.end.minutes, parameters.userTimezone);
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
                      <Label className="text-sm font-medium mb-2 block">Killzone Name</Label>
                      <Input
                        value={killzone.name}
                        onChange={(e) => updateKillzone(killzone.id, 'name', e.target.value)}
                        placeholder="Killzone name"
                      />
                    </div>
                    <Button
                      onClick={() => removeKillzone(index)}
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
                          <Clock className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-400">Time Range</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <TimezoneAwareTimePicker
                            label="Start Time"
                            utcTime={killzone.start}
                            userTimezone={parameters.userTimezone}
                            onTimeChange={(time) => updateKillzone(killzone.id, 'start', time)}
                            showTimezoneInfo={false}
                          />
                          <TimezoneAwareTimePicker
                            label="End Time"
                            utcTime={killzone.end}
                            userTimezone={parameters.userTimezone}
                            onTimeChange={(time) => updateKillzone(killzone.id, 'end', time)}
                            showTimezoneInfo={false}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                          {(() => {
                            const durationMinutes = calculateDuration(killzone.start, killzone.end);
                            const hours = Math.floor(durationMinutes / 60);
                            const minutes = durationMinutes % 60;
                            return `Duration: ${hours}h ${minutes}m (${durationMinutes} minutes)`;
                          })()}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Region</Label>
                        <Select value={killzone.region} onValueChange={(value) => updateKillzone(killzone.id, 'region', value)}>
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

        {parameters.killzones.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No killzones configured</p>
            <p className="text-sm">Add your first killzone above</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};