import { convertUTCToUserTimezone } from '../timeUtils';

describe('Actual Timezone Conversion Tests', () => {
  it('should convert UTC 8:00 to Beirut time correctly', () => {
    const result = convertUTCToUserTimezone(8, 0, 'Asia/Beirut');
    
    console.log('UTC 8:00 -> Beirut:', result.hours, ':', result.minutes);
    
    // Beirut is UTC+3, so 8:00 UTC should be 11:00 Beirut
    expect(result.hours).toBe(11);
    expect(result.minutes).toBe(0);
  });

  it('should convert UTC 0:00 to Beirut time correctly', () => {
    const result = convertUTCToUserTimezone(0, 0, 'Asia/Beirut');
    
    console.log('UTC 0:00 -> Beirut:', result.hours, ':', result.minutes);
    
    // Beirut is UTC+3, so 0:00 UTC should be 3:00 Beirut
    expect(result.hours).toBe(3);
    expect(result.minutes).toBe(0);
  });

  it('should convert UTC 22:00 to Beirut time correctly', () => {
    const result = convertUTCToUserTimezone(22, 0, 'Asia/Beirut');
    
    console.log('UTC 22:00 -> Beirut:', result.hours, ':', result.minutes);
    
    // Beirut is UTC+3, so 22:00 UTC should be 1:00 next day Beirut
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(0);
  });

  it('should handle UTC timezone correctly', () => {
    const result = convertUTCToUserTimezone(8, 30, 'UTC');
    
    console.log('UTC 8:30 -> UTC:', result.hours, ':', result.minutes);
    
    // UTC should remain the same
    expect(result.hours).toBe(8);
    expect(result.minutes).toBe(30);
  });

  it('should handle New York timezone correctly', () => {
    const result = convertUTCToUserTimezone(8, 0, 'America/New_York');
    
    console.log('UTC 8:00 -> New York:', result.hours, ':', result.minutes);
    
    // New York is UTC-5 (or UTC-4 during DST)
    // So 8:00 UTC should be 3:00 or 4:00 New York
    expect(result.hours).toBeGreaterThanOrEqual(3);
    expect(result.hours).toBeLessThanOrEqual(4);
    expect(result.minutes).toBe(0);
  });
});
