import { TimeRange } from './TimeRange';

/**
 * MacroSession interface for representing trading macro sessions
 */
export interface MacroSession {
  id: string;
  name: string;
  start: TimeRange;
  end: TimeRange;
  region: 'Tokyo' | 'London' | 'New York';
  description?: string;
  probability?: 'High' | 'Low';
}
