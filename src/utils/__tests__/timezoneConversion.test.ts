import { convertUTCToUserTimezone } from '../timeUtils';

describe('Timezone Conversion', () => {
  it('should convert UTC time to Beirut timezone correctly', () => {
    // UTC 8:00 should become 11:00 in Beirut (UTC+3)
    const result = convertUTCToUserTimezone(8, 0, 'Asia/Beirut');
    
    expect(result.hours).toBe(11);
    expect(result.minutes).toBe(0);
    expect(result.formatted).toContain('11:00');
  });

  it('should convert UTC time to New York timezone correctly', () => {
    // UTC 8:00 should become 3:00 in New York (UTC-5, or 4:00 if DST)
    const result = convertUTCToUserTimezone(8, 0, 'America/New_York');
    
    // New York time should be 4-5 hours behind UTC depending on DST
    expect(result.hours).toBeGreaterThanOrEqual(3);
    expect(result.hours).toBeLessThanOrEqual(4);
    expect(result.minutes).toBe(0);
  });

  it('should handle UTC timezone correctly', () => {
    // UTC 8:00 should remain 8:00 in UTC
    const result = convertUTCToUserTimezone(8, 0, 'UTC');
    
    expect(result.hours).toBe(8);
    expect(result.minutes).toBe(0);
    expect(result.formatted).toContain('08:00');
  });

  it('should handle edge cases like midnight', () => {
    // UTC 0:00 should become 3:00 in Beirut
    const result = convertUTCToUserTimezone(0, 0, 'Asia/Beirut');
    
    expect(result.hours).toBe(3);
    expect(result.minutes).toBe(0);
  });

  it('should handle late night times correctly', () => {
    // UTC 22:00 should become 1:00 next day in Beirut
    const result = convertUTCToUserTimezone(22, 0, 'Asia/Beirut');
    
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(0);
  });

  it('should preserve minutes correctly', () => {
    // UTC 8:30 should become 11:30 in Beirut
    const result = convertUTCToUserTimezone(8, 30, 'Asia/Beirut');
    
    expect(result.hours).toBe(11);
    expect(result.minutes).toBe(30);
  });
});
