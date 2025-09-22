import React from 'react';
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
import { TradingParameters } from '../utils/tradingLogic';

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
  const handleTimeChange = (
    section: keyof TradingParameters,
    field: string,
    value: string
  ) => {
    const [hours, minutes] = value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;
    
    onParametersChange({
      ...parameters,
      [section]: {
        ...parameters[section],
        [field]: { hours, minutes }
      }
    });
  };

  const formatTimeInput = (time: { hours: number; minutes: number }) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Trading Parameters</SheetTitle>
          <SheetDescription>
            Customize your ICT macros, killzones, and trading sessions.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* ICT Macros */}
          <div>
            <h3 className="text-sm font-medium mb-3">ICT Macros</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">London</Label>
                <div>
                  <Label htmlFor="london-start" className="text-xs">Start</Label>
                  <Input
                    id="london-start"
                    type="time"
                    value={formatTimeInput(parameters.macros.london.start)}
                    onChange={(e) => handleTimeChange('macros', 'london.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="london-end" className="text-xs">End</Label>
                  <Input
                    id="london-end"
                    type="time"
                    value={formatTimeInput(parameters.macros.london.end)}
                    onChange={(e) => handleTimeChange('macros', 'london.end', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">New York AM</Label>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(parameters.macros.newYorkAM.start)}
                    onChange={(e) => handleTimeChange('macros', 'newYorkAM.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(parameters.macros.newYorkAM.end)}
                    onChange={(e) => handleTimeChange('macros', 'newYorkAM.end', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Label className="text-xs text-muted-foreground">New York PM</Label>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(parameters.macros.newYorkPM.start)}
                    onChange={(e) => handleTimeChange('macros', 'newYorkPM.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(parameters.macros.newYorkPM.end)}
                    onChange={(e) => handleTimeChange('macros', 'newYorkPM.end', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
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
                    value={formatTimeInput(parameters.killzones.london.start)}
                    onChange={(e) => handleTimeChange('killzones', 'london.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(parameters.killzones.london.end)}
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
                    value={formatTimeInput(parameters.killzones.newYork.start)}
                    onChange={(e) => handleTimeChange('killzones', 'newYork.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(parameters.killzones.newYork.end)}
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
                    value={formatTimeInput(parameters.sessions.premarket.start)}
                    onChange={(e) => handleTimeChange('sessions', 'premarket.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(parameters.sessions.premarket.end)}
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
                    value={formatTimeInput(parameters.sessions.lunch.start)}
                    onChange={(e) => handleTimeChange('sessions', 'lunch.start', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={formatTimeInput(parameters.sessions.lunch.end)}
                    onChange={(e) => handleTimeChange('sessions', 'lunch.end', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};