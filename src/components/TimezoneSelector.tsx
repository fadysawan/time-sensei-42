import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock, Globe } from 'lucide-react';
import { TRADING_TIMEZONES, TIMEZONES } from '../constants';
import { getTimeInTimezone } from '../utils/timeUtils';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  showCurrentTime?: boolean;
  className?: string;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  selectedTimezone,
  onTimezoneChange,
  showCurrentTime = true,
  className = ''
}) => {
  const getTimezoneDisplayName = (timezone: string): string => {
    const timezoneNames: Record<string, string> = {
      'UTC': 'UTC (Coordinated Universal Time)',
      'Europe/London': 'London (GMT/BST)',
      'America/New_York': 'New York (EST/EDT)',
      'Asia/Tokyo': 'Tokyo (JST)',
      'Australia/Sydney': 'Sydney (AEST/AEDT)',
      'Europe/Berlin': 'Frankfurt (CET/CEST)',
      'Asia/Dubai': 'Dubai (GST)',
      'Asia/Singapore': 'Singapore (SGT)',
      'Asia/Hong_Kong': 'Hong Kong (HKT)',
      'Asia/Beirut': 'Beirut (EET/EEST)',
      'America/Los_Angeles': 'Los Angeles (PST/PDT)',
      'America/Chicago': 'Chicago (CST/CDT)',
      'America/Toronto': 'Toronto (EST/EDT)',
      'America/Sao_Paulo': 'São Paulo (BRT)',
      'Europe/Moscow': 'Moscow (MSK)',
      'Europe/Istanbul': 'Istanbul (TRT)',
      'Africa/Johannesburg': 'Johannesburg (SAST)',
      'Asia/Kolkata': 'Mumbai (IST)',
      'Asia/Shanghai': 'Shanghai (CST)',
      'Asia/Seoul': 'Seoul (KST)',
      'Australia/Melbourne': 'Melbourne (AEST/AEDT)',
    };
    
    return timezoneNames[timezone] || timezone;
  };

  const getCurrentTimeInTimezone = (timezone: string): string => {
    try {
      const timeInfo = getTimeInTimezone(timezone);
      return timeInfo.formatted;
    } catch (error) {
      return '--:--:--';
    }
  };

  const getTimezoneOffset = (timezone: string): string => {
    try {
      if (timezone === 'UTC') return 'UTC';
      
      const now = new Date();
      const utcTime = new Date(now.toLocaleString("en-US", {timeZone: "UTC"}));
      const targetTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
      const offset = (targetTime.getTime() - utcTime.getTime()) / (1000 * 60 * 60);
      
      if (offset === 0) return 'UTC';
      if (offset > 0) return `UTC+${Math.round(offset)}`;
      return `UTC${Math.round(offset)}`;
    } catch (error) {
      return '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="timezone-select" className="text-sm font-medium text-blue-400 flex items-center space-x-2">
        <Globe className="h-4 w-4" />
        <span>Display Timezone</span>
      </Label>
      
      <Select value={selectedTimezone} onValueChange={onTimezoneChange}>
        <SelectTrigger id="timezone-select" className="w-full">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {/* Trading Timezones Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
            Trading Centers
          </div>
          {Object.entries(TRADING_TIMEZONES).map(([key, timezone]) => (
            <SelectItem key={timezone} value={timezone} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">{getTimezoneDisplayName(timezone)}</span>
                {showCurrentTime && (
                  <span className="text-xs text-muted-foreground">
                    {getCurrentTimeInTimezone(timezone)} {getTimezoneOffset(timezone)}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
          
          {/* Separator */}
          <div className="border-t border-border/50 my-1" />
          
          {/* All Timezones Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
            All Timezones
          </div>
          {Object.entries(TIMEZONES)
            .filter(([key, timezone]) => !Object.values(TRADING_TIMEZONES).includes(timezone))
            .map(([key, timezone]) => (
            <SelectItem key={timezone} value={timezone} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">{getTimezoneDisplayName(timezone)}</span>
                {showCurrentTime && (
                  <span className="text-xs text-muted-foreground">
                    {getCurrentTimeInTimezone(timezone)} {getTimezoneOffset(timezone)}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showCurrentTime && (
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Current time: {getCurrentTimeInTimezone(selectedTimezone)}</span>
        </div>
      )}
    </div>
  );
};
