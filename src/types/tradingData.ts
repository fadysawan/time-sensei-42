// Trading Data Types (separated from user configuration)
import { MacroSession, KillzoneSession, MarketSession } from '../utils/tradingLogic';
import { NewsTemplate, NewsInstance } from '../models';

export interface TradingData {
  macros: MacroSession[];
  killzones: KillzoneSession[];
  marketSessions: MarketSession[];
  newsTemplates: NewsTemplate[];
  newsInstances: NewsInstance[];
}

// Re-export the trading logic types for convenience
export type { MacroSession, KillzoneSession, MarketSession } from '../utils/tradingLogic';
export type { NewsTemplate, NewsInstance } from '../models';
