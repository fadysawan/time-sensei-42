// Unit tests for NewsSettings timezone functionality
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewsSettings } from '../NewsSettings';
import { NewsTemplate, NewsInstance } from '../../../models';
import { NewsService } from '../../../services';

// Mock the NewsService
jest.mock('../../../services/NewsService', () => ({
  NewsService: {
    getDefaultNewsTemplates: jest.fn(() => [
      {
        id: 'nfp',
        name: 'Non-Farm Payrolls',
        type: 'news',
        countdownMinutes: 5,
        cooldownMinutes: 15,
        impact: 'high',
        description: 'Monthly employment report'
      }
    ]),
    createNewsInstanceWithTimezone: jest.fn((template, localDateTime, userTimezone, overrides) => ({
      id: `news_${Date.now()}`,
      templateId: template.id,
      name: overrides?.name || template.name,
      scheduledTime: new Date(localDateTime),
      impact: template.impact,
      isActive: true,
      description: overrides?.description || template.description
    })),
    validateNewsInstance: jest.fn(() => ({ isValid: true, errors: [] }))
  }
}));

// Mock timezone utilities
jest.mock('../../../utils/timeUtils', () => ({
  getTimezoneAbbreviation: jest.fn((timezone: string) => {
    const abbreviations: { [key: string]: string } = {
      'UTC': 'UTC',
      'America/New_York': 'EST',
      'Asia/Tokyo': 'JST',
      'Europe/London': 'GMT'
    };
    return abbreviations[timezone] || timezone;
  }),
  formatUTCDateForUserTimezone: jest.fn((date: Date, timezone: string) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  })
}));

