import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Timeline } from '../components/Timeline';
import { SettingsPageContent } from '../components/SettingsPageContent';
import { useTradeTime } from '../hooks/useTradeTime';
import { useTradingParameters } from '../hooks/useTradingParameters';

const Settings: React.FC = () => {
  const { parameters, updateParameters, resetParameters } = useTradingParameters();
  const { currentTime } = useTradeTime(parameters);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 glass-effect shadow-lg">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trading Settings
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
            <Clock className="h-4 w-4 text-blue-300" />
            <span className="text-blue-300">Current:</span>
            <span className="font-mono text-blue-400 font-semibold">{currentTime}</span>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="container px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          {/* Left Column - Settings Panel */}
          <div className="space-y-6">
            <div className="trading-card p-6 h-full overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-blue-400 mb-2">Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Adjust your trading parameters and view the changes in real-time on the timeline preview.
                </p>
              </div>
              
              {/* Full Settings Interface */}
              <SettingsPageContent
                parameters={parameters}
                onParametersChange={updateParameters}
                onResetParameters={resetParameters}
              />
            </div>
          </div>

          {/* Right Column - Live Timeline Preview */}
          <div className="space-y-6">
            <div className="trading-card p-6 h-full">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-purple-400 mb-2">Live Preview</h2>
                <p className="text-sm text-muted-foreground">
                  See your changes reflected immediately on the timeline below.
                </p>
              </div>
              
              <div className="h-full overflow-y-auto">
                <Timeline parameters={parameters} currentTime={currentTime} />
              </div>
            </div>
          </div>
        </div>
      </main>
      

    </div>
  );
};

export default Settings;