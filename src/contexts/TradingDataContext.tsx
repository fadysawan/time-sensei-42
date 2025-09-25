import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TradingData } from '../types/tradingData';
import { defaultTradingParameters } from '../utils/tradingLogic';
import { NewsService } from '../services';
import { KillzoneSession } from '../utils/tradingLogic';

const TRADING_DATA_STORAGE_KEY = 'tradingData';

// Migration function to convert old structures to new array formats
const migrateTradingData = (oldData: any): TradingData => {
  let migratedData = { ...oldData };

  // Migrate old killzones format (object with london/newYork properties)
  if (migratedData.killzones && !Array.isArray(migratedData.killzones)) {
    const migratedKillzones: KillzoneSession[] = [];
    
    // Convert old london killzone
    if (migratedData.killzones.london) {
      migratedKillzones.push({
        id: 'london-kz',
        name: 'London KZ',
        start: migratedData.killzones.london.start,
        end: migratedData.killzones.london.end,
        region: 'London'
      });
    }
    
    // Convert old newYork killzone
    if (migratedData.killzones.newYork) {
      migratedKillzones.push({
        id: 'newyork-kz',
        name: 'New York KZ',
        start: migratedData.killzones.newYork.start,
        end: migratedData.killzones.newYork.end,
        region: 'New York'
      });
    }
    
    migratedData.killzones = migratedKillzones;
  }

  // Migrate old sessions format (object with premarket/lunch properties) to marketSessions array
  if (migratedData.sessions && !Array.isArray(migratedData.sessions)) {
    const migratedSessions = [];
    
    if (migratedData.sessions.premarket) {
      migratedSessions.push({
        id: 'premarket',
        name: 'Pre-Market',
        start: migratedData.sessions.premarket.start,
        end: migratedData.sessions.premarket.end,
        type: 'premarket',
        isActive: true
      });
    }
    
    if (migratedData.sessions.lunch) {
      migratedSessions.push({
        id: 'lunch',
        name: 'Lunch Break',
        start: migratedData.sessions.lunch.start,
        end: migratedData.sessions.lunch.end,
        type: 'lunch',
        isActive: true
      });
    }
    
    migratedData.marketSessions = migratedSessions;
    delete migratedData.sessions;
  }

  // Add news properties if they don't exist (migration from old version)
  if (!migratedData.newsTemplates) {
    migratedData.newsTemplates = NewsService.getDefaultNewsTemplates();
  }
  if (!migratedData.newsInstances) {
    migratedData.newsInstances = [];
  }

  return migratedData;
};

interface TradingDataContextType {
  tradingData: TradingData;
  updateTradingData: (newData: TradingData) => void;
  updateMacros: (macros: TradingData['macros']) => void;
  updateKillzones: (killzones: TradingData['killzones']) => void;
  updateMarketSessions: (marketSessions: TradingData['marketSessions']) => void;
  updateNewsTemplates: (newsTemplates: TradingData['newsTemplates']) => void;
  updateNewsInstances: (newsInstances: TradingData['newsInstances']) => void;
  resetTradingData: () => void;
}

const TradingDataContext = createContext<TradingDataContextType | undefined>(undefined);

interface TradingDataProviderProps {
  children: ReactNode;
}

