import React from 'react';
import { TimePicker } from './time-picker';
import { Label } from './label';
import { TimeRange } from '../../utils/tradingLogic';
import { convertUTCToUserTimezone, convertUserTimezoneToUTC, getTimezoneAbbreviation } from '../../utils/timeUtils';
import { Clock, Globe } from 'lucide-react';

interface TimezoneAwareTimePickerProps {
  label: string;
  utcTime: TimeRange;
  userTimezone: string;
  onTimeChange: (utcTime: TimeRange) => void;
  showTimezoneInfo?: boolean;
  className?: string;
}

export const TimezoneAwareTimePicker: React.FC<TimezoneAwareTimePickerProps> = ({
  label,
  utcTime,
  userTimezone,
  onTimeChange,
  showTimezoneInfo = true,
  className = ''
}) => {
  // Convert UTC time to user's timezone for display
  const userTime = convertUTCToUserTimezone(utcTime.hours, utcTime.minutes, userTimezone);
  
  const handleTimeChange = (newUserTime: TimeRange) => {
    // Always convert user's timezone back to UTC for storage
    // This ensures the conversion happens silently without the user seeing it
    const newUtcTime = convertUserTimezoneToUTC(newUserTime.hours, newUserTime.minutes, userTimezone);
    onTimeChange(newUtcTime);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span>{label}</span>
        {showTimezoneInfo && (
          <span className="text-xs text-muted-foreground">
            ({userTimezone})
          </span>
        )}
      </Label>
      
      <TimePicker
        value={{ hours: userTime.hours, minutes: userTime.minutes }}
        onChange={handleTimeChange}
      />
      
      {showTimezoneInfo && (
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" />
          <span>
            Local time in {getTimezoneAbbreviation(userTimezone)}
          </span>
        </div>
      )}
    </div>
  );
};
