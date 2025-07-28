import https from 'https';

console.log('Testing Node.js HTTPS capabilities...');

// Test 1: Basic HTTPS request
console.log('🔍 Test 1: Basic HTTPS to Google...');
https.get('https://google.com', (res) => {
  console.log('✅ Google HTTPS works, status:', res.statusCode);
  
  // Test 2: Supabase specific
  console.log('🔍 Test 2: HTTPS to Supabase...');
  https.get('https://wmwbjfpdhrnvnaazecoe.supabase.co', (res) => {
    console.log('✅ Supabase HTTPS works, status:', res.statusCode);
    process.exit(0);
  }).on('error', (err) => {
    console.error('❌ Supabase HTTPS failed:', err.message);
    console.error('Error code:', err.code);
    process.exit(1);
  });
  
}).on('error', (err) => {
  console.error('❌ Google HTTPS failed:', err.message);
  console.error('Error code:', err.code);
  process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('❌ Timeout - no response after 10 seconds');
  process.exit(1);
}, 10000);