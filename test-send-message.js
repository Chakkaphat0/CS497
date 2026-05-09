#!/usr/bin/env node

/**
 * Test Script: Send Message to Botnoi
 * Usage: node test-send-message.js [message] [mode]
 */

const http = require('http');

// Configuration
const BOT_ID = '69fc494afb3079f00790fcf7';
const SIGNING_SECRET = 'YOUR_SECRET_KEY';
const WEBHOOK_URL = `https://api-gateway.botnoi.ai/webhook/custom/${BOT_ID}`;
const BACKEND_URL = 'http://localhost:3002/api/send-message';

// Get message from command line or use default
const message = process.argv[2] || 'Hello from test script';
const mode = process.argv[3] || 'normal';

console.log('\n' + '='.repeat(60));
console.log('=== Test Send Message to Botnoi ===');
console.log('='.repeat(60));
console.log('Configuration:');
console.log(`- Bot ID: ${BOT_ID}`);
console.log(`- Webhook URL: ${WEBHOOK_URL}`);
console.log(`- Backend URL: ${BACKEND_URL}`);
console.log(`- Message: "${message}"`);
console.log(`- Mode: ${mode}`);
console.log('='.repeat(60) + '\n');

// Test 1: Send via Backend
console.log('Test 1: Send Message via Backend');
console.log('-'.repeat(60));

const payload = JSON.stringify({
  messageText: message,
  mode: mode,
  signingSecret: SIGNING_SECRET
});

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/send-message',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`✅ Response Status: ${res.statusCode}`);
    console.log(`Response Body: ${data}\n`);

    // Test 2: Check Server Logs
    console.log('Test 2: Check Server Logs');
    console.log('-'.repeat(60));
    console.log('Look for these messages in server logs:');
    console.log('  === SENDING TO BOTNOI ===');
    console.log('  Signature: sha256=...');
    console.log('  ✅ Message sent successfully to Botnoi\n');

    // Test 3: Wait for Response
    console.log('Test 3: Wait for Response from Botnoi');
    console.log('-'.repeat(60));
    console.log('Waiting 5 seconds for Botnoi to respond...');
    
    setTimeout(() => {
      console.log('Check server logs for:');
      console.log('  === WEBHOOK RECEIVED FROM BOTNOI ===');
      console.log('  Broadcasting to X connected clients\n');

      // Test 4: Check Health
      console.log('Test 4: Check Server Health');
      console.log('-'.repeat(60));

      const healthOptions = {
        hostname: 'localhost',
        port: 3002,
        path: '/health',
        method: 'GET'
      };

      const healthReq = http.request(healthOptions, (healthRes) => {
        let healthData = '';

        healthRes.on('data', (chunk) => {
          healthData += chunk;
        });

        healthRes.on('end', () => {
          console.log(`✅ Server is healthy`);
          console.log(`Response: ${healthData}\n`);

          console.log('='.repeat(60));
          console.log('=== Test Complete ===');
          console.log('='.repeat(60));
          console.log('Next steps:');
          console.log('1. Check server logs for signature and response');
          console.log('2. Open http://localhost:5173 to see response in chat');
          console.log('3. If no response, check Botnoi logs for errors\n');
        });
      });

      healthReq.on('error', (error) => {
        console.log(`❌ Health check failed: ${error.message}\n`);
      });

      healthReq.end();
    }, 5000);
  });
});

req.on('error', (error) => {
  console.log(`❌ Failed to send message: ${error.message}\n`);
});

req.write(payload);
req.end();
