import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
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
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);

  // Update temp values when value prop changes
  useEffect(() => {
    setTempHours(value.hours);
    setTempMinutes(value.minutes);
  }, [value]);

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleHoursChange = (newHours: string) => {
    const hours = parseInt(newHours) || 0;
    if (hours >= 0 && hours <= 23) {
      setTempHours(hours);
    }
  };

  const handleMinutesChange = (newMinutes: string) => {
    const minutes = parseInt(newMinutes) || 0;
    if (minutes >= 0 && minutes <= 59) {
      setTempMinutes(minutes);
    }
  };

  const handleApply = () => {
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
            "w-full justify-start text-left font-normal h-8",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatTime(value.hours, value.minutes)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Time</div>
          
          {/* Time Display and Controls */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={incrementHours}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
              <Input
                ref={hoursRef}
                type="number"
                min="0"
                max="23"
                value={tempHours.toString().padStart(2, '0')}
                onChange={(e) => handleHoursChange(e.target.value)}
                className="w-16 h-12 text-center text-lg font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={decrementHours}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
            </div>
            
            <div className="text-2xl font-bold">:</div>
            
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={incrementMinutes}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
              <Input
                ref={minutesRef}
                type="number"
                min="0"
                max="59"
                value={tempMinutes.toString().padStart(2, '0')}
                onChange={(e) => handleMinutesChange(e.target.value)}
                className="w-16 h-12 text-center text-lg font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={decrementMinutes}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
            </div>
          </div>

          {/* Quick Time Buttons */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Quick Times</div>
            <div className="grid grid-cols-4 gap-2">
              {quickTimes.map((time) => (
                <Button
                  key={time.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTempHours(time.hours);
                    setTempMinutes(time.minutes);
                  }}
                  className="h-8 text-xs"
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};