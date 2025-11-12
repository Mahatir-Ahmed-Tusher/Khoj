/**
 * API Authentication and Rate Limiting Utilities
 * For third-party API access to Khoj Fact-Checking services
 */

import { validateAPIKeyForUser, getKeyByValue } from './api-key-manager';

interface APIKeyConfig {
  key: string;
  name: string;
  rateLimit: {
    requests: number;
    windowMs: number; // Time window in milliseconds
  };
  enabled: boolean;
  assignedTo?: string;
}

// In-memory rate limit store (for production, consider using Redis)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const rateLimitStore: RateLimitStore = {};

// Default rate limit: 100 requests per hour
const DEFAULT_RATE_LIMIT = {
  requests: 100,
  windowMs: 3600 * 1000, // 1 hour
};

/**
 * Validate API key using the key management system
 */
export function validateAPIKey(apiKey: string | null): APIKeyConfig | null {
  if (!apiKey) {
    return null;
  }

  // Trim the API key to handle any whitespace
  const trimmedApiKey = apiKey.trim();
  
  // Check if key exists in the key management system
  const validation = validateAPIKeyForUser(trimmedApiKey);
  
  if (!validation.valid || !validation.assigned) {
    return null;
  }

  // Return config for assigned keys
  return {
    key: apiKey,
    name: validation.key?.assignedTo || 'assigned',
    rateLimit: DEFAULT_RATE_LIMIT,
    enabled: true,
    assignedTo: validation.key?.assignedTo,
  };
}

/**
 * Check if API key has exceeded rate limit
 */
export function checkRateLimit(apiKey: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const config = validateAPIKey(apiKey);
  if (!config) {
    return { allowed: false, remaining: 0, resetAt: 0 };
  }

  const now = Date.now();
  const storeKey = `api:${apiKey}`;
  const limit = config.rateLimit.requests;
  const windowMs = config.rateLimit.windowMs;

  let record = rateLimitStore[storeKey];

  // Initialize or reset if window expired
  if (!record || now >= record.resetAt) {
    record = {
      count: 0,
      resetAt: now + windowMs,
    };
    rateLimitStore[storeKey] = record;
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  // Increment counter
  record.count++;

  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Get API key from request headers
 * Supports both 'Authorization: Bearer <key>' and 'X-API-Key: <key>' formats
 */
export function getAPIKeyFromRequest(
  headers: Headers
): string | null {
  // Try Authorization header first
  const authHeader = headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Try X-API-Key header
  const apiKeyHeader = headers.get('x-api-key');
  if (apiKeyHeader) {
    return apiKeyHeader.trim();
  }

  return null;
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, record] of Object.entries(rateLimitStore)) {
    if (now >= record.resetAt) {
      delete rateLimitStore[key];
    }
  }
}

// Clean up expired records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

