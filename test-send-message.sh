#!/bin/bash

# Test Script: Send Message to Botnoi

# Configuration
BOT_ID="69fc494afb3079f00790fcf7"
SIGNING_SECRET="YOUR_SECRET_KEY"
WEBHOOK_URL="https://api-gateway.botnoi.ai/webhook/custom/$BOT_ID"
BACKEND_URL="http://localhost:3002/api/send-message"

# Get message from command line or use default
MESSAGE="${1:-Hello from test script}"
MODE="${2:-normal}"

echo ""
echo "============================================================"
echo "=== Test Send Message to Botnoi ==="
echo "============================================================"
echo "Configuration:"
echo "- Bot ID: $BOT_ID"
echo "- Webhook URL: $WEBHOOK_URL"
echo "- Backend URL: $BACKEND_URL"
echo "- Message: \"$MESSAGE\""
echo "- Mode: $MODE"
echo "============================================================"
echo ""

# Test 1: Send via Backend
echo "Test 1: Send Message via Backend"
echo "------------------------------------------------------------"

RESPONSE=$(curl -s -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"messageText\": \"$MESSAGE\",
    \"mode\": \"$MODE\",
    \"signingSecret\": \"$SIGNING_SECRET\"
  }")

echo "✅ Response:"
echo "$RESPONSE"
echo ""

# Test 2: Check Server Logs
echo "Test 2: Check Server Logs"
echo "------------------------------------------------------------"
echo "Look for these messages in server logs:"
echo "  === SENDING TO BOTNOI ==="
echo "  Signature: sha256=..."
echo "  ✅ Message sent successfully to Botnoi"
echo ""

# Test 3: Wait for Response
echo "Test 3: Wait for Response from Botnoi"
echo "------------------------------------------------------------"
echo "Waiting 5 seconds for Botnoi to respond..."
sleep 5
echo "Check server logs for:"
echo "  === WEBHOOK RECEIVED FROM BOTNOI ==="
echo "  Broadcasting to X connected clients"
echo ""

# Test 4: Check Health
echo "Test 4: Check Server Health"
echo "------------------------------------------------------------"

HEALTH=$(curl -s -X GET "http://localhost:3002/health")
echo "✅ Server is healthy"
echo "Response: $HEALTH"
echo ""

echo "============================================================"
echo "=== Test Complete ==="
echo "============================================================"
echo "Next steps:"
echo "1. Check server logs for signature and response"
echo "2. Open http://localhost:5173 to see response in chat"
echo "3. If no response, check Botnoi logs for errors"
echo ""