export const TradingDataProvider: React.FC<TradingDataProviderProps> = ({ children }) => {
  const [tradingData, setTradingData] = useState<TradingData>(() => ({
    macros: defaultTradingParameters.macros,
    killzones: defaultTradingParameters.killzones,
    marketSessions: defaultTradingParameters.marketSessions,
    newsTemplates: defaultTradingParameters.newsTemplates,
    newsInstances: defaultTradingParameters.newsInstances,
  }));

  // Debug: Log when trading data state changes
  useEffect(() => {
    console.log('📊 TradingDataContext: state changed', {
      killzonesCount: tradingData.killzones.length,
      killzones: tradingData.killzones.map(k => ({ name: k.name, start: k.start, end: k.end }))
    });
  }, [tradingData]);

  // Load trading data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(TRADING_DATA_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && typeof parsed === 'object') {
          // Migrate old parameters format if necessary
          const migratedData = migrateTradingData(parsed);
          setTradingData(migratedData);
          
          // Save the migrated data back to localStorage if migration occurred
          if (JSON.stringify(migratedData) !== JSON.stringify(parsed)) {
            localStorage.setItem(TRADING_DATA_STORAGE_KEY, JSON.stringify(migratedData));
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load trading data from localStorage:', error);
    }
  }, []);

  // Save trading data to localStorage whenever it changes
  const updateTradingData = useCallback((newData: TradingData) => {
    console.log('💾 TradingDataContext: updateTradingData called', {
      newKillzonesCount: newData.killzones.length,
      newKillzones: newData.killzones.map(k => ({ name: k.name, start: k.start, end: k.end }))
    });
    
    setTradingData(newData);
    try {
      localStorage.setItem(TRADING_DATA_STORAGE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.warn('Failed to save trading data to localStorage:', error);
    }
  }, []);

  // Update specific trading data sections
  const updateMacros = useCallback((macros: TradingData['macros']) => {
    updateTradingData({
      ...tradingData,
      macros,
    });
  }, [tradingData, updateTradingData]);

  const updateKillzones = useCallback((killzones: TradingData['killzones']) => {
    console.log('🔧 TradingDataContext: updateKillzones called', {
      newKillzonesCount: killzones.length,
      newKillzones: killzones.map(k => ({ name: k.name, start: k.start, end: k.end })),
      currentTradingDataKillzones: tradingData.killzones.length
    });
    
    // Use functional state update to ensure we get the latest state
    setTradingData(prevData => {
      const newData = {
        ...prevData,
        killzones,
      };
      console.log('🔄 TradingDataContext: setTradingData called with new data', {
        prevKillzonesCount: prevData.killzones.length,
        newKillzonesCount: newData.killzones.length,
        prevKillzones: prevData.killzones.map(k => ({ name: k.name, start: k.start, end: k.end })),
        newKillzones: newData.killzones.map(k => ({ name: k.name, start: k.start, end: k.end }))
      });
      
      // Save to localStorage
      try {
        localStorage.setItem(TRADING_DATA_STORAGE_KEY, JSON.stringify(newData));
      } catch (error) {
        console.warn('Failed to save trading data to localStorage:', error);
      }
      
      return newData;
    });
    
    // Note: Event bus emission removed to prevent cascading updates
    // The context will automatically trigger re-renders when state changes
  }, [tradingData.killzones.length]);

  const updateMarketSessions = useCallback((marketSessions: TradingData['marketSessions']) => {
    updateTradingData({
      ...tradingData,
      marketSessions,
    });
  }, [tradingData, updateTradingData]);

  const updateNewsTemplates = useCallback((newsTemplates: TradingData['newsTemplates']) => {
    updateTradingData({
      ...tradingData,
      newsTemplates,
    });
  }, [tradingData, updateTradingData]);

  const updateNewsInstances = useCallback((newsInstances: TradingData['newsInstances']) => {
    updateTradingData({
      ...tradingData,
      newsInstances,
    });
  }, [tradingData, updateTradingData]);

  // Reset trading data to default values
  const resetTradingData = useCallback(() => {
    const resetData = {
      macros: defaultTradingParameters.macros,
      killzones: defaultTradingParameters.killzones,
      marketSessions: defaultTradingParameters.marketSessions,
      newsTemplates: defaultTradingParameters.newsTemplates,
      newsInstances: defaultTradingParameters.newsInstances,
    };
    setTradingData(resetData);
    try {
      localStorage.removeItem(TRADING_DATA_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear trading data from localStorage:', error);
    }
  }, []);

  const value: TradingDataContextType = {
    tradingData,
    updateTradingData,
    updateMacros,
    updateKillzones,
    updateMarketSessions,
    updateNewsTemplates,
    updateNewsInstances,
    resetTradingData,
  };

  return (
    <TradingDataContext.Provider value={value}>
      {children}
    </TradingDataContext.Provider>
  );
};

export const useTradingData = (): TradingDataContextType => {
  const context = useContext(TradingDataContext);
  if (context === undefined) {
    throw new Error('useTradingData must be used within a TradingDataProvider');
  }
  return context;
};
