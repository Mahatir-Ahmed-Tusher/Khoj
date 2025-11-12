/**
 * Test script to verify API works from external app
 * This simulates how an external web app would call the API
 * 
 * For development/testing without API key:
 * 1. Set API_AUTH_REQUIRED=false in your .env file
 * 2. Remove or comment out the Authorization header below
 */

const API_URL = process.env.API_URL || 'https://khoj-bd.com/api/v1/factcheck';
// Set to null or empty string to test without API key (requires API_AUTH_REQUIRED=false)
const API_KEY = process.env.API_KEY || 'K7D9PX4LQTA'; // Replace with your actual API key or set to null

async function testAPI() {
  console.log('🧪 Testing Khoj Fact-Checking API from External App\n');
  console.log('API URL:', API_URL);
  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 4)}...` : 'None (auth disabled)\n');

  try {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add API key only if provided
    if (API_KEY) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
      // Alternative: headers['X-API-Key'] = API_KEY;
    } else {
      console.log('⚠️  No API key provided. Make sure API_AUTH_REQUIRED=false in your .env file\n');
    }
    
    // Test 1: Make API call
    console.log('📡 Making API request...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: 'বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে'
      })
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! API call worked!');
      console.log('Verdict:', data.data?.verdict);
      console.log('Report length:', data.data?.report?.length || 0);
      console.log('Sources found:', data.data?.sources?.length || 0);
      console.log('Authenticated:', data.meta?.authenticated || false);
    } else {
      console.log('\n❌ ERROR! API call failed!');
      console.log('Error:', data.error);
      console.log('Message:', data.message);
      if (data.developmentTip) {
        console.log('💡 Development Tip:', data.developmentTip);
      }
      
      // Provide troubleshooting tips
      if (response.status === 401) {
        console.log('\n🔧 Troubleshooting Tips:');
        if (!API_KEY) {
          console.log('1. ⚠️  No API key provided. Set API_AUTH_REQUIRED=false in your .env file to disable authentication');
          console.log('2. Or provide a valid API key in the API_KEY environment variable');
        } else {
          console.log('1. Make sure your API key is assigned (visit https://khoj-bd.com/get-api-key)');
          console.log('2. Check that the API key has no extra spaces');
          console.log('3. Verify the Authorization header format: "Bearer YOUR_API_KEY"');
          console.log('4. Try using X-API-Key header instead: "X-API-Key: YOUR_API_KEY"');
        }
        console.log('5. For development, set API_AUTH_REQUIRED=false in your .env file to test without API key');
      }
    }
  } catch (error) {
    console.error('\n❌ Network Error:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify the API URL is correct:', API_URL);
    console.log('3. If testing locally, use http://localhost:3000/api/v1/factcheck');
    console.log('4. Check browser console for CORS errors');
    console.log('5. For development, set API_AUTH_REQUIRED=false in your .env file');
  }
}

// Run the test
testAPI();

