/**
 * Unit tests for TimeBlock interface
 */
import { TimeBlock } from '../TimeBlock';

describe('TimeBlock', () => {
  describe('interface structure', () => {
    it('should have all required properties', () => {
      const timeBlock: TimeBlock = {
        type: 'macro',
        name: 'Test Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 10,
        endMinute: 30
      };

      expect(timeBlock.type).toBe('macro');
      expect(timeBlock.name).toBe('Test Macro');
      expect(timeBlock.startHour).toBe(9);
      expect(timeBlock.startMinute).toBe(0);
      expect(timeBlock.endHour).toBe(10);
      expect(timeBlock.endMinute).toBe(30);
    });

    it('should accept all valid block types', () => {
      const validTypes: TimeBlock['type'][] = [
        'macro', 'killzone', 'premarket', 'market-open', 
        'lunch', 'after-hours', 'custom', 'news', 'inactive'
      ];

      validTypes.forEach(type => {
        const timeBlock: TimeBlock = {
          type,
          name: 'Test Block',
          startHour: 9,
          startMinute: 0,
          endHour: 10,
          endMinute: 0
        };
        expect(timeBlock.type).toBe(type);
      });
    });
  });

  describe('optional properties', () => {
    it('should accept optional description', () => {
      const timeBlock: TimeBlock = {
        type: 'macro',
        name: 'Test Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 10,
        endMinute: 0,
        description: 'This is a test macro description'
      };

      expect(timeBlock.description).toBe('This is a test macro description');
    });

    it('should accept optional probability', () => {
      const timeBlock: TimeBlock = {
        type: 'macro',
        name: 'Test Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 10,
        endMinute: 0,
        probability: 'High'
      };

      expect(timeBlock.probability).toBe('High');
    });

    it('should accept both optional properties', () => {
      const timeBlock: TimeBlock = {
        type: 'macro',
        name: 'Test Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 10,
        endMinute: 0,
        description: 'High probability macro',
        probability: 'High'
      };

      expect(timeBlock.description).toBe('High probability macro');
      expect(timeBlock.probability).toBe('High');
    });

    it('should work without optional properties', () => {
      const timeBlock: TimeBlock = {
        type: 'macro',
        name: 'Test Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 10,
        endMinute: 0
      };

      expect(timeBlock.description).toBeUndefined();
      expect(timeBlock.probability).toBeUndefined();
    });
  });

  describe('probability values', () => {
    it('should accept High probability', () => {
      const timeBlock: TimeBlock = {
        type: 'macro',
        name: 'Test Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 10,
        endMinute: 0,
        probability: 'High'
      };

      expect(timeBlock.probability).toBe('High');
    });

    it('should accept Low probability', () => {
      const timeBlock: TimeBlock = {
        type: 'macro',
        name: 'Test Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 10,
        endMinute: 0,
        probability: 'Low'
      };

      expect(timeBlock.probability).toBe('Low');
    });
  });

  describe('edge cases', () => {
    it('should handle overnight time blocks', () => {
      const overnightBlock: TimeBlock = {
        type: 'macro',
        name: 'Overnight Macro',
        startHour: 23,
        startMinute: 30,
        endHour: 1,
        endMinute: 30
      };

      expect(overnightBlock.startHour).toBe(23);
      expect(overnightBlock.endHour).toBe(1);
    });

    it('should handle same hour start and end', () => {
      const sameHourBlock: TimeBlock = {
        type: 'macro',
        name: 'Same Hour Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 9,
        endMinute: 30
      };

      expect(sameHourBlock.startHour).toBe(sameHourBlock.endHour);
      expect(sameHourBlock.startMinute).toBe(0);
      expect(sameHourBlock.endMinute).toBe(30);
    });
  });

  describe('type safety', () => {
    it('should enforce correct types for all properties', () => {
      const timeBlock: TimeBlock = {
        type: 'macro',
        name: 'Test Macro',
        startHour: 9,
        startMinute: 0,
        endHour: 10,
        endMinute: 0,
        description: 'Test description',
        probability: 'High'
      };

      // These should compile without errors
      const type: TimeBlock['type'] = timeBlock.type;
      const name: string = timeBlock.name;
      const startHour: number = timeBlock.startHour;
      const startMinute: number = timeBlock.startMinute;
      const endHour: number = timeBlock.endHour;
      const endMinute: number = timeBlock.endMinute;
      const description: string | undefined = timeBlock.description;
      const probability: 'High' | 'Low' | undefined = timeBlock.probability;

      expect(typeof type).toBe('string');
      expect(typeof name).toBe('string');
      expect(typeof startHour).toBe('number');
      expect(typeof startMinute).toBe('number');
      expect(typeof endHour).toBe('number');
      expect(typeof endMinute).toBe('number');
      expect(typeof description).toBe('string');
      expect(typeof probability).toBe('string');
    });
  });
});
