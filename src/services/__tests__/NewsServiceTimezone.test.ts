// Unit tests for NewsService timezone functionality
import { NewsService } from '../NewsService';
import { NewsTemplate, NewsInstance } from '../../models';

// Jest type definitions
declare global {
  var jest: unknown;
  var describe: unknown;
  var it: unknown;
  var expect: unknown;
  var beforeEach: unknown;
}

// Mock the timezone utilities
jest.mock('../../utils/timeUtils', () => ({
  convertLocalDateTimeToUTC: jest.fn((localDateTime: string, userTimezone: string) => {
    // Mock conversion: add 5 hours for EST, subtract 9 hours for JST
    const date = new Date(localDateTime);
    if (userTimezone === 'America/New_York') {
      date.setHours(date.getHours() + 5);
    } else if (userTimezone === 'Asia/Tokyo') {
      date.setHours(date.getHours() - 9);
    }
    return date;
  }),
  formatUTCDateForUserTimezone: jest.fn((utcDate: Date, userTimezone: string) => {
    // Mock formatting: return formatted string
    return utcDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  })
}));

describe('NewsService Timezone Functionality', () => {
  const mockTemplate: NewsTemplate = {
    id: 'test-template',
    name: 'Test News',
    type: 'news',
    countdownMinutes: 5,
    cooldownMinutes: 15,
    impact: 'high',
    description: 'Test news template'
  };

  describe('createNewsInstanceWithTimezone', () => {
    it('should create news instance with UTC timezone', () => {
      const localDateTime = '2024-01-15T14:30';
      const userTimezone = 'UTC';
      
      const result = NewsService.createNewsInstanceWithTimezone(
        mockTemplate,
        localDateTime,
        userTimezone
      );
      
      expect(result).toMatchObject({
        templateId: mockTemplate.id,
        name: mockTemplate.name,
        impact: mockTemplate.impact,
        isActive: true,
        description: mockTemplate.description
      });
      expect(result.id).toMatch(/^test-template_\d+$/);
      expect(result.scheduledTime).toBeInstanceOf(Date);
    });

    it('should create news instance with New York timezone', () => {
      const localDateTime = '2024-01-15T09:30';
      const userTimezone = 'America/New_York';
      
      const result = NewsService.createNewsInstanceWithTimezone(
        mockTemplate,
        localDateTime,
        userTimezone
      );
      
      expect(result.templateId).toBe(mockTemplate.id);
      expect(result.scheduledTime).toBeInstanceOf(Date);
      // The mock should have converted the time
      expect(result.scheduledTime.getHours()).toBe(14); // 9:30 + 5 hours
    });

    it('should create news instance with Tokyo timezone', () => {
      const localDateTime = '2024-01-15T23:30';
      const userTimezone = 'Asia/Tokyo';
      
      const result = NewsService.createNewsInstanceWithTimezone(
        mockTemplate,
        localDateTime,
        userTimezone
      );
      
      expect(result.templateId).toBe(mockTemplate.id);
      expect(result.scheduledTime).toBeInstanceOf(Date);
      // The mock should have converted the time
      expect(result.scheduledTime.getHours()).toBe(14); // 23:30 - 9 hours
    });

    it('should create news instance with custom overrides', () => {
      const localDateTime = '2024-01-15T14:30';
      const userTimezone = 'UTC';
      const overrides = {
        name: 'Custom News Name',
        description: 'Custom description'
      };
      
      const result = NewsService.createNewsInstanceWithTimezone(
        mockTemplate,
        localDateTime,
        userTimezone,
        overrides
      );
      
      expect(result.name).toBe('Custom News Name');
      expect(result.description).toBe('Custom description');
      expect(result.templateId).toBe(mockTemplate.id);
    });

    it('should handle empty overrides', () => {
      const localDateTime = '2024-01-15T14:30';
      const userTimezone = 'UTC';
      
      const result = NewsService.createNewsInstanceWithTimezone(
        mockTemplate,
        localDateTime,
        userTimezone,
        {}
      );
      
      expect(result.name).toBe(mockTemplate.name);
      expect(result.description).toBe(mockTemplate.description);
    });
  });

  describe('formatNewsInstanceForDisplay', () => {
    const mockInstance: NewsInstance = {
      id: 'test-instance',
      templateId: 'test-template',
      name: 'Test News Instance',
      scheduledTime: new Date('2024-01-15T14:30:00.000Z'),
      impact: 'high',
      isActive: true,
      description: 'Test instance'
    };

    it('should format news instance for UTC timezone', () => {
      const userTimezone = 'UTC';
      
      const result = NewsService.formatNewsInstanceForDisplay(mockInstance, userTimezone);
      
      expect(result).toMatchObject({
        instance: mockInstance,
        displayTime: expect.any(String),
        isPast: expect.any(Boolean)
      });
      expect(result.displayTime).toMatch(/Jan 15/);
    });

    it('should format news instance for New York timezone', () => {
      const userTimezone = 'America/New_York';
      
      const result = NewsService.formatNewsInstanceForDisplay(mockInstance, userTimezone);
      
      expect(result).toMatchObject({
        instance: mockInstance,
        displayTime: expect.any(String),
        isPast: expect.any(Boolean)
      });
      expect(result.displayTime).toMatch(/Jan 15/);
    });

    it('should format news instance for Tokyo timezone', () => {
      const userTimezone = 'Asia/Tokyo';
      
      const result = NewsService.formatNewsInstanceForDisplay(mockInstance, userTimezone);
      
      expect(result).toMatchObject({
        instance: mockInstance,
        displayTime: expect.any(String),
        isPast: expect.any(Boolean)
      });
      expect(result.displayTime).toMatch(/Jan 15/);
    });

    it('should correctly identify past events', () => {
      const pastInstance: NewsInstance = {
        ...mockInstance,
        scheduledTime: new Date('2020-01-15T14:30:00.000Z') // Past date
      };
      
      const result = NewsService.formatNewsInstanceForDisplay(pastInstance, 'UTC');
      
      expect(result.isPast).toBe(true);
    });

    it('should correctly identify future events', () => {
      const futureInstance: NewsInstance = {
        ...mockInstance,
        scheduledTime: new Date('2030-01-15T14:30:00.000Z') // Future date
      };
      
      const result = NewsService.formatNewsInstanceForDisplay(futureInstance, 'UTC');
      
      expect(result.isPast).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    it('should create and format news instance consistently', () => {
      const localDateTime = '2024-01-15T14:30';
      const userTimezone = 'America/New_York';
      
      // Create instance
      const instance = NewsService.createNewsInstanceWithTimezone(
        mockTemplate,
        localDateTime,
        userTimezone
      );
      
      // Format for display
      const formatted = NewsService.formatNewsInstanceForDisplay(instance, userTimezone);
      
      expect(formatted.instance).toBe(instance);
      expect(formatted.displayTime).toBeDefined();
      expect(typeof formatted.displayTime).toBe('string');
    });

    it('should handle different timezones consistently', () => {
      const localDateTime = '2024-01-15T14:30';
      const timezone1 = 'America/New_York';
      const timezone2 = 'Asia/Tokyo';
      
      // Create instance in timezone1
      const instance = NewsService.createNewsInstanceWithTimezone(
        mockTemplate,
        localDateTime,
        timezone1
      );
      
      // Format for timezone2
      const formatted = NewsService.formatNewsInstanceForDisplay(instance, timezone2);
      
      expect(formatted.instance).toBe(instance);
      expect(formatted.displayTime).toBeDefined();
    });
  });
});
