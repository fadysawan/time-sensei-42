import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Settings, Globe, MapPin, Building2, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrafficLight } from './TrafficLight';
import { useTradingStatus } from '../contexts/TradingStatusContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUserConfiguration } from '../contexts/UserConfigurationContext';

export const GlobalHeader: React.FC = () => {
  const location = useLocation();
  const { currentTime, utcTime, newYorkTime, londonTime, tokyoTime, currentDate, utcDate, newYorkDate, londonDate, tokyoDate, tradingStatus, currentPeriod, nextEvent } = useTradingStatus();
  const { theme, resolvedTheme } = useTheme();
  const { config, updateDisplayPreferences } = useUserConfiguration();
  
  const isSettingsPage = location.pathname === '/settings';

  // Theme toggle function
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    updateDisplayPreferences({ theme: nextTheme });
  };

  // Get theme icon
  const getThemeIcon = () => {
    return theme === 'dark' ? Sun : Moon;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 glass-effect shadow-lg">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trade Time Tracker
            </h1>
          </div>
                  {/* Timezone Display - Conditional based on user settings */}
                  {config.timezoneDisplay.enabled && config.timezoneDisplay.displayMode !== 'hidden' && (
                    <div className="hidden lg:flex items-center">
                      <div className="flex items-center space-x-4">
                        {/* Current Time Component with optional hover */}
                        <div className="group relative">
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 transition-colors ${
                            (config.timezoneDisplay.displayMode === 'hover' || config.timezoneDisplay.displayMode === 'both') && 
                            (config.timezoneDisplay.hoverTimezones.utc || config.timezoneDisplay.hoverTimezones.tokyo || 
                             config.timezoneDisplay.hoverTimezones.london || config.timezoneDisplay.hoverTimezones.newYork)
                              ? 'hover:bg-blue-500/20 cursor-pointer' 
                              : ''
                          }`}>
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-300">Current:</span>
                            <span className="font-mono text-blue-400 font-semibold">{currentTime}</span>
                          </div>
                          
                          {/* Hover Tooltip - only show if hover mode is enabled and there are hover timezones */}
                          {(config.timezoneDisplay.displayMode === 'hover' || config.timezoneDisplay.displayMode === 'both') && 
                           (config.timezoneDisplay.hoverTimezones.utc || config.timezoneDisplay.hoverTimezones.tokyo || 
                            config.timezoneDisplay.hoverTimezones.london || config.timezoneDisplay.hoverTimezones.newYork) && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                              <div className="p-4 space-y-3">
                                <div className="text-sm font-medium text-foreground/80 mb-2">World Clocks</div>
                                
                                {/* Show only enabled hover timezones */}
                                {config.timezoneDisplay.hoverTimezones.utc && (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Globe className="h-4 w-4 text-green-400" />
                                      <span className="text-sm text-green-300">UTC</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-mono text-green-400 font-semibold">{utcTime}</div>
                                      <div className="text-xs text-green-300/70">{utcDate}</div>
                                    </div>
                                  </div>
                                )}
                                
                                {config.timezoneDisplay.hoverTimezones.tokyo && (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Building2 className="h-4 w-4 text-red-400" />
                                      <span className="text-sm text-red-300">Tokyo</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-mono text-red-400 font-semibold">{tokyoTime}</div>
                                      <div className="text-xs text-red-300/70">{tokyoDate}</div>
                                    </div>
                                  </div>
                                )}
                                
                                {config.timezoneDisplay.hoverTimezones.london && (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Building2 className="h-4 w-4 text-orange-400" />
                                      <span className="text-sm text-orange-300">London</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-mono text-orange-400 font-semibold">{londonTime}</div>
                                      <div className="text-xs text-orange-300/70">{londonDate}</div>
                                    </div>
                                  </div>
                                )}
                                
                                {config.timezoneDisplay.hoverTimezones.newYork && (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Building2 className="h-4 w-4 text-purple-400" />
                                      <span className="text-sm text-purple-300">New York</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-mono text-purple-400 font-semibold">{newYorkTime}</div>
                                      <div className="text-xs text-purple-300/70">{newYorkDate}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Show enabled header timezones - only if header mode is enabled */}
                        {(config.timezoneDisplay.displayMode === 'header' || config.timezoneDisplay.displayMode === 'both') && (
                          <>
                            {config.timezoneDisplay.headerTimezones.utc && (
                              <div className="flex items-center space-x-2 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                                <Globe className="h-3 w-3 text-green-400" />
                                <span className="text-xs text-green-300">UTC</span>
                                <span className="font-mono text-xs text-green-400 font-semibold">{utcTime}</span>
                              </div>
                            )}
                            
                            {config.timezoneDisplay.headerTimezones.tokyo && (
                              <div className="flex items-center space-x-2 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20">
                                <Building2 className="h-3 w-3 text-red-400" />
                                <span className="text-xs text-red-300">Tokyo</span>
                                <span className="font-mono text-xs text-red-400 font-semibold">{tokyoTime}</span>
                              </div>
                            )}
                            
                            {config.timezoneDisplay.headerTimezones.london && (
                              <div className="flex items-center space-x-2 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20">
                                <Building2 className="h-3 w-3 text-orange-400" />
                                <span className="text-xs text-orange-300">London</span>
                                <span className="font-mono text-xs text-orange-400 font-semibold">{londonTime}</span>
                              </div>
                            )}
                            
                            {config.timezoneDisplay.headerTimezones.newYork && (
                              <div className="flex items-center space-x-2 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                                <Building2 className="h-3 w-3 text-purple-400" />
                                <span className="text-xs text-purple-300">NY</span>
                                <span className="font-mono text-xs text-purple-400 font-semibold">{newYorkTime}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
        </div>
        
        <div className="flex items-center space-x-4">
          <TrafficLight status={tradingStatus} reason={currentPeriod} nextEvent={nextEvent} />
          
          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="trading-button border-border/50 hover:border-primary/50 hover:bg-primary/10"
            title={`Current theme: ${theme}`}
          >
            <ThemeIcon className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">
              {theme === 'light' ? 'Light' : 'Dark'}
            </span>
          </Button>
          
          {isSettingsPage ? (
            <Button
              variant="default"
              size="sm"
              disabled
              className="trading-button bg-primary/20 border-primary/50 text-primary-foreground opacity-60 cursor-not-allowed"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          ) : (
            <Link to="/settings">
              <Button
                variant="outline"
                size="sm"
                className="trading-button border-border/50 hover:border-primary/50 hover:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
