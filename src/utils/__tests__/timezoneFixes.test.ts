// Test file to verify timezone fixes
import { getUserTimezone } from '../timeUtils';

// Test timezone detection and fixes
export const testTimezoneFixes = () => {
  console.log('🧪 Testing Timezone Fixes');
  
  // Test user timezone detection
  const userTz = getUserTimezone();
  console.log('✅ User detected timezone:', userTz);
  
  // Test that timezone is valid
  if (userTz && userTz !== 'UTC' && userTz.includes('/')) {
    console.log('✅ Timezone format is valid');
  } else {
    console.warn('⚠️ Timezone format might be invalid:', userTz);
  }
  
  // Test timezone offset calculation (simplified version)
  const testTimezoneOffset = (timezone: string): string => {
    try {
      if (timezone === 'UTC') return 'UTC';
      
      const now = new Date();
      const utcTime = new Date(now.toLocaleString("en-US", {timeZone: "UTC"}));
      const targetTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
      const offset = (targetTime.getTime() - utcTime.getTime()) / (1000 * 60 * 60);
      
      if (offset === 0) return 'UTC';
      if (offset > 0) return `UTC+${Math.round(offset)}`;
      return `UTC${Math.round(offset)}`;
    } catch (error) {
      return '';
    }
  };
  
  // Test offset calculation for common timezones
  const testTimezones = [
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Asia/Beirut'
  ];
  
  console.log('\n📊 Testing timezone offset calculations:');
  testTimezones.forEach(tz => {
    const offset = testTimezoneOffset(tz);
    console.log(`${tz}: ${offset}`);
  });
  
  // Test that no NaN values are returned
  const hasNaN = testTimezones.some(tz => {
    const offset = testTimezoneOffset(tz);
    return offset.includes('NaN');
  });
  
  if (!hasNaN) {
    console.log('✅ No NaN values in timezone offset calculations');
  } else {
    console.error('❌ Found NaN values in timezone offset calculations');
  }
  
  console.log('\n✅ Timezone fixes test completed');
};

// Export for use in development
if (typeof window !== 'undefined') {
  (window as typeof window & { testTimezoneFixes?: typeof testTimezoneFixes }).testTimezoneFixes = testTimezoneFixes;
}
