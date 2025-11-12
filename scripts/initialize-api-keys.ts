/**
 * Script to initialize API keys
 * Run this once to generate 100 unique 11-character API keys
 * 
 * Usage: npx tsx scripts/initialize-api-keys.ts
 */

import { initializeKeys } from '../lib/api-key-manager';

console.log('Initializing API keys...');
initializeKeys();
console.log('✅ API keys initialized successfully!');
console.log('Check lib/_keys.json for the generated keys.');

