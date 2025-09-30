import { useRef, useEffect } from 'react';
import { TradingStatus } from '../models';
import { toast } from 'sonner';

interface StatusChange {
  from: TradingStatus;
  to: TradingStatus;
  timestamp: Date;
}

export const useStatusNotifications = (currentStatus: TradingStatus, currentPeriod: string) => {
  const previousStatus = useRef<TradingStatus | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
          // Resume context if it's suspended
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
          }
        } catch (error) {
          console.warn('Audio context not supported:', error);
        }
      }
    };

    // Initialize on user interaction
    const handleUserInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Play notification sound
  const playNotificationSound = (status: TradingStatus) => {
    if (!audioContextRef.current) return;

    try {
      const context = audioContextRef.current;

      // Create beeping pattern for alerting sound
      const playBeep = (frequency: number, startTime: number, beepDuration: number) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'square'; // More alerting than sine wave

        // Sharp attack and decay for alert sound
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, startTime + beepDuration);

        oscillator.start(startTime);
        oscillator.stop(startTime + beepDuration);
      };

      // Different alert patterns for different statuses
      const currentTime = context.currentTime;
      
      switch (status) {
        case 'red':
          // Urgent triple beep pattern for red (danger)
          playBeep(800, currentTime, 0.1);      // High pitch beep
          playBeep(800, currentTime + 0.15, 0.1);
          playBeep(800, currentTime + 0.3, 0.1);
          break;
        case 'amber':
          // Double beep for amber (caution)
          playBeep(600, currentTime, 0.12);     // Medium pitch beep
          playBeep(600, currentTime + 0.2, 0.12);
          break;
        case 'green':
          // Single pleasant beep for green (success)
          playBeep(400, currentTime, 0.15);     // Lower pitch beep
          break;
        default:
          playBeep(600, currentTime, 0.1);
      }
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  };

  // Get status message and styling
  const getStatusMessage = (status: TradingStatus, period: string): { title: string; description: string; type: 'success' | 'warning' | 'error' } => {
    // Check if it's a news-related period
    const isNewsActive = period.includes('Countdown') || period.includes('Active') || period.includes('Cooldown');
    
    switch (status) {
      case 'green':
        return {
          title: '🟢 GO! Perfect Trading Conditions',
          description: `✅ ${period}`,
          type: 'success'
        };
      case 'amber':
        return {
          title: '🟠 CAUTION - Limited Opportunity',
          description: `⚠️ ${period}`,
          type: 'warning'
        };
      case 'red':
        if (isNewsActive) {
          return {
            title: '🔴 NEWS ALERT - No Trading!',
            description: `📰 ${period}`,
            type: 'error'
          };
        }
        return {
          title: '🔴 STOP - Trading Halted',
          description: `🛑 ${period}`,
          type: 'error'
        };
      default:
        return {
          title: '📊 Trading Status Update',
          description: period,
          type: 'warning'
        };
    }
  };

  // Monitor status changes
  useEffect(() => {
    
    if (previousStatus.current !== null && previousStatus.current !== currentStatus) {
      const statusChange: StatusChange = {
        from: previousStatus.current,
        to: currentStatus,
        timestamp: new Date()
      };


      // Get message details
      const messageDetails = getStatusMessage(currentStatus, currentPeriod);

      // Show toast notification
      try {
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
        playNotificationSound(currentStatus);
        
      } catch (error) {
        console.error('❌ Error showing notification:', error);
      }
    }

    previousStatus.current = currentStatus;
  }, [currentStatus, currentPeriod]);

  return {
    playNotificationSound,
    getStatusMessage
  };
};