// Core data models and interfaces following Single Responsibility Principle

// Export all trading-related interfaces from separate files
export type { TimeRange } from './TimeRange';
export type { TimeBlock } from './TimeBlock';
export type { MacroSession } from './MacroSession';
export type { KillzoneSession } from './KillzoneSession';
export type { MarketSession } from './MarketSession';
export type { TradingParameters } from './TradingParameters';
export type { TradingStatus } from './TradingStatus';

// Base interface for all time-based events
export interface BaseTimeEvent {
  id: string;
  name: string;
  description?: string;
}

// Legacy TimeBlock interface (kept for backward compatibility)
export interface LegacyTimeBlock extends BaseTimeEvent {
  type: 'macro' | 'killzone' | 'premarket' | 'lunch' | 'news';
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

// News template - defines a reusable news type
export interface NewsTemplate extends BaseTimeEvent {
  type: 'news';
  countdownMinutes: number;  // How many minutes before the event to start showing countdown
  cooldownMinutes: number;   // How many minutes after the event to keep showing it
  impact: 'low' | 'medium' | 'high'; // News impact level
}

// News instance - specific occurrence of a news template
export interface NewsInstance {
  id: string;
  templateId: string;       // Reference to NewsTemplate
  name: string;             // Can override template name
  scheduledTime: Date;      // Exact date and time of the news event
  impact: 'low' | 'medium' | 'high';
  isActive: boolean;        // Whether this instance is enabled
  description?: string;
}

// Union type for all event types
export type AnyEvent = LegacyTimeBlock | NewsInstance;

export interface ActiveEvent {
  block: LegacyTimeBlock;
  timeLeft: number; // seconds until event ends
  timeUntilStart: number; // seconds until event starts (negative if already started)
  isActive: boolean;
}

export interface UpcomingEvent {
  block: LegacyTimeBlock;
  timeUntilStart: number; // seconds until event starts
}

// Legacy TradingParameters interface (kept for backward compatibility)
export interface LegacyTradingParameters {
  preMarketStart: number;
  marketOpen: number;
  lunchStart: number;
  lunchEnd: number;
  marketClose: number;
  afterHoursEnd: number;
  timezone: string;
  killzones: LegacyTimeBlock[];
  macroEvents: LegacyTimeBlock[];
  newsTemplates: NewsTemplate[];    // Available news types
  newsInstances: NewsInstance[];    // Scheduled news occurrences
}

export interface CountdownInfo {
  display: string;
  isUrgent: boolean;
  isSoon: boolean;
}

export interface TimeInfo {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

export interface EventTypeStyles {
  bg: string;
  border: string;
  text: string;
  dot: string;
  badge: string;
}

export interface StatusStyles {
  border: string;
  bg: string;
  gradient: string;
}

// Event type enumeration
export const EVENT_TYPES = {
  MACRO: 'macro',
  KILLZONE: 'killzone',
  NEWS: 'news',
  PREMARKET: 'premarket',
  LUNCH: 'lunch'
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

// News impact levels
export const NEWS_IMPACT = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export type NewsImpact = typeof NEWS_IMPACT[keyof typeof NEWS_IMPACT];

// Helper function to get event type from any event
export const getEventType = (event: AnyEvent): EventType => {
  if ('scheduledTime' in event) {
    return 'news';
  }
  return (event as LegacyTimeBlock).type;
};

// Helper function to get event name from any event
export const getEventName = (event: AnyEvent): string => {
  return event.name;
};