import { MacroSession } from './MacroSession';
import { KillzoneSession } from './KillzoneSession';
import { MarketSession } from './MarketSession';
import { NewsTemplate, NewsInstance } from './index';

/**
 * TradingParameters interface for representing all trading configuration
 */
export interface TradingParameters {
  macros: MacroSession[];
  killzones: KillzoneSession[];
  marketSessions: MarketSession[];
  newsTemplates: NewsTemplate[];
  newsInstances: NewsInstance[];
  userTimezone: string; // User's preferred timezone for display
}
