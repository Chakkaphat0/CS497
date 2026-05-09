# Debugging Guide

## Check Server Status

### 1. Health Check
```bash
curl http://localhost:3002/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "connectedClients": 1
}
```

### 2. Check Connected Clients
Open browser console and look for:
```
✅ Connected to webhook server
```

## Test Webhook Flow

### Step 1: Open Chat and Connect
1. Open http://localhost:3173
2. Login
3. Go to Chat with AI
4. Check browser console for: `✅ Connected to webhook server`

### Step 2: Send Test Message
1. Type a message
2. Click send
3. Check browser console for logs

### Step 3: Check Server Logs
Look for:
```
=== SENDING TO BOTNOI WITH SIGNATURE ===
URL: https://api-gateway.botnoi.ai/webhook/custom/...
Botnoi Response Status: 204
✅ Message sent successfully to Botnoi
```

### Step 4: Test Webhook Reception
Send a test webhook to your server:
```bash
curl -X POST http://localhost:3002/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "text": "Test response from Botnoi"
    }
  }'
```

Check browser console - you should see the test message appear in chat.

## Common Issues

### Issue 1: "Cannot connect to webhook server"
**Symptoms:**
- Connection status shows 🔴 Offline
- Browser console: `❌ SSE connection error`

**Solution:**
1. Check if server is running: `npm run server`
2. Check if port 3002 is available
3. Check browser console for specific error

### Issue 2: Message sent but no response
**Symptoms:**
- Message appears in chat
- Loading indicator shows but no AI response
- Server logs show: `✅ Message sent successfully to Botnoi`

**Possible causes:**
1. Botnoi webhook URL not configured correctly
2. Signing secret is wrong
3. Botnoi is not sending response back

**Debug steps:**
1. Check server logs for: `=== WEBHOOK RECEIVED FROM BOTNOI ===`
2. If not appearing, Botnoi is not sending response
3. Verify ngrok tunnel is active: `ngrok http 3002`
4. Verify Botnoi webhook URL is set to ngrok URL

### Issue 3: "Invalid signature" error
**Symptoms:**
- Server logs show: `Invalid signature`
- Response status: 401

**Solution:**
1. Verify signing secret is correct
2. Check timestamp format (should be Unix seconds)
3. Ensure body is JSON stringified

### Issue 4: CORS errors
**Symptoms:**
- Browser console shows CORS error
- Network tab shows OPTIONS request failing

**Solution:**
- Server has CORS enabled
- Check if request is going to correct URL
- Verify Content-Type header is set

## Browser Console Logs

### Successful Flow
```
ChatPage - Connecting to SSE...
✅ Connected to webhook server
ChatPage - Sending message: Hello
ChatPage - Calling sendMessageToWebhook with secret: true
ChatPage - sendMessageToWebhook result: {success: true, ...}
ChatPage - SSE Message received: {type: 'ai', text: '...'}
ChatPage - Adding AI message to chat
```

### Failed Flow
```
ChatPage - Connecting to SSE...
❌ SSE connection error: ...
```

## Server Logs

### Successful Message Send
```
=== SENDING TO BOTNOI WITH SIGNATURE ===
- Signature: sha256=...
- Timestamp: 1234567890
URL: https://api-gateway.botnoi.ai/webhook/custom/...
Headers: {...}
Body: {...}
Botnoi Response Status: 204
✅ Message sent successfully to Botnoi
```

### Successful Webhook Reception
```
=== WEBHOOK RECEIVED FROM BOTNOI ===
Headers: {...}
Body: {...}
Broadcasting to 1 connected clients: {type: 'ai', text: '...'}
Sending to client: 1234567890
```

## Testing Checklist

- [ ] Server running on port 3002
- [ ] Frontend connected to SSE (status shows 🟢 Online)
- [ ] Message sent to Botnoi (status 204)
- [ ] Botnoi webhook URL configured in Management Console
- [ ] ngrok tunnel active and running
- [ ] Signing secret correct (if using)
- [ ] Response received from Botnoi
- [ ] Response displayed in chat

## Next Steps

If everything is working:
1. Verify ngrok URL in Botnoi settings
2. Check Botnoi logs for any errors
3. Test with Postman collection to verify Botnoi is working
4. Check if Botnoi is actually sending responses
