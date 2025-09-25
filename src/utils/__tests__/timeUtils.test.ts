// Simple test file to verify timezone conversion functionality
import { 
  getUTCTime, 
  getTimeInTimezone, 
  getUserTimezone, 
  convertUTCToUserTimezone,
  convertUserTimezoneToUTC 
} from '../timeUtils';

// Test timezone conversion functions
export const testTimezoneConversion = () => {
  console.log('🧪 Testing Timezone Conversion Functions');
  
  // Test UTC time
  const utcTime = getUTCTime();
  console.log('UTC Time:', utcTime);
  
  // Test user timezone detection
  const userTz = getUserTimezone();
  console.log('User Timezone:', userTz);
  
  // Test major trading timezones
  const timezones = [
    'UTC',
    'Europe/London',
    'America/New_York',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Asia/Beirut'
  ];
  
  console.log('\n📊 Current Times in Major Trading Centers:');
  timezones.forEach(tz => {
    try {
      const time = getTimeInTimezone(tz);
      console.log(`${tz}: ${time.formatted}`);
    } catch (error) {
      console.error(`Error getting time for ${tz}:`, error);
    }
  });
  
  // Test UTC to user timezone conversion
  console.log('\n🔄 Testing UTC to User Timezone Conversion:');
  const testUtcHours = 12;
  const testUtcMinutes = 30;
  
  timezones.forEach(tz => {
    try {
      const converted = convertUTCToUserTimezone(testUtcHours, testUtcMinutes, tz);
      console.log(`UTC ${testUtcHours}:${testUtcMinutes} → ${tz}: ${converted.formatted}`);
    } catch (error) {
      console.error(`Error converting to ${tz}:`, error);
    }
  });
  
  console.log('\n✅ Timezone conversion test completed');
};

// Export for use in development
if (typeof window !== 'undefined') {
  (window as typeof window & { testTimezoneConversion?: typeof testTimezoneConversion }).testTimezoneConversion = testTimezoneConversion;
}
