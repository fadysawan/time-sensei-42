/**
 * Simple integration test script
 * Run this with: node test-integration.js
 */

const API_BASE_URL = 'http://localhost:8080/api/v1';

async function testBackendConnection() {
  console.log('🧪 Testing Backend Connection...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`✅ Backend is running (Status: ${response.status})`);
    return true;
  } catch (error) {
    console.log(`❌ Backend connection failed: ${error.message}`);
    return false;
  }
}

async function testCORS() {
  console.log('🧪 Testing CORS Configuration...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
    };
    
    console.log('✅ CORS headers:', corsHeaders);
    return true;
  } catch (error) {
    console.log(`❌ CORS test failed: ${error.message}`);
    return false;
  }
}

async function testOAuthEndpoints() {
  console.log('🧪 Testing OAuth2 Endpoints...');
  
  const oauthEndpoints = [
    '/oauth2/authorization/google',
    '/oauth2/authorization/facebook',
  ];
  
  for (const endpoint of oauthEndpoints) {
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'GET',
        redirect: 'manual', // Don't follow redirects
      });
      
      if (response.status === 302 || response.status === 200) {
        console.log(`✅ ${endpoint} is accessible`);
      } else {
        console.log(`⚠️  ${endpoint} returned status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} failed: ${error.message}`);
    }
  }
}

async function runIntegrationTests() {
  console.log('🚀 Starting Integration Tests...\n');
  
  const backendRunning = await testBackendConnection();
  if (!backendRunning) {
    console.log('\n❌ Backend is not running. Please start the backend first:');
    console.log('   cd timesensei-backend-api && mvn spring-boot:run');
    return;
  }
  
  await testCORS();
  await testOAuthEndpoints();
  
  console.log('\n🎉 Integration tests completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the frontend: cd time-sensei-42 && npm run dev');
  console.log('2. Open http://localhost:5173');
  console.log('3. Test the login functionality');
}

// Run the tests
runIntegrationTests().catch(console.error);

