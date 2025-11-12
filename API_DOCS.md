# Khoj Fact-Checking API - Complete Documentation

**Version:** 1.0  
**Base URL:** `https://khoj-bd.com/api/v1`  
**Domain:** khoj-bd.com

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Request & Response Format](#request--response-format)
6. [Code Examples](#code-examples)
7. [Configuration](#configuration)
8. [Rate Limiting](#rate-limiting)
9. [Error Handling](#error-handling)
10. [Testing](#testing)
11. [Best Practices](#best-practices)
12. [Support](#support)

---

## Overview

The Khoj Fact-Checking API provides third-party developers with access to our AI-powered fact-checking pipeline. This API allows you to integrate fact-checking capabilities into your own applications, websites, or services.

### Features

- ✅ AI-powered fact-checking in Bengali and English
- ✅ Detailed reports with sources and verdicts
- ✅ Tiered source verification system
- ✅ Geography-aware fact-checking (Bangladesh vs International)
- ✅ Related articles from Khoj database
- ✅ Rate limiting and API key authentication
- ✅ Comprehensive error handling

---

## Quick Start

### 1. Get API Access

To obtain an API key, simply log in with your Google account and visit the [Get API Key](/get-api-key) page. You can request a unique API key directly from the platform without contacting support.

### 2. Make Your First Request

```bash
curl -X POST https://khoj-bd.com/api/v1/factcheck \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'
```

### 3. Test Without API Key (Development Only)

Set `API_AUTH_REQUIRED=false` in your `.env` file for testing:

```bash
curl -X POST https://khoj-bd.com/api/v1/factcheck \
  -H "Content-Type: application/json" \
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'
```

---

## Authentication

### API Key Requirement

**By Default: API Key is REQUIRED**

The API requires authentication by default for security. However, you can disable it for testing purposes.

### Authentication Methods

You can provide your API key using either of these methods:

**Method 1: Authorization Header (Recommended)**
```
Authorization: Bearer <your-api-key>
```

**Method 2: X-API-Key Header**
```
X-API-Key: <your-api-key>
```

### Disable Authentication for Testing

For development/testing, you can disable authentication:

1. Add to your `.env` file:
   ```bash
   API_AUTH_REQUIRED=false
   ```

2. ⚠️ **WARNING:** Only use this in development/testing environments, never in production!

---

## API Endpoints

### 1. Fact-Check a Claim

Verify a claim or statement and receive a detailed fact-checking report.

**Endpoint:** `POST /api/v1/factcheck`

**Authentication:** Required (unless `API_AUTH_REQUIRED=false`)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-api-key>
```

**Request Body:**
```json
{
  "query": "The claim or statement to fact-check"
}
```

**Example Request:**
```bash
curl -X POST https://khoj-bd.com/api/v1/factcheck \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key-here" \
  -d '{
    "query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "claim": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে",
    "report": "# দাবি\n\n[Detailed Bengali report in Markdown format...]",
    "verdict": "false",
    "sources": [
      {
        "id": 1,
        "title": "Source Title",
        "url": "https://example.com/article",
        "snippet": "Article snippet...",
        "language": "Bengali"
      }
    ],
    "relatedArticles": [
      {
        "id": "article-id",
        "title": "Related Article Title",
        "slug": "article-slug",
        "summary": "Article summary",
        "verdict": "false",
        "publishedAt": "2024-01-01T00:00:00Z",
        "author": "Author Name",
        "tags": ["tag1", "tag2"],
        "thumbnail": "https://example.com/thumbnail.jpg"
      }
    ],
    "sourceInfo": {
      "hasBengaliSources": true,
      "hasEnglishSources": false,
      "totalSources": 12,
      "geography": "bangladesh",
      "tierBreakdown": {
        "tier1": 5,
        "tier2": 4,
        "tier3": 2,
        "tier4": 1,
        "tier5": 0,
        "general": 0
      }
    },
    "generatedAt": "2024-01-01T12:00:00.000Z"
  },
  "meta": {
    "apiVersion": "1.0",
    "generatedAt": "2024-01-01T12:00:00.000Z",
    "authenticated": true
  }
}
```

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2024-01-01T13:00:00.000Z
```

### 2. Get API Information

Get information about the API, including documentation and examples.

**Endpoint:** `GET /api/v1/factcheck`

**Authentication:** Not required

**Request:**
```bash
curl https://khoj-bd.com/api/v1/factcheck
```

**Response:**
Returns API documentation in JSON format.

---

## Request & Response Format

### Verdict Values

The `verdict` field can have one of the following values:

- `"true"`: The claim is verified as true
- `"false"`: The claim is verified as false
- `"unverified"`: The claim could not be verified with available sources
- `"context_dependent"`: The claim's truthfulness depends on context

### Response Structure

```json
{
  "success": true|false,
  "data": {
    "claim": "string - The original claim",
    "report": "string - Detailed fact-checking report in Bengali (Markdown format)",
    "verdict": "string - One of: 'true', 'false', 'unverified', 'context_dependent'",
    "sources": [
      {
        "id": "number",
        "title": "string",
        "url": "string",
        "snippet": "string",
        "language": "string - 'Bengali' or 'English'"
      }
    ],
    "relatedArticles": "array - Related fact-check articles from Khoj database",
    "sourceInfo": {
      "hasBengaliSources": "boolean",
      "hasEnglishSources": "boolean",
      "totalSources": "number",
      "geography": "string - 'bangladesh' or 'international'",
      "tierBreakdown": "object - Breakdown of sources by tier"
    },
    "generatedAt": "string - ISO 8601 timestamp"
  },
  "meta": {
    "apiVersion": "string",
    "generatedAt": "string - ISO 8601 timestamp",
    "authenticated": "boolean"
  }
}
```

---

## Code Examples

### JavaScript/Node.js

```javascript
async function factCheck(query, apiKey) {
  const response = await fetch('https://khoj-bd.com/api/v1/factcheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Fact-check failed');
  }

  const data = await response.json();
  return data;
}

// Usage
factCheck('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে', 'your-api-key')
  .then(result => {
    console.log('Verdict:', result.data.verdict);
    console.log('Report:', result.data.report);
    console.log('Sources:', result.data.sources.length);
  })
  .catch(error => console.error('Error:', error));
```

### Python

```python
import requests

def fact_check(query, api_key):
    url = 'https://khoj-bd.com/api/v1/factcheck'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    data = {'query': query}
    
    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Usage
result = fact_check('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে', 'your-api-key')
print(f"Verdict: {result['data']['verdict']}")
print(f"Report: {result['data']['report']}")
print(f"Sources: {len(result['data']['sources'])}")
```

### PHP

```php
<?php
function factCheck($query, $apiKey) {
    $url = 'https://khoj-bd.com/api/v1/factcheck';
    $data = json_encode(['query' => $query]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        throw new Exception('Fact-check failed: ' . $response);
    }
    
    return json_decode($response, true);
}

// Usage
try {
    $result = factCheck('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে', 'your-api-key');
    echo "Verdict: " . $result['data']['verdict'] . "\n";
    echo "Report: " . $result['data']['report'] . "\n";
    echo "Sources: " . count($result['data']['sources']) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

### cURL

```bash
# Basic request
curl -X POST https://khoj-bd.com/api/v1/factcheck \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'

# Save response to file
curl -X POST https://khoj-bd.com/api/v1/factcheck \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}' \
  -o response.json
```

---

## Configuration

### Server-Side Configuration

Add the following to your `.env` file:

```bash
# API Authentication Setting
# Set to "false" to disable API key requirement (for testing only)
# Default: "true" (API key required)
# WARNING: Only set to false in development/testing environments!
API_AUTH_REQUIRED=true

# API Keys for third-party developers
# Format: KHOJ_API_KEY_<NAME>=<key>:<requests_per_window>:<window_seconds>
# 
# Examples:
# - KHOJ_API_KEY_DEMO=abc123def456:100:3600 (100 requests per hour)
# - KHOJ_API_KEY_PREMIUM=xyz789ghi012:1000:3600 (1000 requests per hour)
# - KHOJ_API_KEY_ENTERPRISE=enterprise_key:10000:86400 (10000 requests per day)
#
# You can create multiple API keys with different rate limits for different clients
# The name after KHOJ_API_KEY_ is just for identification (e.g., DEMO, PREMIUM, ENTERPRISE)
#
# Default rate limit if not specified: 100 requests per hour (3600 seconds)

# Example API Key 1: Demo/Testing (100 requests per hour)
KHOJ_API_KEY_DEMO=your_demo_api_key_here:100:3600

# Example API Key 2: Premium (1000 requests per hour)
# KHOJ_API_KEY_PREMIUM=your_premium_api_key_here:1000:3600

# Example API Key 3: Enterprise (10000 requests per day)
# KHOJ_API_KEY_ENTERPRISE=your_enterprise_api_key_here:10000:86400

# Base URL for API calls (production)
NEXT_PUBLIC_APP_URL=https://khoj-bd.com
```

### API Key Format

```
KHOJ_API_KEY_<NAME>=<key>:<requests>:<window_seconds>
```

**Parameters:**
- `<NAME>`: Identifier for the API key (e.g., DEMO, PREMIUM, ENTERPRISE)
- `<key>`: The actual API key string
- `<requests>`: Number of requests allowed in the time window
- `<window_seconds>`: Time window in seconds (e.g., 3600 = 1 hour, 86400 = 1 day)

**Examples:**
- `KHOJ_API_KEY_DEMO=abc123:100:3600` → 100 requests per hour
- `KHOJ_API_KEY_PREMIUM=xyz789:1000:3600` → 1000 requests per hour
- `KHOJ_API_KEY_ENTERPRISE=key123:10000:86400` → 10000 requests per day

---

## Rate Limiting

### Overview

Rate limits are configured per API key. The default rate limit is **100 requests per hour**, but this can be customized based on your needs.

### Rate Limit Headers

Rate limit information is included in response headers:

- `X-RateLimit-Limit`: Total requests allowed in the time window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: ISO 8601 timestamp when the rate limit resets

### Rate Limit Exceeded

If you exceed your rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your rate limit. Please try again after 2024-01-01T13:00:00.000Z.",
  "resetAt": "2024-01-01T13:00:00.000Z"
}
```

### Handling Rate Limits

**Best Practice:** Implement exponential backoff when you receive a 429 response:

```javascript
async function factCheckWithRetry(query, apiKey, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch('https://khoj-bd.com/api/v1/factcheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ query })
    });

    if (response.status === 429) {
      const resetAt = new Date(response.headers.get('X-RateLimit-Reset'));
      const waitTime = resetAt.getTime() - Date.now();
      
      if (attempt < maxRetries - 1) {
        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  }
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

### Common Error Codes

#### 400 Bad Request

Invalid or missing query parameter.

```json
{
  "error": "Bad Request",
  "message": "Query is required and must be a non-empty string"
}
```

**Solution:** Ensure your request includes a valid `query` field in the JSON body.

#### 401 Unauthorized

Invalid or missing API key.

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing API key. Please provide a valid API key in the 'Authorization: Bearer <key>' header or 'X-API-Key' header. To get an API key, log in with Google and visit /get-api-key"
}
```

**Solution:** 
- Check that your API key is correct
- Ensure you're including it in the `Authorization` header
- Log in with Google and visit the [Get API Key](/get-api-key) page to obtain an API key

#### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your rate limit. Please try again after 2024-01-01T13:00:00.000Z.",
  "resetAt": "2024-01-01T13:00:00.000Z"
}
```

**Solution:**
- Wait until the reset time before making more requests
- Consider upgrading to a higher rate limit tier
- Implement request caching to reduce API calls

#### 500 Internal Server Error

Server-side error occurred.

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Failed to generate fact-checking report"
}
```

**Solution:**
- Retry the request after a short delay
- If the issue persists, contact info@khoj-bd.com

### Error Handling Example

```javascript
async function factCheckSafe(query, apiKey) {
  try {
    const response = await fetch('https://khoj-bd.com/api/v1/factcheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 400:
          console.error('Bad Request:', data.message);
          break;
        case 401:
          console.error('Unauthorized:', data.message);
          break;
        case 429:
          console.error('Rate Limited:', data.message);
          console.log('Reset at:', data.resetAt);
          break;
        case 500:
          console.error('Server Error:', data.message);
          break;
        default:
          console.error('Unknown Error:', data);
      }
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('Fact-check error:', error);
    throw error;
  }
}
```

---

## Testing

### Test Without API Key

1. Set `API_AUTH_REQUIRED=false` in your `.env` file
2. Test the endpoint:

```bash
curl -X POST http://localhost:3000/api/v1/factcheck \
  -H "Content-Type: application/json" \
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'
```

### Test With API Key

1. Set up an API key in your `.env` file:
   ```bash
   KHOJ_API_KEY_TEST=test_key_123:10:60
   ```

2. Test the endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/v1/factcheck \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer test_key_123" \
     -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'
   ```

### Test API Info Endpoint

```bash
curl https://khoj-bd.com/api/v1/factcheck
```

### Using Test Script

A test script is available at `test-api.sh`:

```bash
# Make executable (Linux/Mac)
chmod +x test-api.sh

# Run tests
./test-api.sh your-api-key-here
```

---

## Best Practices

### 1. Cache Results

Fact-checking reports are deterministic for the same query. Consider caching results to reduce API calls:

```javascript
const cache = new Map();

async function factCheckCached(query, apiKey) {
  // Check cache first
  if (cache.has(query)) {
    const cached = cache.get(query);
    // Cache for 24 hours
    if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
      return cached.data;
    }
  }

  // Fetch from API
  const result = await factCheck(query, apiKey);
  
  // Store in cache
  cache.set(query, {
    data: result,
    timestamp: Date.now()
  });

  return result;
}
```

### 2. Handle Rate Limits

Implement exponential backoff when you receive a 429 response (see [Rate Limiting](#rate-limiting) section).

### 3. Error Handling

Always check the response status and handle errors appropriately (see [Error Handling](#error-handling) section).

### 4. Query Formatting

Provide clear, specific claims for better fact-checking results:

✅ **Good:**
- "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"
- "২০২৪ সালে বাংলাদেশের জিডিপি ৫% বৃদ্ধি পেয়েছে"

❌ **Bad:**
- "ভ্যাকসিন"
- "জিডিপি"

### 5. Monitor Usage

Check rate limit headers to monitor your API usage:

```javascript
const response = await fetch('https://khoj-bd.com/api/v1/factcheck', {...});
const remaining = response.headers.get('X-RateLimit-Remaining');
const limit = response.headers.get('X-RateLimit-Limit');

console.log(`API Usage: ${limit - remaining}/${limit} requests used`);
```

### 6. Use HTTPS

Always use HTTPS in production to protect your API key and data.

### 7. Store API Keys Securely

- Never commit API keys to version control
- Store API keys in environment variables
- Use different keys for development and production
- Rotate API keys regularly

---

## Support

### Getting Help

- **Email:** info@khoj-bd.com
- **Website:** https://khoj-bd.com
- **API Documentation:** https://khoj-bd.com/api-docs

### Getting API Access

To get an API key:
1. Log in with your Google account
2. Visit the [Get API Key](/get-api-key) page
3. Request your unique API key directly from the platform

For technical support, higher rate limits, or to report issues:
- Contact **info@khoj-bd.com**

### Terms of Use

By using the Khoj Fact-Checking API, you agree to:
- Use the API responsibly and in accordance with applicable laws
- Not abuse or attempt to circumvent rate limits
- Attribute fact-checking results to Khoj when displaying them publicly
- Respect the intellectual property rights of Khoj and its content sources

---

## Changelog

### Version 1.0 (Current)
- Initial public API release
- Fact-checking endpoint
- API key authentication
- Rate limiting
- Comprehensive error handling
- Support for Bengali and English queries
- Geography-aware fact-checking
- Related articles integration

---

## FAQ

### Q: Do I need an API key?

**A:** Yes, by default. However, you can disable authentication for testing by setting `API_AUTH_REQUIRED=false` in your environment variables.

### Q: What is the rate limit?

**A:** Default is 100 requests per hour, but this can be customized per API key. Contact info@khoj-bd.com for higher limits.

### Q: Can I use this API for commercial purposes?

**A:** Contact info@khoj-bd.com to discuss commercial usage and licensing.

### Q: What languages are supported?

**A:** The API supports Bengali and English queries. Reports are generated in Bengali.

### Q: How long does a fact-check take?

**A:** Typically 10-30 seconds, depending on query complexity and source availability.

### Q: Can I cache the results?

**A:** Yes! Results are deterministic for the same query, so caching is recommended to reduce API calls.

### Q: What happens if I exceed my rate limit?

**A:** You'll receive a 429 error. Wait until the reset time (provided in the response) before making more requests.

---

**Last Updated:** 2024  
**API Version:** 1.0  
**Status:** ✅ Production Ready

