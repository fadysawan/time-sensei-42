// Test file to verify timezone-aware settings functionality
import { 
  convertUTCToUserTimezone, 
  convertUserTimezoneToUTC,
  getTimeInTimezone 
} from '../timeUtils';

// Test timezone conversion for settings
export const testTimezoneSettings = () => {
  console.log('🧪 Testing Timezone-Aware Settings');
  
  // Test common trading timezones
  const testTimezones = [
    'UTC',
    'America/New_York',
    'Europe/London', 
    'Asia/Tokyo',
    'Asia/Beirut',
    'Australia/Sydney'
  ];
  
  // Test UTC time (common trading session)
  const testUtcTime = { hours: 14, minutes: 30 }; // 2:30 PM UTC
  
  console.log(`\n📊 Converting UTC ${testUtcTime.hours}:${testUtcTime.minutes.toString().padStart(2, '0')} to different timezones:`);
  
  testTimezones.forEach(tz => {
    try {
      const converted = convertUTCToUserTimezone(testUtcTime.hours, testUtcTime.minutes, tz);
      console.log(`${tz}: ${converted.formatted}`);
    } catch (error) {
      console.error(`Error converting to ${tz}:`, error);
    }
  });
  
  // Test reverse conversion
  console.log(`\n🔄 Testing reverse conversion (User timezone → UTC):`);
  const testUserTime = { hours: 9, minutes: 30 }; // 9:30 AM in user's timezone
  
  testTimezones.forEach(tz => {
    try {
      const utcTime = convertUserTimezoneToUTC(testUserTime.hours, testUserTime.minutes, tz);
      console.log(`${tz} ${testUserTime.hours}:${testUserTime.minutes.toString().padStart(2, '0')} → UTC ${utcTime.hours}:${utcTime.minutes.toString().padStart(2, '0')}`);
    } catch (error) {
      console.error(`Error converting from ${tz}:`, error);
    }
  });
  
  // Test current time in different timezones
  console.log(`\n🕐 Current time in major trading centers:`);
  testTimezones.forEach(tz => {
    try {
      const currentTime = getTimeInTimezone(tz);
      console.log(`${tz}: ${currentTime.formatted}`);
    } catch (error) {
      console.error(`Error getting current time for ${tz}:`, error);
    }
  });
  
  console.log('\n✅ Timezone settings test completed');
};

// Export for use in development
if (typeof window !== 'undefined') {
  (window as typeof window & { testTimezoneSettings?: typeof testTimezoneSettings }).testTimezoneSettings = testTimezoneSettings;
}
