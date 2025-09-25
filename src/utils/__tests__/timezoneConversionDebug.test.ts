import { convertUTCToUserTimezone } from '../timeUtils';

describe('Timezone Conversion Debug', () => {
  it('should debug timezone conversion for Beirut', () => {
    console.log('Testing timezone conversion for Beirut...');
    
    // Test case: UTC 8:00 AM
    const utcTime = { hours: 8, minutes: 0 };
    const result = convertUTCToUserTimezone(utcTime.hours, utcTime.minutes, 'Asia/Beirut');
    
    console.log(`UTC ${utcTime.hours}:${utcTime.minutes.toString().padStart(2, '0')} -> Beirut ${result.hours}:${result.minutes.toString().padStart(2, '0')}`);
    
    // Beirut is UTC+3, so 8:00 UTC should be 11:00 Beirut
    expect(result.hours).toBe(11);
    expect(result.minutes).toBe(0);
  });

  it('should debug timezone conversion for New York', () => {
    console.log('Testing timezone conversion for New York...');
    
    // Test case: UTC 8:00 AM
    const utcTime = { hours: 8, minutes: 0 };
    const result = convertUTCToUserTimezone(utcTime.hours, utcTime.minutes, 'America/New_York');
    
    console.log(`UTC ${utcTime.hours}:${utcTime.minutes.toString().padStart(2, '0')} -> New York ${result.hours}:${result.minutes.toString().padStart(2, '0')}`);
    
    // New York is UTC-5 (or UTC-4 during DST)
    // So 8:00 UTC should be 3:00 or 4:00 New York
    expect(result.hours).toBeGreaterThanOrEqual(3);
    expect(result.hours).toBeLessThanOrEqual(4);
  });

  it('should debug the actual conversion used in NextEventsPanel', () => {
    console.log('Testing the exact conversion used in NextEventsPanel...');
    
    // Simulate what happens in NextEventsPanel
    const event = {
      name: 'Test Event',
      startTime: { hours: 8, minutes: 0 }, // UTC time
      timeUntilMinutes: 30,
      region: 'London'
    };
    
    const userTimezone = 'Asia/Beirut';
    const userTime = convertUTCToUserTimezone(event.startTime.hours, event.startTime.minutes, userTimezone);
    
    console.log(`Original event time: ${event.startTime.hours}:${event.startTime.minutes.toString().padStart(2, '0')} UTC`);
    console.log(`Converted time: ${userTime.hours}:${userTime.minutes.toString().padStart(2, '0')} ${userTimezone}`);
    
    // The converted time should be different from the original
    expect(userTime.hours).not.toBe(event.startTime.hours);
    expect(userTime.minutes).toBe(event.startTime.minutes); // Minutes should be the same
  });
});
