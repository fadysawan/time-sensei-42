import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: { hours: number; minutes: number };
  onChange: (time: { hours: number; minutes: number }) => void;
  className?: string;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  className,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempHours, setTempHours] = useState(value.hours);
  const [tempMinutes, setTempMinutes] = useState(value.minutes);

  // Update temp values when value prop changes
  useEffect(() => {
    setTempHours(value.hours);
    setTempMinutes(value.minutes);
  }, [value.hours, value.minutes]);

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleApply = () => {
    // Always call onChange to ensure the time is updated
    onChange({ hours: tempHours, minutes: tempMinutes });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempHours(value.hours);
    setTempMinutes(value.minutes);
    setIsOpen(false);
  };

  const incrementHours = () => {
    setTempHours(prev => (prev + 1) % 24);
  };

  const decrementHours = () => {
    setTempHours(prev => prev === 0 ? 23 : prev - 1);
  };

  const incrementMinutes = () => {
    setTempMinutes(prev => (prev + 1) % 60);
  };

  const decrementMinutes = () => {
    setTempMinutes(prev => prev === 0 ? 59 : prev - 1);
  };

  const quickTimes = [
    { label: '9:00', hours: 9, minutes: 0 },
    { label: '9:30', hours: 9, minutes: 30 },
    { label: '10:00', hours: 10, minutes: 0 },
    { label: '12:00', hours: 12, minutes: 0 },
    { label: '15:00', hours: 15, minutes: 0 },
    { label: '16:00', hours: 16, minutes: 0 },
    { label: '18:00', hours: 18, minutes: 0 },
    { label: '20:00', hours: 20, minutes: 0 },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-8 text-xs",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-1 h-3 w-3" />
          {formatTime(value.hours, value.minutes)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium">Select Time</div>
          
          {/* Time Display and Controls */}
          <div className="flex items-center justify-center space-x-3">
            <div className="flex flex-col items-center space-y-1">
              <div className="text-xs text-muted-foreground">Hours</div>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementHours}
                className="h-7 w-8 p-0 text-xs"
              >
                +
              </Button>
              <div className="w-12 h-12 border rounded-md flex items-center justify-center bg-background">
                <span className="text-lg font-mono font-bold">
                  {tempHours.toString().padStart(2, '0')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={decrementHours}
                className="h-7 w-8 p-0 text-xs"
              >
                -
              </Button>
            </div>
            
            <div className="text-2xl font-bold pt-6">:</div>
            
            <div className="flex flex-col items-center space-y-1">
              <div className="text-xs text-muted-foreground">Minutes</div>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementMinutes}
                className="h-7 w-8 p-0 text-xs"
              >
                +
              </Button>
              <div className="w-12 h-12 border rounded-md flex items-center justify-center bg-background">
                <span className="text-lg font-mono font-bold">
                  {tempMinutes.toString().padStart(2, '0')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={decrementMinutes}
                className="h-7 w-8 p-0 text-xs"
              >
                -
              </Button>
            </div>
          </div>

          {/* Quick Time Buttons */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Quick Times</div>
            <div className="grid grid-cols-4 gap-1">
              {quickTimes.map((time) => (
                <Button
                  key={time.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTempHours(time.hours);
                    setTempMinutes(time.minutes);
                  }}
                  className="h-7 text-xs px-2"
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleCancel} className="h-7 px-3 text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply} className="h-7 px-3 text-xs">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};