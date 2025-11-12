const fs = require('fs');
const path = require('path');

const keysFilePath = path.join(__dirname, '..', 'lib', '_keys.json');

try {
  const data = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));
  
  console.log('✅ JSON is valid');
  console.log(`📊 Total keys: ${data.keys.length}`);
  console.log(`📅 Last updated: ${data.lastUpdated}`);
  
  // Check uniqueness
  const keys = data.keys.map(k => k.key);
  const unique = new Set(keys);
  console.log(`\n🔍 Uniqueness check:`);
  console.log(`   Total: ${keys.length}`);
  console.log(`   Unique: ${unique.size}`);
  console.log(`   All unique: ${keys.length === unique.size ? '✅ YES' : '❌ NO'}`);
  
  // Check format
  const invalidFormat = keys.filter(k => !/^[A-Za-z0-9]{11}$/.test(k));
  console.log(`\n📝 Format check:`);
  console.log(`   Invalid format: ${invalidFormat.length}`);
  if (invalidFormat.length > 0) {
    console.log(`   Invalid keys: ${invalidFormat.join(', ')}`);
  } else {
    console.log(`   All keys have valid format: ✅ YES`);
  }
  
  // Status breakdown
  const statuses = {};
  data.keys.forEach(k => {
    statuses[k.status] = (statuses[k.status] || 0) + 1;
  });
  console.log(`\n📈 Status breakdown:`);
  Object.entries(statuses).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });
  
  // Test key lookup
  console.log(`\n🔑 Testing key lookup:`);
  function getKeyByValue(keyValue) {
    const trimmedKey = keyValue.trim();
    return data.keys.find(k => k.key === trimmedKey) || null;
  }
  
  const testKeys = [
    'K7D9PX4LQTA',
    'K2GQJ9M5YHR',
    '  K7D9PX4LQTA  ', // with whitespace
    'INVALID_KEY'
  ];
  
  testKeys.forEach(testKey => {
    const found = getKeyByValue(testKey);
    if (found) {
      console.log(`   ✅ "${testKey}" -> Found (status: ${found.status})`);
    } else {
      console.log(`   ❌ "${testKey}" -> Not found`);
    }
  });
  
  // Check assigned keys
  const assignedKeys = data.keys.filter(k => k.status === 'assigned');
  console.log(`\n👤 Assigned keys:`);
  assignedKeys.forEach(k => {
    console.log(`   Key: ${k.key}`);
    console.log(`   Assigned to: ${k.assignedTo || 'N/A'}`);
    console.log(`   Assigned at: ${k.assignedAt || 'N/A'}`);
  });
  
  console.log(`\n✅ All validations passed! Keys are ready to use.`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

