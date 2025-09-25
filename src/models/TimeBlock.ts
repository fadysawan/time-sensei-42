/**
 * TimeBlock interface for representing time blocks on the timeline
 */
export interface TimeBlock {
  type: 'macro' | 'killzone' | 'premarket' | 'market-open' | 'lunch' | 'after-hours' | 'custom' | 'news' | 'inactive';
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  description?: string;
  probability?: 'High' | 'Low';
}
