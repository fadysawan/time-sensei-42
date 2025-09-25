import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TimezoneSelector } from '../TimezoneSelector';
import { UserConfiguration } from '../../types/userConfig';
import { Settings, Globe, Bell, Monitor, Palette, Volume2, TestTube } from 'lucide-react';
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import { toast } from 'sonner';

interface UserConfigurationSettingsProps {
  config: UserConfiguration;
  onConfigChange: (config: UserConfiguration) => void;
  onTimezoneChange: (timezone: string) => void;
  onDisplayPreferencesChange: (preferences: Partial<UserConfiguration['displayPreferences']>) => void;
  onUIPreferencesChange: (preferences: Partial<UserConfiguration['uiPreferences']>) => void;
}

export const UserConfigurationSettings: React.FC<UserConfigurationSettingsProps> = ({
  config,
  onConfigChange,
  onTimezoneChange,
  onDisplayPreferencesChange,
  onUIPreferencesChange,
}) => {
  const [activeTab, setActiveTab] = useState<'timezone' | 'display' | 'notifications' | 'interface'>('timezone');
  
  // Get notification functions for testing
  const { playNotificationSound, getStatusMessage } = useStatusNotifications('red', 'Test Period');

  // Test notification functions
  const testNotification = (status: 'green' | 'amber' | 'red') => {
    const messageDetails = getStatusMessage(status, `Test ${status.toUpperCase()} notification`);
    
    // Show toast notification
    switch (messageDetails.type) {
      case 'success':
        toast.success(messageDetails.title, {
          description: messageDetails.description,
          duration: 3000,
        });
        break;
      case 'warning':
        toast.warning(messageDetails.title, {
          description: messageDetails.description,
          duration: 4000,
        });
        break;
      case 'error':
        toast.error(messageDetails.title, {
          description: messageDetails.description,
          duration: 5000,
        });
        break;
    }

    // Play notification sound
    playNotificationSound(status);
  };

  const testSoundOnly = () => {
    playNotificationSound('amber');
    toast.info('🔊 Sound Test', {
      description: 'Playing notification sound...',
      duration: 2000,
    });
  };

  const tabs = [
    { id: 'timezone', label: 'Timezone', icon: Globe },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'interface', label: 'Interface', icon: Settings },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted/20 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2 flex-1"
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'timezone' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <span>Timezone Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your timezone for the trading portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Display Timezone</Label>
                <TimezoneSelector
                  selectedTimezone={config.timezone}
                  onTimezoneChange={onTimezoneChange}
                  showCurrentTime={true}
                />
                <p className="text-xs text-muted-foreground">
                  All trading sessions are stored in UTC internally. This setting only affects how times are displayed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'display' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-green-400" />
                <span>Display Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize how information is displayed in the trading portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Show Seconds</Label>
                  <p className="text-xs text-muted-foreground">
                    Display seconds in time counters
                  </p>
                </div>
                <Switch
                  checked={config.displayPreferences.showSeconds}
                  onCheckedChange={(checked) => 
                    onDisplayPreferencesChange({ showSeconds: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Show Countdown</Label>
                  <p className="text-xs text-muted-foreground">
                    Display countdown timers for upcoming events
                  </p>
                </div>
                <Switch
                  checked={config.displayPreferences.showCountdown}
                  onCheckedChange={(checked) => 
                    onDisplayPreferencesChange({ showCountdown: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Theme</Label>
                <Select
                  value={config.displayPreferences.theme}
                  onValueChange={(value: 'light' | 'dark' | 'auto') => 
                    onDisplayPreferencesChange({ theme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-orange-400" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure notification settings for trading events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Enable Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications for trading events
                  </p>
                </div>
                <Switch
                  checked={config.displayPreferences.notifications.enabled}
                  onCheckedChange={(checked) => 
                    onDisplayPreferencesChange({
                      notifications: { ...config.displayPreferences.notifications, enabled: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Sound Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Play sound for notifications
                  </p>
                </div>
                <Switch
                  checked={config.displayPreferences.notifications.sound}
                  onCheckedChange={(checked) => 
                    onDisplayPreferencesChange({
                      notifications: { ...config.displayPreferences.notifications, sound: checked }
                    })
                  }
                  disabled={!config.displayPreferences.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Desktop Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Show browser desktop notifications
                  </p>
                </div>
                <Switch
                  checked={config.displayPreferences.notifications.desktop}
                  onCheckedChange={(checked) => 
                    onDisplayPreferencesChange({
                      notifications: { ...config.displayPreferences.notifications, desktop: checked }
                    })
                  }
                  disabled={!config.displayPreferences.notifications.enabled}
                />
              </div>

              {/* Notification Preview Section */}
              <div className="pt-6 border-t border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-orange-400" />
                    <Label className="text-sm font-medium">Notification Preview</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Experience how notifications will look and sound when trading status changes
                  </p>
                  
                  {/* Status Cards Preview */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Trading Status Notifications
                    </div>
                    
                    <div className="grid gap-3">
                      {/* Green Status Preview */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="text-sm font-medium text-green-700 dark:text-green-400">
                              🟢 GO! Perfect Trading Conditions
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-500">
                              ✅ Active trading session
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => testNotification('green')}
                          className="text-green-600 hover:text-green-700 hover:bg-green-500/10"
                        >
                          Preview
                        </Button>
                      </div>

                      {/* Amber Status Preview */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
                              🟠 CAUTION - Limited Opportunity
                            </div>
                            <div className="text-xs text-amber-600 dark:text-amber-500">
                              ⚠️ Reduced trading window
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => testNotification('amber')}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                        >
                          Preview
                        </Button>
                      </div>

                      {/* Red Status Preview */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="text-sm font-medium text-red-700 dark:text-red-400">
                              🔴 STOP - Trading Halted
                            </div>
                            <div className="text-xs text-red-600 dark:text-red-500">
                              🛑 No trading allowed
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => testNotification('red')}
                          className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sound Test Section */}
                  <div className="pt-3 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-blue-400" />
                        <div>
                          <div className="text-sm font-medium">Audio Alert</div>
                          <div className="text-xs text-muted-foreground">
                            Test the notification sound
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testSoundOnly}
                        className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>Play Sound</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'interface' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-400" />
                <span>Interface Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize the user interface behavior and appearance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Compact Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Use a more compact layout to fit more information
                  </p>
                </div>
                <Switch
                  checked={config.uiPreferences.compactMode}
                  onCheckedChange={(checked) => 
                    onUIPreferencesChange({ compactMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Show Tooltips</Label>
                  <p className="text-xs text-muted-foreground">
                    Display helpful tooltips on hover
                  </p>
                </div>
                <Switch
                  checked={config.uiPreferences.showTooltips}
                  onCheckedChange={(checked) => 
                    onUIPreferencesChange({ showTooltips: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Auto Refresh</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically refresh the trading status
                  </p>
                </div>
                <Switch
                  checked={config.uiPreferences.autoRefresh}
                  onCheckedChange={(checked) => 
                    onUIPreferencesChange({ autoRefresh: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Refresh Interval</Label>
                <Select
                  value={config.uiPreferences.refreshInterval.toString()}
                  onValueChange={(value) => 
                    onUIPreferencesChange({ refreshInterval: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 second</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
