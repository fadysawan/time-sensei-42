// TimeDisplay Component - Single Responsibility: Display current times
import React from 'react';

interface TimeDisplayProps {
  currentTime: string;
  newYorkTime: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, newYorkTime }) => {
  return (
    <div className="hidden md:flex items-center space-x-6 text-sm">
      <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
        <span className="text-blue-300">Beirut:</span>
        <span className="font-mono text-blue-400 font-semibold">{currentTime}</span>
      </div>
      <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
        <span className="text-purple-300">New York:</span>
        <span className="font-mono text-purple-400 font-semibold">{newYorkTime}</span>
      </div>
    </div>
  );
};