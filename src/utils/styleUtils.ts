// Style utilities - Following DRY principle for reusable styling logic
import { EventTypeStyles, StatusStyles, TradingStatus, EventType } from '../models';

export const getEventTypeStyles = (eventType: EventType): EventTypeStyles => {
  switch (eventType) {
    case 'macro':
      return {
        bg: 'bg-component-blue/10',
        border: 'border-component-blue/30',
        text: 'text-component-blue',
        dot: 'bg-component-blue',
        badge: 'bg-component-blue/20 text-component-blue border border-component-blue/40'
      };
    case 'killzone':
      return {
        bg: 'bg-component-purple/10',
        border: 'border-component-purple/30',
        text: 'text-component-purple',
        dot: 'bg-component-purple',
        badge: 'bg-component-purple/20 text-component-purple border border-component-purple/40'
      };
    case 'news':
      return {
        bg: 'bg-component-orange/10',
        border: 'border-component-orange/30',
        text: 'text-component-orange',
        dot: 'bg-component-orange',
        badge: 'bg-component-orange/20 text-component-orange border border-component-orange/40'
      };
    case 'premarket':
      return {
        bg: 'bg-component-yellow/10',
        border: 'border-component-yellow/30',
        text: 'text-component-yellow',
        dot: 'bg-component-yellow',
        badge: 'bg-component-yellow/20 text-component-yellow border border-component-yellow/40'
      };
    case 'lunch':
      return {
        bg: 'bg-component-red/10',
        border: 'border-component-red/30',
        text: 'text-component-red',
        dot: 'bg-component-red',
        badge: 'bg-component-red/20 text-component-red border border-component-red/40'
      };
    case 'custom':
      return {
        bg: 'bg-component-teal/10',
        border: 'border-component-teal/30',
        text: 'text-component-teal',
        dot: 'bg-component-teal',
        badge: 'bg-component-teal/20 text-component-teal border border-component-teal/40'
      };
    default:
      return {
        bg: 'bg-muted/10',
        border: 'border-muted/30',
        text: 'text-muted-foreground',
        dot: 'bg-muted-foreground',
        badge: 'bg-muted/20 text-muted-foreground border border-muted/40'
      };
  }
};

export const getStatusStyles = (status: TradingStatus): StatusStyles => {
  switch (status) {
    case 'green':
      return {
        border: 'status-green-border',
        bg: 'status-green-bg',
        gradient: 'from-component-green to-component-green'
      };
    case 'yellow':
      return {
        border: 'status-yellow-border',
        bg: 'status-yellow-bg',
        gradient: 'from-component-yellow to-component-yellow'
      };
    case 'red':
      return {
        border: 'status-red-border',
        bg: 'status-red-bg',
        gradient: 'from-component-red to-component-red'
      };
    default:
      return {
        border: 'border-muted/30',
        bg: 'bg-muted/5',
        gradient: 'from-muted to-muted'
      };
  }
};