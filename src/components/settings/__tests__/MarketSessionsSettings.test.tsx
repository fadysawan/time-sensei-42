/**
 * Unit tests for MarketSessionsSettings component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MarketSessionsSettings } from '../MarketSessionsSettings';
import { MarketSession } from '../../../models';

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, id }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; id?: string }) => (
    <input data-testid="input" id={id} value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label data-testid="label" htmlFor={htmlFor}>{children}</label>
  ),
}));

jest.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <input 
      data-testid="switch" 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onCheckedChange(e.target.checked)} 
    />
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void }) => (
    <select data-testid="select" value={value} onChange={(e) => onValueChange(e.target.value)}>{children}</select>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: () => <div data-testid="select-value" />,
}));

jest.mock('@/components/ui/collapsible', () => ({
  Collapsible: ({ children, open, onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: () => void }) => (
    <div data-testid="collapsible" data-open={open} onClick={onOpenChange}>{children}</div>
  ),
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-content">{children}</div>,
  CollapsibleTrigger: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="collapsible-trigger" onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@/components/ui/timezone-aware-time-picker', () => ({
  TimezoneAwareTimePicker: ({ label, utcTime, onTimeChange }: { label: string; utcTime: TimeRange; onTimeChange: (time: TimeRange) => void }) => (
    <div data-testid="timezone-aware-time-picker">
      <label>{label}</label>
      <input 
        data-testid={`time-picker-${label.toLowerCase().replace(' ', '-')}`}
        value={`${utcTime.hours}:${utcTime.minutes}`}
        onChange={(e) => {
          const [hours, minutes] = e.target.value.split(':').map(Number);
          onTimeChange({ hours, minutes });
        }}
      />
    </div>
  ),
}));

// Mock time utils
jest.mock('../../../utils/timeUtils', () => ({
  convertUTCToUserTimezone: jest.fn((hours, minutes) => ({ hours, minutes })),
  formatTime: jest.fn((hours, minutes) => `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`),
  getTimezoneAbbreviation: jest.fn(() => 'UTC'),
  calculateDuration: jest.fn(() => 60), // 1 hour in minutes
}));

describe('MarketSessionsSettings', () => {
  const mockMarketSessions: MarketSession[] = [];
  const mockOnSessionsChange = jest.fn();
  const mockUserTimezone = 'UTC';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with add new session form', () => {
    render(
      <MarketSessionsSettings 
        marketSessions={mockMarketSessions}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    expect(screen.getByText('Add New Market Session')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Asian Session')).toBeInTheDocument();
    expect(screen.getByText('Description (Optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., High volatility trading session')).toBeInTheDocument();
  });

  it('allows adding a new session with all fields', async () => {
    render(
      <MarketSessionsSettings 
        marketSessions={mockMarketSessions}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    // Fill in the form
    const nameInput = screen.getByPlaceholderText('e.g., Asian Session');
    const descriptionInput = screen.getByPlaceholderText('e.g., High volatility trading session');
    const addButton = screen.getByText('Add Session');

    fireEvent.change(nameInput, { target: { value: 'Test Session' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    // Change probability to Low
    const probabilitySelect = screen.getByTestId('select');
    fireEvent.change(probabilitySelect, { target: { value: 'Low' } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnSessionsChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Test Session',
            description: 'Test description',
            probability: 'Low',
            type: 'custom',
            isActive: true
          })
        ])
      );
    });
  });

  it('resets form after adding a session', async () => {
    render(
      <MarketSessionsSettings 
        marketSessions={mockMarketSessions}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const nameInput = screen.getByPlaceholderText('e.g., Asian Session');
    const descriptionInput = screen.getByPlaceholderText('e.g., High volatility trading session');
    const addButton = screen.getByText('Add Session');

    fireEvent.change(nameInput, { target: { value: 'Test Session' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('disables add button when name is empty', () => {
    render(
      <MarketSessionsSettings 
        marketSessions={mockMarketSessions}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const addButton = screen.getByText('Add Session');
    expect(addButton).toBeDisabled();
  });

  it('enables add button when name is provided', () => {
    render(
      <MarketSessionsSettings 
        marketSessions={mockMarketSessions}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const nameInput = screen.getByPlaceholderText('e.g., Asian Session');
    const addButton = screen.getByText('Add Session');

    fireEvent.change(nameInput, { target: { value: 'Test Session' } });

    expect(addButton).not.toBeDisabled();
  });

  it('renders existing sessions', () => {
    const sessionsWithData: MarketSession[] = [
      {
        id: 'session-1',
        name: 'Existing Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'custom',
        isActive: true,
        description: 'Existing description',
        probability: 'High'
      }
    ];

    render(
      <MarketSessionsSettings 
        marketSessions={sessionsWithData}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    expect(screen.getByText('Existing Session')).toBeInTheDocument();
  });

  it('shows empty state when no sessions exist', () => {
    render(
      <MarketSessionsSettings 
        marketSessions={mockMarketSessions}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    expect(screen.getByText('No market sessions configured')).toBeInTheDocument();
    expect(screen.getByText('Add your first market session above')).toBeInTheDocument();
  });

  it('handles time picker changes', () => {
    render(
      <MarketSessionsSettings 
        marketSessions={mockMarketSessions}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const startTimePicker = screen.getByTestId('time-picker-start-time');
    const endTimePicker = screen.getByTestId('time-picker-end-time');

    fireEvent.change(startTimePicker, { target: { value: '10:30' } });
    fireEvent.change(endTimePicker, { target: { value: '11:30' } });

    expect(startTimePicker).toHaveValue('10:30');
    expect(endTimePicker).toHaveValue('11:30');
  });

  it('handles probability selection', () => {
    render(
      <MarketSessionsSettings 
        marketSessions={mockMarketSessions}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const probabilitySelect = screen.getByTestId('select');
    fireEvent.change(probabilitySelect, { target: { value: 'Low' } });

    expect(probabilitySelect).toHaveValue('Low');
  });

  it('handles session name changes', () => {
    const sessionsWithData: MarketSession[] = [
      {
        id: 'session-1',
        name: 'Existing Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'custom',
        isActive: true,
        probability: 'High'
      }
    ];

    render(
      <MarketSessionsSettings 
        marketSessions={sessionsWithData}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const nameInput = screen.getByDisplayValue('Existing Session');
    fireEvent.change(nameInput, { target: { value: 'Updated Session' } });

    expect(mockOnSessionsChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Updated Session'
        })
      ])
    );
  });

  it('handles session description changes', () => {
    const sessionsWithData: MarketSession[] = [
      {
        id: 'session-1',
        name: 'Existing Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'custom',
        isActive: true,
        description: 'Existing description',
        probability: 'High'
      }
    ];

    render(
      <MarketSessionsSettings 
        marketSessions={sessionsWithData}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const descriptionInput = screen.getByDisplayValue('Existing description');
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    expect(mockOnSessionsChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          description: 'Updated description'
        })
      ])
    );
  });

  it('handles session probability changes', () => {
    const sessionsWithData: MarketSession[] = [
      {
        id: 'session-1',
        name: 'Existing Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'custom',
        isActive: true,
        probability: 'High'
      }
    ];

    render(
      <MarketSessionsSettings 
        marketSessions={sessionsWithData}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const probabilitySelect = screen.getByDisplayValue('High');
    fireEvent.change(probabilitySelect, { target: { value: 'Low' } });

    expect(mockOnSessionsChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          probability: 'Low'
        })
      ])
    );
  });

  it('handles session active state toggle', () => {
    const sessionsWithData: MarketSession[] = [
      {
        id: 'session-1',
        name: 'Existing Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'custom',
        isActive: true,
        probability: 'High'
      }
    ];

    render(
      <MarketSessionsSettings 
        marketSessions={sessionsWithData}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const switchElement = screen.getByTestId('switch');
    fireEvent.click(switchElement);

    expect(mockOnSessionsChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          isActive: false
        })
      ])
    );
  });

  it('handles session removal', () => {
    const sessionsWithData: MarketSession[] = [
      {
        id: 'session-1',
        name: 'Existing Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'custom',
        isActive: true,
        probability: 'High'
      }
    ];

    render(
      <MarketSessionsSettings 
        marketSessions={sessionsWithData}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const deleteButton = screen.getByTestId('button');
    fireEvent.click(deleteButton);

    expect(mockOnSessionsChange).toHaveBeenCalledWith([]);
  });

  it('handles optional probability selection', () => {
    const sessionsWithData: MarketSession[] = [
      {
        id: 'session-1',
        name: 'Existing Session',
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        type: 'custom',
        isActive: true,
        description: 'Existing description',
        probability: undefined // No probability set
      }
    ];

    render(
      <MarketSessionsSettings 
        marketSessions={sessionsWithData}
        onSessionsChange={mockOnSessionsChange}
        userTimezone={mockUserTimezone}
      />
    );

    const probabilitySelect = screen.getByTestId('select');
    
    // Test that undefined probability shows as 'none' value
    expect(probabilitySelect).toHaveValue('none');

    // Test selecting High probability
    fireEvent.change(probabilitySelect, { target: { value: 'High' } });
    expect(probabilitySelect).toHaveValue('High');

    // Test selecting Low probability
    fireEvent.change(probabilitySelect, { target: { value: 'Low' } });
    expect(probabilitySelect).toHaveValue('Low');

    // Test selecting "Not specified" (none value)
    fireEvent.change(probabilitySelect, { target: { value: 'none' } });
    expect(probabilitySelect).toHaveValue('none');
  });
});
