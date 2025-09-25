import { TimeRange } from './TimeRange';

/**
 * MarketSession interface for representing market trading sessions
 */
export interface MarketSession {
  id: string;
  name: string;
  start: TimeRange;
  end: TimeRange;
  type: 'premarket' | 'market-open' | 'lunch' | 'after-hours' | 'custom';
  isActive: boolean;
  description?: string;
  probability?: 'High' | 'Low';
}
