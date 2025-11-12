/**
 * API Key Management System
 * Manages 100 unique API keys stored in a JSON file
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface APIKey {
  key: string; // 11-character string
  status: 'available' | 'assigned' | 'revoked';
  assignedTo?: string; // User email
  assignedAt?: string; // ISO timestamp
  revokedAt?: string; // ISO timestamp
}

interface APIKeysData {
  keys: APIKey[];
  lastUpdated: string;
}

const KEYS_FILE_PATH = join(process.cwd(), 'lib', '_keys.json');

/**
 * Initialize keys file with 100 unique 11-character keys
 * This should be run once to generate the keys
 */
export function initializeKeys(): void {
  if (existsSync(KEYS_FILE_PATH)) {
    console.log('Keys file already exists');
    return;
  }

  const keys: APIKey[] = [];
  
  // Generate 100 unique 11-character keys
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < 100; i++) {
    let key = '';
    let attempts = 0;
    
    // Ensure uniqueness
    do {
      key = '';
      for (let j = 0; j < 11; j++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      attempts++;
    } while (keys.some(k => k.key === key) && attempts < 1000);
    
    keys.push({
      key,
      status: 'available',
    });
  }

  const data: APIKeysData = {
    keys,
    lastUpdated: new Date().toISOString(),
  };

  writeFileSync(KEYS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Generated ${keys.length} API keys`);
}

/**
 * Read keys from file
 */
function readKeys(): APIKeysData {
  try {
    if (!existsSync(KEYS_FILE_PATH)) {
      // Initialize if file doesn't exist
      initializeKeys();
    }
    
    const fileContent = readFileSync(KEYS_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent) as APIKeysData;
  } catch (error) {
    console.error('Error reading keys file:', error);
    return { keys: [], lastUpdated: new Date().toISOString() };
  }
}

/**
 * Write keys to file
 */
function writeKeys(data: APIKeysData): void {
  try {
    data.lastUpdated = new Date().toISOString();
    writeFileSync(KEYS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing keys file:', error);
    throw error;
  }
}

/**
 * Get all keys (for admin purposes)
 */
export function getAllKeys(): APIKey[] {
  const data = readKeys();
  return data.keys;
}

/**
 * Get key by value
 */
export function getKeyByValue(keyValue: string): APIKey | null {
  const data = readKeys();
  return data.keys.find(k => k.key === keyValue) || null;
}

/**
 * Get key assigned to user
 */
export function getKeyByUser(userEmail: string): APIKey | null {
  const data = readKeys();
  return data.keys.find(k => k.assignedTo === userEmail && k.status === 'assigned') || null;
}

/**
 * Assign a key to a user
 */
export function assignKeyToUser(userEmail: string): { success: boolean; key?: string; error?: string } {
  const data = readKeys();
  
  // Check if user already has a key
  const existingKey = getKeyByUser(userEmail);
  if (existingKey) {
    return {
      success: false,
      error: 'User already has an assigned API key',
    };
  }

  // Find an available key
  const availableKey = data.keys.find(k => k.status === 'available');
  
  if (!availableKey) {
    return {
      success: false,
      error: 'No available API keys. All keys have been assigned.',
    };
  }

  // Assign the key
  availableKey.status = 'assigned';
  availableKey.assignedTo = userEmail;
  availableKey.assignedAt = new Date().toISOString();

  writeKeys(data);

  return {
    success: true,
    key: availableKey.key,
  };
}

/**
 * Revoke a key
 */
export function revokeKey(keyValue: string): { success: boolean; error?: string } {
  const data = readKeys();
  const key = data.keys.find(k => k.key === keyValue);
  
  if (!key) {
    return {
      success: false,
      error: 'Key not found',
    };
  }

  if (key.status === 'revoked') {
    return {
      success: false,
      error: 'Key is already revoked',
    };
  }

  key.status = 'revoked';
  key.revokedAt = new Date().toISOString();
  key.assignedTo = undefined;
  key.assignedAt = undefined;

  writeKeys(data);

  return {
    success: true,
  };
}

/**
 * Validate API key and check if it's assigned to a user
 */
export function validateAPIKeyForUser(apiKey: string, userEmail?: string): {
  valid: boolean;
  assigned: boolean;
  key?: APIKey;
  error?: string;
} {
  const key = getKeyByValue(apiKey);
  
  if (!key) {
    return {
      valid: false,
      assigned: false,
      error: 'Invalid API key',
    };
  }

  if (key.status === 'revoked') {
    return {
      valid: false,
      assigned: false,
      error: 'API key has been revoked',
    };
  }

  if (key.status === 'available') {
    return {
      valid: true,
      assigned: false,
      key,
      error: 'API key is not assigned to any user',
    };
  }

  if (key.status === 'assigned') {
    // If userEmail is provided, check if it matches
    if (userEmail && key.assignedTo !== userEmail) {
      return {
        valid: false,
        assigned: true,
        error: 'API key is assigned to a different user',
      };
    }

    return {
      valid: true,
      assigned: true,
      key,
    };
  }

  return {
    valid: false,
    assigned: false,
    error: 'Unknown key status',
  };
}

/**
 * Get statistics about keys
 */
export function getKeyStatistics(): {
  total: number;
  available: number;
  assigned: number;
  revoked: number;
} {
  const data = readKeys();
  
  return {
    total: data.keys.length,
    available: data.keys.filter(k => k.status === 'available').length,
    assigned: data.keys.filter(k => k.status === 'assigned').length,
    revoked: data.keys.filter(k => k.status === 'revoked').length,
  };
}

