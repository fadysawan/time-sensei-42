import { useState, useEffect } from 'react';
import { TradingParameters, defaultTradingParameters, KillzoneSession } from '../utils/tradingLogic';
import { NewsService } from '../services';

const STORAGE_KEY = 'tradingParameters';

// Migration function to convert old structures to new array formats
const migrateParameters = (oldParams: any): TradingParameters => {
  let migratedParams = { ...oldParams };

  // Migrate old killzones format (object with london/newYork properties)
  if (migratedParams.killzones && !Array.isArray(migratedParams.killzones)) {
    const migratedKillzones: KillzoneSession[] = [];
    
    // Convert old london killzone
    if (migratedParams.killzones.london) {
      migratedKillzones.push({
        id: 'london-kz',
        name: 'London KZ',
        start: migratedParams.killzones.london.start,
        end: migratedParams.killzones.london.end,
        region: 'London'
      });
    }
    
    // Convert old newYork killzone
    if (migratedParams.killzones.newYork) {
      migratedKillzones.push({
        id: 'newyork-kz',
        name: 'New York KZ',
        start: migratedParams.killzones.newYork.start,
        end: migratedParams.killzones.newYork.end,
        region: 'New York'
      });
    }
    
    migratedParams.killzones = migratedKillzones;
  }

  // Migrate old sessions format (object with premarket/lunch properties) to marketSessions array
  if (migratedParams.sessions && !migratedParams.marketSessions) {
    const marketSessions = [];
    
    // Add premarket session if it exists
    if (migratedParams.sessions.premarket) {
      marketSessions.push({
        id: 'premarket',
        name: 'Pre-Market',
        start: migratedParams.sessions.premarket.start,
        end: migratedParams.sessions.premarket.end,
        type: 'premarket',
        isActive: true
      });
    }
    
    // Add lunch session if it exists
    if (migratedParams.sessions.lunch) {
      marketSessions.push({
        id: 'lunch',
        name: 'Lunch Break',
        start: migratedParams.sessions.lunch.start,
        end: migratedParams.sessions.lunch.end,
        type: 'lunch',
        isActive: true
      });
    }

    // Add default market hours and after hours if not present
    marketSessions.push({
      id: 'market-open',
      name: 'Market Hours',
      start: { hours: 9, minutes: 30 },
      end: { hours: 16, minutes: 0 },
      type: 'market-open',
      isActive: true
    });

    marketSessions.push({
      id: 'after-hours',
      name: 'After Hours',
      start: { hours: 16, minutes: 0 },
      end: { hours: 20, minutes: 0 },
      type: 'after-hours',
      isActive: true
    });
    
    migratedParams.marketSessions = marketSessions;
    // Remove old sessions property
    delete migratedParams.sessions;
  }
  
  return migratedParams;
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
          // Migrate old parameters format if necessary
          const migratedParams = migrateParameters(parsed);
          
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
    console.log('💾 updateParameters called with:', newParameters);
    console.log('🔍 Current macros in newParameters:', newParameters.macros);
    setParameters(newParameters);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newParameters));
      console.log('✅ Parameters saved to localStorage successfully');
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