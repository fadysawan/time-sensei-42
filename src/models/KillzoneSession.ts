import { TimeRange } from './TimeRange';

/**
 * KillzoneSession interface for representing trading killzone sessions
 */
export interface KillzoneSession {
  id: string;
  name: string;
  start: TimeRange;
  end: TimeRange;
  region: 'Tokyo' | 'London' | 'New York';
}
