#!/bin/bash

# Test 1: Check if server is running
echo "=== Test 1: Check Server Health ==="
curl -X GET http://localhost:3002/health
echo -e "\n"

# Test 2: Send test webhook to local server
echo "=== Test 2: Send Test Webhook to Local Server ==="
curl -X POST http://localhost:3002/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "text": "Test response from Botnoi"
    }
  }'
echo -e "\n"

# Test 3: Check ngrok tunnel
echo "=== Test 3: Check ngrok Tunnel ==="
echo "Make sure ngrok is running with: ngrok http 3002"
echo "Then test the ngrok URL:"
echo "curl -X POST https://7a6f-1-10-142-148.ngrok-free.app/webhook \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"message\": {\"text\": \"Test\"}}'"
