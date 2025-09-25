import React from 'react';
import { useTradingStatus } from '../contexts/TradingStatusContext';
import { useStatusNotifications } from '../hooks/useStatusNotifications';

export const GlobalNotifications: React.FC = () => {
  const { tradingStatus, currentPeriod } = useTradingStatus();
  
  // Initialize status notifications hook globally
  useStatusNotifications(tradingStatus, currentPeriod);

  // This component doesn't render anything visible, it just handles notifications
  return null;
};
