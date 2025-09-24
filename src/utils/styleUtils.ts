// Style utilities - Following DRY principle for reusable styling logic
import { EventTypeStyles, StatusStyles, TradingStatus, EventType } from '../models';

export const getEventTypeStyles = (eventType: EventType): EventTypeStyles => {
  switch (eventType) {
    case 'macro':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        dot: 'bg-blue-400',
        badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
      };
    case 'killzone':
      return {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        dot: 'bg-purple-400',
        badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
      };
    case 'news':
      return {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        dot: 'bg-orange-400',
        badge: 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
      };
    case 'premarket':
      return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        dot: 'bg-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
      };
    case 'lunch':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        dot: 'bg-red-400',
        badge: 'bg-red-500/20 text-red-300 border border-red-500/40'
      };
    default:
      return {
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        text: 'text-gray-400',
        dot: 'bg-gray-400',
        badge: 'bg-gray-500/20 text-gray-300 border border-gray-500/40'
      };
  }
};

export const getStatusStyles = (status: TradingStatus): StatusStyles => {
  switch (status) {
    case 'green':
      return {
        border: 'border-green-500/30',
        bg: 'bg-green-500/5',
        gradient: 'from-green-500 to-emerald-600'
      };
    case 'yellow':
      return {
        border: 'border-yellow-500/30',
        bg: 'bg-yellow-500/5',
        gradient: 'from-yellow-500 to-orange-600'
      };
    case 'red':
      return {
        border: 'border-red-500/30',
        bg: 'bg-red-500/5',
        gradient: 'from-red-500 to-pink-600'
      };
    default:
      return {
        border: 'border-gray-500/30',
        bg: 'bg-gray-500/5',
        gradient: 'from-gray-500 to-slate-600'
      };
  }
};