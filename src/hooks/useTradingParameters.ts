import { useState, useEffect } from 'react';
import { TradingParameters, defaultTradingParameters } from '../utils/tradingLogic';

const STORAGE_KEY = 'tradingParameters';

export const useTradingParameters = () => {
  const [parameters, setParameters] = useState<TradingParameters>(defaultTradingParameters);

  // Load parameters from localStorage on mount
  useEffect(() => {
    try {
      const savedParams = localStorage.getItem(STORAGE_KEY);
      if (savedParams) {
        const parsed = JSON.parse(savedParams);
        // Validate that the saved data has the correct structure
        if (parsed && typeof parsed === 'object' && parsed.macros && parsed.killzones && parsed.sessions && parsed.newsEvents) {
          setParameters(parsed);
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