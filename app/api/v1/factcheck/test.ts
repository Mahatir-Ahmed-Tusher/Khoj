/**
 * Test script for the Khoj Fact-Checking API
 * Run with: npx tsx app/api/v1/factcheck/test.ts
 * Or use curl/Postman to test the endpoint
 */

// Example test using fetch (Node.js 18+)
async function testAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/v1/factcheck`;
  
  // Test 1: GET endpoint (should return API info)
  console.log("🧪 Test 1: GET /api/v1/factcheck (API Info)");
  try {
    const infoResponse = await fetch(apiUrl);
    const infoData = await infoResponse.json();
    console.log("✅ GET endpoint works!");
    console.log("Response:", JSON.stringify(infoData, null, 2));
  } catch (error) {
    console.error("❌ GET endpoint failed:", error);
  }

  // Test 2: POST without API key (should work if API_AUTH_REQUIRED=false)
  console.log("\n🧪 Test 2: POST /api/v1/factcheck (without API key)");
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে",
      }),
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      console.log("✅ POST endpoint works without API key!");
      console.log("Verdict:", data.data?.verdict);
      console.log("Sources found:", data.data?.sources?.length || 0);
    } else {
      console.log("⚠️ Response:", data);
      if (response.status === 401) {
        console.log("ℹ️ API key is required. This is expected if API_AUTH_REQUIRED=true");
      }
    }
  } catch (error) {
    console.error("❌ POST endpoint failed:", error);
  }

  // Test 3: POST with API key (if you have one configured)
  const testApiKey = process.env.KHOJ_API_KEY_DEMO?.split(":")[0];
  if (testApiKey) {
    console.log("\n🧪 Test 3: POST /api/v1/factcheck (with API key)");
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${testApiKey}`,
        },
        body: JSON.stringify({
          query: "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে",
        }),
      });

      const data = await response.json();
      console.log(`Status: ${response.status}`);
      console.log("Rate Limit Remaining:", response.headers.get("X-RateLimit-Remaining"));
      
      if (response.ok) {
        console.log("✅ POST endpoint works with API key!");
        console.log("Verdict:", data.data?.verdict);
        console.log("Sources found:", data.data?.sources?.length || 0);
      } else {
        console.log("⚠️ Response:", data);
      }
    } catch (error) {
      console.error("❌ POST endpoint with API key failed:", error);
    }
  } else {
    console.log("\n⚠️ Test 3 skipped: No API key configured in KHOJ_API_KEY_DEMO");
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI().catch(console.error);
}

export { testAPI };

