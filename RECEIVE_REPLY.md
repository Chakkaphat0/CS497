# How to Receive Reply from Botnoi

## Flow Diagram

```
Botnoi AI
    ↓ (generates response)
    ↓ HTTP POST to Transmit Endpoint
    ↓
ngrok Tunnel (https://c2c9-1-10-142-148.ngrok-free.app)
    ↓ (forwards to local server)
    ↓
Express Server (http://localhost:3002)
    ↓ /webhook endpoint receives response
    ↓
SSE Broadcast to all connected clients
    ↓
React Frontend (http://localhost:5173)
    ↓ receives via SSE
    ↓
Chat displays AI response
```

## Requirements

### 1. ngrok Tunnel Must Be Running
```bash
ngrok http 3002
```

**Important:** Copy the ngrok URL from the output
Example: `https://c2c9-1-10-142-148.ngrok-free.app`

### 2. Botnoi Settings Must Be Configured

In Botnoi Management Console:

**Transmit Endpoint:**
```
https://c2c9-1-10-142-148.ngrok-free.app/webhook
```

This tells Botnoi where to send responses.

### 3. Server Must Be Running
```bash
npm run server
```

### 4. Frontend Must Be Running
```bash
npm run dev
```

### 5. Frontend Must Be Connected to SSE
- Open http://localhost:5173
- Login
- Go to Chat with AI
- Check browser console for: `✅ Connected to webhook server`

## Testing Steps

### Step 1: Verify ngrok is Active
```bash
curl https://c2c9-1-10-142-148.ngrok-free.app/health
```

Should return:
```json
{"status":"ok","timestamp":"...","connectedClients":1}
```

### Step 2: Send Test Message
```bash
powershell -ExecutionPolicy Bypass -File test-send-message.ps1
```

Or use the chat UI to send a message.

### Step 3: Check Server Logs
Look for:
```
=== SENDING TO BOTNOI ===
✅ Message sent successfully to Botnoi
```

### Step 4: Wait for Response
Botnoi should send response within a few seconds.

Look for in server logs:
```
=== WEBHOOK RECEIVED FROM BOTNOI ===
Broadcasting to X connected clients
```

### Step 5: Check Frontend
The response should appear in the chat.

## Troubleshooting

### Issue 1: No Response from Botnoi
**Symptoms:** Message sent but no webhook received

**Checklist:**
- [ ] ngrok tunnel is running
- [ ] ngrok URL is correct in Botnoi settings
- [ ] Transmit Endpoint is set to: `https://c2c9-1-10-142-148.ngrok-free.app/webhook`
- [ ] Server is running on port 3002
- [ ] Frontend is connected to SSE

**Debug:**
1. Check Botnoi logs for errors
2. Verify ngrok URL hasn't changed
3. Test webhook locally: `curl -X POST http://localhost:3002/webhook ...`

### Issue 2: ngrok URL Changed
**Symptoms:** `ERR_NGROK_3200 The endpoint is offline`

**Solution:**
1. Restart ngrok: `ngrok http 3002`
2. Copy new URL
3. Update in Botnoi settings
4. Update in .env file

### Issue 3: Frontend Not Connected to SSE
**Symptoms:** Message sent but not displayed in chat

**Check:**
1. Open browser console (F12)
2. Look for: `✅ Connected to webhook server`
3. If not connected, check for errors in console

### Issue 4: Response Received But Not Displayed
**Symptoms:** Server logs show webhook received but chat is empty

**Debug:**
1. Check browser console for errors
2. Check server logs for broadcast message
3. Verify SSE connection is active

## Complete Checklist

- [ ] ngrok running: `ngrok http 3002`
- [ ] ngrok URL copied
- [ ] Botnoi Transmit Endpoint updated
- [ ] Server running: `npm run server`
- [ ] Frontend running: `npm run dev`
- [ ] Frontend connected to SSE (🟢 Online)
- [ ] Message sent to Botnoi (Status 200)
- [ ] Response received from Botnoi
- [ ] Response displayed in chat

## Important Notes

⚠️ **ngrok URL changes when restarted**
- Every restart = new URL
- Must update in Botnoi settings
- Use ngrok paid plan for static URL

⚠️ **Transmit Endpoint is critical**
- This is where Botnoi sends responses
- Must be exactly: `https://c2c9-1-10-142-148.ngrok-free.app/webhook`
- If wrong, Botnoi won't send responses

⚠️ **SSE Connection must be active**
- Frontend must be connected to `/events` endpoint
- Check browser console for connection status
- If disconnected, responses won't reach frontend

## Next Steps

1. Verify all settings are correct
2. Send a test message
3. Check server logs for response
4. If response received, check frontend
5. If still not working, check Botnoi logs

## Support

If still not working:
1. Check all logs (browser console, server logs, Botnoi logs)
2. Verify ngrok URL is correct
3. Verify Transmit Endpoint is set correctly
4. Contact Botnoi support if needed
