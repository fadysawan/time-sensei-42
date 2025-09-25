import { TradingParameters, MacroSession, KillzoneSession, TimeRange } from '../../utils/tradingLogic';
import { NewsTemplate, NewsInstance } from '../../models';

// Extended trading parameters that include news functionality
export interface ExtendedTradingParameters extends TradingParameters {
  newsTemplates: NewsTemplate[];
  newsInstances: NewsInstance[];
}

// Common props for settings components
export interface SettingsComponentProps {
  parameters: ExtendedTradingParameters;
  onParametersChange: (parameters: ExtendedTradingParameters) => void;
}

// Props for macro-specific settings
export interface MacroSettingsProps {
  parameters: ExtendedTradingParameters;
  onParametersChange: (parameters: ExtendedTradingParameters) => void;
}

// Props for killzone-specific settings
export interface KillzoneSettingsProps {
  parameters: ExtendedTradingParameters;
  onParametersChange: (parameters: ExtendedTradingParameters) => void;
}

// Region type used across components
export type Region = 'Tokyo' | 'London' | 'New York';

// Common form state interfaces
export interface MacroFormState {
  name: string;
  start: TimeRange;
  end: TimeRange;
  region: Region;
}

export interface KillzoneFormState {
  name: string;
  start: TimeRange;
  end: TimeRange;
  region: Region;
}