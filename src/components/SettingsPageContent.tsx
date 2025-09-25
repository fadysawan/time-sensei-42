import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Clock, TrendingUp, Zap, Newspaper } from 'lucide-react';
import { NewsSettings } from './settings/NewsSettings';
import { MarketSessionsSettings } from './settings/MarketSessionsSettings';
import { MacroSettings } from './settings/MacroSettings';
import { KillzoneSettings } from './settings/KillzoneSettings';
import { ExtendedTradingParameters } from './settings/types';

interface SettingsPageContentProps {
  parameters: ExtendedTradingParameters;
  onParametersChange: (parameters: ExtendedTradingParameters) => void;
  onResetParameters: () => void;
}

export const SettingsPageContent: React.FC<SettingsPageContentProps> = ({
  parameters,
  onParametersChange,
  onResetParameters
}) => {
  const handleReset = () => {
    onResetParameters();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Trading Parameters
        </h1>
        <p className="text-muted-foreground">Configure your trading sessions and preferences</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="sessions" className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="sessions" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="macros" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Macros</span>
          </TabsTrigger>
          <TabsTrigger value="killzones" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Killzones</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center space-x-2">
            <Newspaper className="h-4 w-4" />
            <span>News</span>
          </TabsTrigger>
        </TabsList>

        {/* Market Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4 mt-6">
          <MarketSessionsSettings 
            marketSessions={parameters.marketSessions}
            userTimezone={parameters.userTimezone}
            onSessionsChange={(marketSessions) => {
              onParametersChange({
                ...parameters,
                marketSessions
              });
            }}
          />
        </TabsContent>

        {/* Macros Tab */}
        <TabsContent value="macros" className="space-y-4 mt-6">
          <MacroSettings
            parameters={parameters}
            onParametersChange={onParametersChange}
          />
        </TabsContent>

        {/* Killzones Tab */}
        <TabsContent value="killzones" className="space-y-4 mt-6">
          <KillzoneSettings
            parameters={parameters}
            onParametersChange={onParametersChange}
          />
        </TabsContent>

        {/* News Events Tab - New System */}
        <TabsContent value="news" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-orange-400">News Management</CardTitle>
                <CardDescription>Manage news templates and create scheduled instances with countdown/cooldown periods</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <NewsSettings
                newsTemplates={parameters.newsTemplates || []}
                newsInstances={parameters.newsInstances || []}
                userTimezone={parameters.userTimezone}
                onUpdateNewsTemplates={(newsTemplates) => {
                  onParametersChange({
                    ...parameters,
                    newsTemplates
                  });
                }}
                onUpdateNewsInstances={(newsInstances) => {
                  onParametersChange({
                    ...parameters,
                    newsInstances
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-6 border-t bg-background/50 backdrop-blur-sm sticky bottom-0 p-4 rounded-lg">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset All</span>
        </Button>
        
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Changes saved automatically</span>
        </div>
      </div>
    </div>
  );
};