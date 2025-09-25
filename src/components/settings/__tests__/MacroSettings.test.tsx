/**
 * Unit tests for MacroSettings component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MacroSettings } from '../MacroSettings';
import { TradingParameters } from '../../../models';

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="card-description">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="card-title">{children}</div>,
}));

jest.mock('@/components/ui/collapsible', () => ({
  Collapsible: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible">{children}</div>,
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-content">{children}</div>,
  CollapsibleTrigger: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="collapsible-trigger" onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) => (
    <input data-testid="input" value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <label data-testid="label">{children}</label>,
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

jest.mock('@/components/ui/timezone-aware-time-interval-picker', () => ({
  TimezoneAwareTimeIntervalPicker: ({ label, startTime, endTime, onStartTimeChange, onEndTimeChange }: { label: string; startTime: TimeRange; endTime: TimeRange; onStartTimeChange: (time: TimeRange) => void; onEndTimeChange: (time: TimeRange) => void }) => (
    <div data-testid="timezone-aware-time-interval-picker">
      <label>{label}</label>
      <input 
        data-testid="start-time-picker"
        value={`${startTime.hours}:${startTime.minutes}`}
        onChange={(e) => {
          const [hours, minutes] = e.target.value.split(':').map(Number);
          onStartTimeChange({ hours, minutes });
        }}
      />
      <input 
        data-testid="end-time-picker"
        value={`${endTime.hours}:${endTime.minutes}`}
        onChange={(e) => {
          const [hours, minutes] = e.target.value.split(':').map(Number);
          onEndTimeChange({ hours, minutes });
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

describe('MacroSettings', () => {
  const mockParameters: TradingParameters = {
    macros: [],
    killzones: [],
    marketSessions: [],
    newsTemplates: [],
    newsInstances: [],
    userTimezone: 'UTC'
  };

  const mockOnParametersChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with correct title', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    expect(screen.getByText('Macro Events')).toBeInTheDocument();
    expect(screen.getByText('Configure trading macro events and sessions')).toBeInTheDocument();
  });

  it('renders the add new macro form', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    expect(screen.getByText('Add New Macro Event')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Non-Farm Payrolls')).toBeInTheDocument();
    expect(screen.getByText('Description (Optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., High volatility period during London market open')).toBeInTheDocument();
  });

  it('allows adding a new macro with all fields', async () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    // Fill in the form
    const nameInput = screen.getByPlaceholderText('e.g., Non-Farm Payrolls');
    const descriptionInput = screen.getByPlaceholderText('e.g., High volatility period during London market open');
    const addButton = screen.getByText('Add Macro Event');

    fireEvent.change(nameInput, { target: { value: 'Test Macro' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    // Change probability to Low
    const probabilitySelect = screen.getByTestId('select');
    fireEvent.change(probabilitySelect, { target: { value: 'Low' } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnParametersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          macros: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test Macro',
              description: 'Test description',
              probability: 'Low',
              region: 'London'
            })
          ])
        })
      );
    });
  });

  it('resets form after adding a macro', async () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    const nameInput = screen.getByPlaceholderText('e.g., Non-Farm Payrolls');
    const descriptionInput = screen.getByPlaceholderText('e.g., High volatility period during London market open');
    const addButton = screen.getByText('Add Macro Event');

    fireEvent.change(nameInput, { target: { value: 'Test Macro' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('disables add button when name is empty', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    const addButton = screen.getByText('Add Macro Event');
    expect(addButton).toBeDisabled();
  });

  it('enables add button when name is provided', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    const nameInput = screen.getByPlaceholderText('e.g., Non-Farm Payrolls');
    const addButton = screen.getByText('Add Macro Event');

    fireEvent.change(nameInput, { target: { value: 'Test Macro' } });

    expect(addButton).not.toBeDisabled();
  });

  it('renders existing macros', () => {
    const parametersWithMacros: TradingParameters = {
      ...mockParameters,
      macros: [
        {
          id: 'macro-1',
          name: 'Existing Macro',
          start: { hours: 9, minutes: 0 },
          end: { hours: 10, minutes: 0 },
          region: 'London',
          description: 'Existing description',
          probability: 'High'
        }
      ]
    };

    render(
      <MacroSettings 
        parameters={parametersWithMacros} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    expect(screen.getByText('Existing Macro')).toBeInTheDocument();
  });

  it('shows empty state when no macros exist', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    expect(screen.getByText('No macro events configured')).toBeInTheDocument();
    expect(screen.getByText('Add your first macro event above')).toBeInTheDocument();
  });

  it('handles time picker changes', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    const startTimePicker = screen.getByTestId('start-time-picker');
    const endTimePicker = screen.getByTestId('end-time-picker');

    fireEvent.change(startTimePicker, { target: { value: '10:30' } });
    fireEvent.change(endTimePicker, { target: { value: '11:30' } });

    expect(startTimePicker).toHaveValue('10:30');
    expect(endTimePicker).toHaveValue('11:30');
  });

  it('handles region selection', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    const regionSelect = screen.getByTestId('select');
    fireEvent.change(regionSelect, { target: { value: 'New York' } });

    expect(regionSelect).toHaveValue('New York');
  });

  it('handles probability selection', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    const probabilitySelect = screen.getByTestId('select');
    fireEvent.change(probabilitySelect, { target: { value: 'Low' } });

    expect(probabilitySelect).toHaveValue('Low');
  });

  it('handles optional probability selection', () => {
    render(
      <MacroSettings 
        parameters={mockParameters} 
        onParametersChange={mockOnParametersChange} 
      />
    );

    const probabilitySelect = screen.getByTestId('select');
    
    // Test selecting "Not specified" (none value)
    fireEvent.change(probabilitySelect, { target: { value: 'none' } });
    expect(probabilitySelect).toHaveValue('none');

    // Test selecting High probability
    fireEvent.change(probabilitySelect, { target: { value: 'High' } });
    expect(probabilitySelect).toHaveValue('High');

    // Test selecting Low probability
    fireEvent.change(probabilitySelect, { target: { value: 'Low' } });
    expect(probabilitySelect).toHaveValue('Low');
  });
});
