/**
 * Unit tests for TradingStatus type
 */
import { TradingStatus } from '../TradingStatus';

describe('TradingStatus', () => {
  describe('type values', () => {
    it('should accept green status', () => {
      const status: TradingStatus = 'green';
      expect(status).toBe('green');
    });

    it('should accept amber status', () => {
      const status: TradingStatus = 'amber';
      expect(status).toBe('amber');
    });

    it('should accept red status', () => {
      const status: TradingStatus = 'red';
      expect(status).toBe('red');
    });
  });

  describe('type safety', () => {
    it('should enforce correct type values', () => {
      const validStatuses: TradingStatus[] = ['green', 'amber', 'red'];

      validStatuses.forEach(status => {
        expect(typeof status).toBe('string');
        expect(['green', 'amber', 'red']).toContain(status);
      });
    });

    it('should work in function parameters', () => {
      const testFunction = (status: TradingStatus): string => {
        switch (status) {
          case 'green':
            return 'Trading is active';
          case 'amber':
            return 'Trading is cautious';
          case 'red':
            return 'Trading is inactive';
          default:
            return 'Unknown status';
        }
      };

      expect(testFunction('green')).toBe('Trading is active');
      expect(testFunction('amber')).toBe('Trading is cautious');
      expect(testFunction('red')).toBe('Trading is inactive');
    });

    it('should work in object properties', () => {
      interface StatusObject {
        currentStatus: TradingStatus;
        previousStatus: TradingStatus;
      }

      const statusObject: StatusObject = {
        currentStatus: 'green',
        previousStatus: 'red'
      };

      expect(statusObject.currentStatus).toBe('green');
      expect(statusObject.previousStatus).toBe('red');
    });
  });

  describe('usage patterns', () => {
    it('should work in arrays', () => {
      const statusHistory: TradingStatus[] = ['red', 'amber', 'green', 'amber', 'red'];

      expect(statusHistory).toHaveLength(5);
      expect(statusHistory[0]).toBe('red');
      expect(statusHistory[2]).toBe('green');
      expect(statusHistory[4]).toBe('red');
    });

    it('should work in conditional logic', () => {
      const isActive = (status: TradingStatus): boolean => {
        return status === 'green';
      };

      const isCaution = (status: TradingStatus): boolean => {
        return status === 'amber';
      };

      const isInactive = (status: TradingStatus): boolean => {
        return status === 'red';
      };

      expect(isActive('green')).toBe(true);
      expect(isActive('amber')).toBe(false);
      expect(isActive('red')).toBe(false);

      expect(isCaution('amber')).toBe(true);
      expect(isCaution('green')).toBe(false);
      expect(isCaution('red')).toBe(false);

      expect(isInactive('red')).toBe(true);
      expect(isInactive('green')).toBe(false);
      expect(isInactive('amber')).toBe(false);
    });

    it('should work in switch statements', () => {
      const getStatusColor = (status: TradingStatus): string => {
        switch (status) {
          case 'green':
            return '#22c55e';
          case 'amber':
            return '#f59e0b';
          case 'red':
            return '#ef4444';
        }
      };

      expect(getStatusColor('green')).toBe('#22c55e');
      expect(getStatusColor('amber')).toBe('#f59e0b');
      expect(getStatusColor('red')).toBe('#ef4444');
    });
  });

  describe('real-world examples', () => {
    it('should represent trading session states', () => {
      const sessionStates: { time: string; status: TradingStatus }[] = [
        { time: '09:00', status: 'green' },
        { time: '12:00', status: 'amber' },
        { time: '17:00', status: 'red' }
      ];

      expect(sessionStates[0].status).toBe('green');
      expect(sessionStates[1].status).toBe('amber');
      expect(sessionStates[2].status).toBe('red');
    });

    it('should work with status transitions', () => {
      interface StatusTransition {
        from: TradingStatus;
        to: TradingStatus;
        timestamp: Date;
      }

      const transition: StatusTransition = {
        from: 'red',
        to: 'green',
        timestamp: new Date()
      };

      expect(transition.from).toBe('red');
      expect(transition.to).toBe('green');
      expect(transition.timestamp).toBeInstanceOf(Date);
    });

    it('should work with status indicators', () => {
      const getStatusIndicator = (status: TradingStatus): { color: string; text: string; icon: string } => {
        switch (status) {
          case 'green':
            return { color: 'green', text: 'Active', icon: '🟢' };
          case 'amber':
            return { color: 'yellow', text: 'Caution', icon: '🟡' };
          case 'red':
            return { color: 'red', text: 'Inactive', icon: '🔴' };
        }
      };

      const greenIndicator = getStatusIndicator('green');
      expect(greenIndicator.color).toBe('green');
      expect(greenIndicator.text).toBe('Active');
      expect(greenIndicator.icon).toBe('🟢');

      const amberIndicator = getStatusIndicator('amber');
      expect(amberIndicator.color).toBe('yellow');
      expect(amberIndicator.text).toBe('Caution');
      expect(amberIndicator.icon).toBe('🟡');

      const redIndicator = getStatusIndicator('red');
      expect(redIndicator.color).toBe('red');
      expect(redIndicator.text).toBe('Inactive');
      expect(redIndicator.icon).toBe('🔴');
    });
  });

  describe('edge cases', () => {
    it('should handle status comparisons', () => {
      const status1: TradingStatus = 'green';
      const status2: TradingStatus = 'green';
      const status3: TradingStatus = 'red';

      expect(status1 === status2).toBe(true);
      expect(status1 === status3).toBe(false);
      expect(status2 !== status3).toBe(true);
    });

    it('should work with string methods', () => {
      const status: TradingStatus = 'green';

      expect(status.toUpperCase()).toBe('GREEN');
      expect(status.length).toBe(5);
      expect(status.includes('een')).toBe(true);
    });

    it('should work in object keys', () => {
      const statusConfig: Record<TradingStatus, string> = {
        green: 'Trading is active and profitable',
        amber: 'Trading is cautious, monitor closely',
        red: 'Trading is inactive, avoid positions'
      };

      expect(statusConfig.green).toBe('Trading is active and profitable');
      expect(statusConfig.amber).toBe('Trading is cautious, monitor closely');
      expect(statusConfig.red).toBe('Trading is inactive, avoid positions');
    });
  });
});
