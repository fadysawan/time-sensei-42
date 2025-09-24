import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeRange {
  hours: number;
  minutes: number;
}

interface TimeIntervalPickerProps {
  startTime: TimeRange;
  endTime: TimeRange;
  onStartTimeChange: (time: TimeRange) => void;
  onEndTimeChange: (time: TimeRange) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
}

export const TimeIntervalPicker: React.FC<TimeIntervalPickerProps> = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  className,
  disabled = false,
  label = "Time Range"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(startTime);
  const [tempEndTime, setTempEndTime] = useState(endTime);

  // Update temp values when props change
  useEffect(() => {
    setTempStartTime(startTime);
    setTempEndTime(endTime);
  }, [startTime, endTime]);

  const formatTime = (time: TimeRange) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  const formatTimeRange = () => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const handleApply = () => {
    // Validate that start time is before end time
    const startMinutes = tempStartTime.hours * 60 + tempStartTime.minutes;
    const endMinutes = tempEndTime.hours * 60 + tempEndTime.minutes;
    
    if (startMinutes >= endMinutes) {
      alert('Start time must be earlier than end time');
      return;
    }

    onStartTimeChange(tempStartTime);
    onEndTimeChange(tempEndTime);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    setIsOpen(false);
  };

  const adjustTime = (timeType: 'start' | 'end', field: 'hours' | 'minutes', delta: number) => {
    if (timeType === 'start') {
      setTempStartTime(prev => {
        if (field === 'hours') {
          const newHours = (prev.hours + delta + 24) % 24;
          return { ...prev, hours: newHours };
        } else {
          const newMinutes = (prev.minutes + delta + 60) % 60;
          return { ...prev, minutes: newMinutes };
        }
      });
    } else {
      setTempEndTime(prev => {
        if (field === 'hours') {
          const newHours = (prev.hours + delta + 24) % 24;
          return { ...prev, hours: newHours };
        } else {
          const newMinutes = (prev.minutes + delta + 60) % 60;
          return { ...prev, minutes: newMinutes };
        }
      });
    }
  };

  const quickRanges = [
    { label: '1 Hour', start: { hours: 9, minutes: 0 }, end: { hours: 10, minutes: 0 } },
    { label: '2 Hours', start: { hours: 9, minutes: 0 }, end: { hours: 11, minutes: 0 } },
    { label: '30 Min', start: { hours: 9, minutes: 0 }, end: { hours: 9, minutes: 30 } },
    { label: 'London KZ', start: { hours: 7, minutes: 0 }, end: { hours: 9, minutes: 0 } },
    { label: 'NY KZ', start: { hours: 13, minutes: 30 }, end: { hours: 16, minutes: 0 } },
    { label: 'Lunch', start: { hours: 12, minutes: 0 }, end: { hours: 13, minutes: 0 } },
  ];

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-9",
              !startTime && !endTime && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <Clock className="mr-2 h-4 w-4" />
            {formatTimeRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="start">
          <div className="space-y-4">
            <div className="text-sm font-medium">Select Time Range</div>
            
            {/* Time Range Controls */}
            <div className="grid grid-cols-2 gap-6">
              {/* Start Time */}
              <div className="space-y-3">
                <div className="text-sm text-center font-medium text-blue-600">Start Time</div>
                <div className="flex items-center justify-center space-x-2">
                  {/* Hours */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="text-xs text-muted-foreground">Hours</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustTime('start', 'hours', 1)}
                      className="h-6 w-8 p-0 text-xs"
                    >
                      +
                    </Button>
                    <div className="w-10 h-10 border rounded-md flex items-center justify-center bg-background">
                      <span className="text-lg font-mono font-bold">
                        {tempStartTime.hours.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustTime('start', 'hours', -1)}
                      className="h-6 w-8 p-0 text-xs"
                    >
                      -
                    </Button>
                  </div>
                  
                  <div className="text-xl font-bold pt-4">:</div>
                  
                  {/* Minutes */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="text-xs text-muted-foreground">Minutes</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustTime('start', 'minutes', 15)}
                      className="h-6 w-8 p-0 text-xs"
                    >
                      +
                    </Button>
                    <div className="w-10 h-10 border rounded-md flex items-center justify-center bg-background">
                      <span className="text-lg font-mono font-bold">
                        {tempStartTime.minutes.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustTime('start', 'minutes', -15)}
                      className="h-6 w-8 p-0 text-xs"
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>

              {/* End Time */}
              <div className="space-y-3">
                <div className="text-sm text-center font-medium text-purple-600">End Time</div>
                <div className="flex items-center justify-center space-x-2">
                  {/* Hours */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="text-xs text-muted-foreground">Hours</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustTime('end', 'hours', 1)}
                      className="h-6 w-8 p-0 text-xs"
                    >
                      +
                    </Button>
                    <div className="w-10 h-10 border rounded-md flex items-center justify-center bg-background">
                      <span className="text-lg font-mono font-bold">
                        {tempEndTime.hours.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustTime('end', 'hours', -1)}
                      className="h-6 w-8 p-0 text-xs"
                    >
                      -
                    </Button>
                  </div>
                  
                  <div className="text-xl font-bold pt-4">:</div>
                  
                  {/* Minutes */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="text-xs text-muted-foreground">Minutes</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustTime('end', 'minutes', 15)}
                      className="h-6 w-8 p-0 text-xs"
                    >
                      +
                    </Button>
                    <div className="w-10 h-10 border rounded-md flex items-center justify-center bg-background">
                      <span className="text-lg font-mono font-bold">
                        {tempEndTime.minutes.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustTime('end', 'minutes', -15)}
                      className="h-6 w-8 p-0 text-xs"
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Display */}
            <div className="text-center py-2 border rounded-md bg-muted/30">
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-medium">
                {(() => {
                  const startMinutes = tempStartTime.hours * 60 + tempStartTime.minutes;
                  const endMinutes = tempEndTime.hours * 60 + tempEndTime.minutes;
                  const duration = endMinutes - startMinutes;
                  const hours = Math.floor(duration / 60);
                  const minutes = duration % 60;
                  return `${hours}h ${minutes}m`;
                })()}
              </div>
            </div>

            {/* Quick Range Buttons */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">Quick Ranges</div>
              <div className="grid grid-cols-3 gap-1">
                {quickRanges.map((range) => (
                  <Button
                    key={range.label}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTempStartTime(range.start);
                      setTempEndTime(range.end);
                    }}
                    className="h-8 text-xs px-2"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={handleCancel} className="h-8 px-3 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply} className="h-8 px-3 text-xs">
                Apply Range
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};