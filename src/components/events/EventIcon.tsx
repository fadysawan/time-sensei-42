// EventIcon Component - Single Responsibility: Display event type icons
import React from 'react';
import { Target, Newspaper, Activity, Globe, DollarSign, TrendingUp } from 'lucide-react';
import { EventType } from '../../models';

interface EventIconProps {
  eventType: EventType;
  size?: string;
  className?: string;
}

export const EventIcon: React.FC<EventIconProps> = ({ 
  eventType, 
  size = "w-4 h-4",
  className = "" 
}) => {
  const iconProps = {
    className: `${size} ${className}`
  };

  switch (eventType) {
    case 'macro':
      return <TrendingUp {...iconProps} className={`${size} text-blue-400 ${className}`} />;
    case 'killzone':
      return <Target {...iconProps} className={`${size} text-purple-400 ${className}`} />;
    case 'news':
      return <Newspaper {...iconProps} className={`${size} text-orange-400 ${className}`} />;
    case 'premarket':
      return <Activity {...iconProps} className={`${size} text-yellow-400 ${className}`} />;
    case 'lunch':
      return <DollarSign {...iconProps} className={`${size} text-red-400 ${className}`} />;
    default:
      return <Globe {...iconProps} className={`${size} text-gray-400 ${className}`} />;
  }
};