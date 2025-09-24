import { useState, useEffect } from 'react';
import { TradingParameters, defaultTradingParameters, KillzoneSession } from '../utils/tradingLogic';
import { NewsService } from '../services';

const STORAGE_KEY = 'tradingParameters';

// Migration function to convert old killzones structure to new array format
const migrateKillzones = (oldParams: any): TradingParameters => {
  // Check if killzones is in old format (object with london/newYork properties)
  if (oldParams.killzones && !Array.isArray(oldParams.killzones)) {
    const migratedKillzones: KillzoneSession[] = [];
    
    // Convert old london killzone
    if (oldParams.killzones.london) {
      migratedKillzones.push({
        id: 'london-kz',
        name: 'London KZ',
        start: oldParams.killzones.london.start,
        end: oldParams.killzones.london.end,
        region: 'London'
      });
    }
    
    // Convert old newYork killzone
    if (oldParams.killzones.newYork) {
      migratedKillzones.push({
        id: 'newyork-kz',
        name: 'New York KZ',
        start: oldParams.killzones.newYork.start,
        end: oldParams.killzones.newYork.end,
        region: 'New York'
      });
    }
    
    return {
      ...oldParams,
      killzones: migratedKillzones
    };
  }
  
  return oldParams;
};

export const useTradingParameters = () => {
  const [parameters, setParameters] = useState<TradingParameters>(defaultTradingParameters);

  // Load parameters from localStorage on mount
  useEffect(() => {
    try {
      const savedParams = localStorage.getItem(STORAGE_KEY);
      if (savedParams) {
        const parsed = JSON.parse(savedParams);
        // Validate that the saved data has the correct structure and migrate if necessary
        if (parsed && typeof parsed === 'object') {
          // Migrate old killzones format if necessary
          const migratedParams = migrateKillzones(parsed);
          
          // Add news properties if they don't exist (migration from old version)
          if (!(migratedParams as any).newsTemplates) {
            (migratedParams as any).newsTemplates = NewsService.getDefaultNewsTemplates();
          }
          if (!(migratedParams as any).newsInstances) {
            (migratedParams as any).newsInstances = [];
          }
          
          setParameters(migratedParams);
          
          // Save the migrated parameters back to localStorage if migration occurred
          if (JSON.stringify(migratedParams) !== JSON.stringify(parsed)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedParams));
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load trading parameters from localStorage:', error);
      // If there's an error, we'll just use the default parameters
    }
  }, []);

  // Save parameters to localStorage whenever they change
  const updateParameters = (newParameters: TradingParameters) => {
    setParameters(newParameters);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newParameters));
    } catch (error) {
      console.warn('Failed to save trading parameters to localStorage:', error);
    }
  };

  // Reset parameters to default values
  const resetParameters = () => {
    setParameters(defaultTradingParameters);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear trading parameters from localStorage:', error);
    }
  };

  return {
    parameters,
    updateParameters,
    resetParameters
  };
};