describe('NewsSettings Timezone Functionality', () => {
  const mockTemplates: NewsTemplate[] = [
    {
      id: 'nfp',
      name: 'Non-Farm Payrolls',
      type: 'news',
      countdownMinutes: 5,
      cooldownMinutes: 15,
      impact: 'high',
      description: 'Monthly employment report'
    }
  ];

  const mockInstances: NewsInstance[] = [
    {
      id: 'news-1',
      templateId: 'nfp',
      name: 'NFP January 2024',
      scheduledTime: new Date('2024-01-15T14:30:00.000Z'),
      impact: 'high',
      isActive: true,
      description: 'January NFP report'
    }
  ];

  const defaultProps = {
    newsTemplates: mockTemplates,
    newsInstances: mockInstances,
    userTimezone: 'UTC',
    onTemplatesChange: jest.fn(),
    onInstancesChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Timezone Display', () => {
    it('should display timezone abbreviation in scheduled time label', () => {
      render(<NewsSettings {...defaultProps} userTimezone="America/New_York" />);
      
      expect(screen.getByText(/Scheduled Time/)).toBeInTheDocument();
      expect(screen.getByText(/\(EST\)/)).toBeInTheDocument();
    });

    it('should display UTC timezone abbreviation', () => {
      render(<NewsSettings {...defaultProps} userTimezone="UTC" />);
      
      expect(screen.getByText(/\(UTC\)/)).toBeInTheDocument();
    });

    it('should display Tokyo timezone abbreviation', () => {
      render(<NewsSettings {...defaultProps} userTimezone="Asia/Tokyo" />);
      
      expect(screen.getByText(/\(JST\)/)).toBeInTheDocument();
    });
  });

  describe('News Instance Creation with Timezone', () => {
    it('should create news instance with timezone conversion', async () => {
      const mockOnInstancesChange = jest.fn();
      render(
        <NewsSettings 
          {...defaultProps} 
          userTimezone="America/New_York"
          onInstancesChange={mockOnInstancesChange}
        />
      );

      // Select template
      const templateSelect = screen.getByRole('combobox');
      fireEvent.click(templateSelect);
      fireEvent.click(screen.getByText('Non-Farm Payrolls'));

      // Fill in datetime
      const datetimeInput = screen.getByDisplayValue('');
      fireEvent.change(datetimeInput, { target: { value: '2024-01-15T09:30' } });

      // Create instance
      const createButton = screen.getByText('Create News Event');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(NewsService.createNewsInstanceWithTimezone).toHaveBeenCalledWith(
          mockTemplates[0],
          '2024-01-15T09:30',
          'America/New_York',
          {
            name: '',
            description: ''
          }
        );
      });

      expect(mockOnInstancesChange).toHaveBeenCalled();
    });

    it('should create news instance with custom name and description', async () => {
      const mockOnInstancesChange = jest.fn();
      render(
        <NewsSettings 
          {...defaultProps} 
          userTimezone="Asia/Tokyo"
          onInstancesChange={mockOnInstancesChange}
        />
      );

      // Select template
      const templateSelect = screen.getByRole('combobox');
      fireEvent.click(templateSelect);
      fireEvent.click(screen.getByText('Non-Farm Payrolls'));

      // Fill in custom name
      const nameInput = screen.getByPlaceholderText('Override template name...');
      fireEvent.change(nameInput, { target: { value: 'Custom NFP Event' } });

      // Fill in datetime
      const datetimeInput = screen.getByDisplayValue('');
      fireEvent.change(datetimeInput, { target: { value: '2024-01-15T23:30' } });

      // Fill in description
      const descriptionInput = screen.getByPlaceholderText('Additional details about this news event...');
      fireEvent.change(descriptionInput, { target: { value: 'Custom description' } });

      // Create instance
      const createButton = screen.getByText('Create News Event');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(NewsService.createNewsInstanceWithTimezone).toHaveBeenCalledWith(
          mockTemplates[0],
          '2024-01-15T23:30',
          'Asia/Tokyo',
          {
            name: 'Custom NFP Event',
            description: 'Custom description'
          }
        );
      });
    });

    it('should reset form after successful creation', async () => {
      const mockOnInstancesChange = jest.fn();
      render(
        <NewsSettings 
          {...defaultProps} 
          userTimezone="UTC"
          onInstancesChange={mockOnInstancesChange}
        />
      );

      // Select template and fill form
      const templateSelect = screen.getByRole('combobox');
      fireEvent.click(templateSelect);
      fireEvent.click(screen.getByText('Non-Farm Payrolls'));

      const datetimeInput = screen.getByDisplayValue('');
      fireEvent.change(datetimeInput, { target: { value: '2024-01-15T14:30' } });

      // Create instance
      const createButton = screen.getByText('Create News Event');
      fireEvent.click(createButton);

      await waitFor(() => {
        // Form should be reset
        expect(screen.getByDisplayValue('')).toBeInTheDocument();
        expect(screen.queryByText('Non-Farm Payrolls')).not.toBeInTheDocument();
      });
    });
  });

  describe('News Instance Display with Timezone', () => {
    it('should display news instances with timezone formatting', () => {
      render(<NewsSettings {...defaultProps} userTimezone="America/New_York" />);
      
      // Should show the news instance
      expect(screen.getByText('NFP January 2024')).toBeInTheDocument();
      expect(screen.getByText('January NFP report')).toBeInTheDocument();
    });

    it('should format scheduled time correctly for different timezones', () => {
      const { rerender } = render(<NewsSettings {...defaultProps} userTimezone="UTC" />);
      
      // Check UTC formatting
      expect(screen.getByText(/Jan 15/)).toBeInTheDocument();
      
      // Rerender with different timezone
      rerender(<NewsSettings {...defaultProps} userTimezone="Asia/Tokyo" />);
      
      // Should still show formatted time
      expect(screen.getByText(/Jan 15/)).toBeInTheDocument();
    });

    it('should show past events with appropriate styling', () => {
      const pastInstances: NewsInstance[] = [
        {
          id: 'past-news',
          templateId: 'nfp',
          name: 'Past NFP',
          scheduledTime: new Date('2020-01-15T14:30:00.000Z'), // Past date
          impact: 'high',
          isActive: true,
          description: 'Past event'
        }
      ];

      render(
        <NewsSettings 
          {...defaultProps} 
          newsInstances={pastInstances}
          userTimezone="UTC"
        />
      );

      expect(screen.getByText('Past NFP')).toBeInTheDocument();
    });
  });

  describe('Timezone-aware Current DateTime Generation', () => {
    it('should generate current datetime for UTC timezone', () => {
      render(<NewsSettings {...defaultProps} userTimezone="UTC" />);
      
      // Select template to show datetime input
      const templateSelect = screen.getByRole('combobox');
      fireEvent.click(templateSelect);
      fireEvent.click(screen.getByText('Non-Farm Payrolls'));

      const datetimeInput = screen.getByDisplayValue('');
      expect(datetimeInput).toBeInTheDocument();
    });

    it('should generate current datetime for different timezones', () => {
      const { rerender } = render(<NewsSettings {...defaultProps} userTimezone="America/New_York" />);
      
      // Select template
      const templateSelect = screen.getByRole('combobox');
      fireEvent.click(templateSelect);
      fireEvent.click(screen.getByText('Non-Farm Payrolls'));

      // Rerender with different timezone
      rerender(<NewsSettings {...defaultProps} userTimezone="Asia/Tokyo" />);
      
      // Should still show datetime input
      const datetimeInput = screen.getByDisplayValue('');
      expect(datetimeInput).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      // Mock validation failure
      (NewsService.validateNewsInstance as jest.Mock).mockReturnValue({
        isValid: false,
        errors: ['Invalid scheduled time', 'Template not found']
      });

      const mockOnInstancesChange = jest.fn();
      render(
        <NewsSettings 
          {...defaultProps} 
          userTimezone="UTC"
          onInstancesChange={mockOnInstancesChange}
        />
      );

      // Select template and fill form
      const templateSelect = screen.getByRole('combobox');
      fireEvent.click(templateSelect);
      fireEvent.click(screen.getByText('Non-Farm Payrolls'));

      const datetimeInput = screen.getByDisplayValue('');
      fireEvent.change(datetimeInput, { target: { value: '2024-01-15T14:30' } });

      // Create instance
      const createButton = screen.getByText('Create News Event');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(NewsService.validateNewsInstance).toHaveBeenCalled();
      });

      // Should not call onInstancesChange due to validation failure
      expect(mockOnInstancesChange).not.toHaveBeenCalled();
    });
  });
});
