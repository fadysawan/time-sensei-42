import React from 'react';
import { TimezoneAwareTimePicker } from './timezone-aware-time-picker';
import { TimeRange } from '../../utils/tradingLogic';
import { Clock } from 'lucide-react';
import { getTimezoneAbbreviation, calculateDuration, convertUTCToUserTimezone } from '../../utils/timeUtils';

interface TimezoneAwareTimeIntervalPickerProps {
  label: string;
  startTime: TimeRange;
  endTime: TimeRange;
  userTimezone: string;
  onStartTimeChange: (utcTime: TimeRange) => void;
  onEndTimeChange: (utcTime: TimeRange) => void;
  className?: string;
}

export const TimezoneAwareTimeIntervalPicker: React.FC<TimezoneAwareTimeIntervalPickerProps> = ({
  label,
  startTime,
  endTime,
  userTimezone,
  onStartTimeChange,
  onEndTimeChange,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-medium text-blue-400">{label}</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TimezoneAwareTimePicker
          label="Start Time"
          utcTime={startTime}
          userTimezone={userTimezone}
          onTimeChange={onStartTimeChange}
          showTimezoneInfo={false}
        />
        
        <TimezoneAwareTimePicker
          label="End Time"
          utcTime={endTime}
          userTimezone={userTimezone}
          onTimeChange={onEndTimeChange}
          showTimezoneInfo={false}
        />
      </div>
      
      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {(() => {
              // Convert UTC times to user timezone for proper duration calculation
              const userStartTime = convertUTCToUserTimezone(startTime.hours, startTime.minutes, userTimezone);
              const userEndTime = convertUTCToUserTimezone(endTime.hours, endTime.minutes, userTimezone);
              const durationMinutes = calculateDuration(userStartTime, userEndTime);
              const hours = Math.floor(durationMinutes / 60);
              const minutes = durationMinutes % 60;
              
              return (
                <>
                  <span>Duration: {hours}h {minutes}m ({durationMinutes} minutes)</span>
                  {(() => {
                    const startMinutes = userStartTime.hours * 60 + userStartTime.minutes;
                    const endMinutes = userEndTime.hours * 60 + userEndTime.minutes;
                    const isOvernight = endMinutes < startMinutes;
                    return isOvernight ? (
                      <span className="text-amber-500 font-medium">(Overnight)</span>
                    ) : null;
                  })()}
                </>
              );
            })()}
          </div>
          <span className="text-muted-foreground/70">
            Times displayed in {getTimezoneAbbreviation(userTimezone)}
          </span>
        </div>
      </div>
    </div>
  );
};
