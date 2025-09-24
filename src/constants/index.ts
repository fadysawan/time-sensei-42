// Application constants following DRY principle
export const APP_CONFIG = {
  UPDATE_INTERVAL: 1000, // 1 second
  MAX_UPCOMING_EVENTS: 6,
  URGENT_THRESHOLD_SECONDS: 900, // 15 minutes
  SOON_THRESHOLD_SECONDS: 3600,  // 1 hour
} as const;

export const TIMEZONES = {
  BEIRUT: 'Asia/Beirut',
  NEW_YORK: 'America/New_York',
} as const;

export const EVENT_COLORS = {
  macro: {
    primary: 'blue',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  killzone: {
    primary: 'purple',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  news: {
    primary: 'orange',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  premarket: {
    primary: 'yellow',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  lunch: {
    primary: 'red',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
} as const;

export const TRADING_STATUS_COLORS = {
  green: {
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    gradient: 'from-green-500 to-emerald-600',
  },
  yellow: {
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/5',
    gradient: 'from-yellow-500 to-orange-600',
  },
  red: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    gradient: 'from-red-500 to-pink-600',
  },
} as const;