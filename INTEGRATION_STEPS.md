# Botnoi Integration - Step by Step

## Current Status
✅ Server running on port 3002
✅ Frontend connected to SSE (1 client connected)
✅ Message sending to Botnoi (Status 204)
❓ Botnoi response not received yet

## What's Missing

Botnoi needs to know where to send the response. Currently:
- **Transmit Endpoint**: `https://7a6f-1-10-142-148.ngrok-free.app/webhook` ✅
- **But**: ngrok tunnel might not be active or URL might have changed

## Step 1: Start ngrok Tunnel

Open a new terminal and run:
```bash
ngrok http 3002
```

You should see output like:
```
ngrok                                                       (Ctrl+C to quit)

Session Status                online
Account                       <your-account>
Version                        3.x.x
Region                         us (United States)
Forwarding                     https://7a6f-1-10-142-148.ngrok-free.app -> http://localhost:3002
Forwarding                     http://7a6f-1-10-142-148.ngrok-free.app -> http://localhost:3002
```

**Important**: If the URL changes, you need to update it in Botnoi settings!

## Step 2: Verify ngrok is Working

Test the ngrok URL:
```bash
curl https://7a6f-1-10-142-148.ngrok-free.app/health
```

Should return:
```json
{"status":"ok","timestamp":"...","connectedClients":1}
```

## Step 3: Update Botnoi Settings

In Botnoi Management Console:

1. Go to Custom Channel settings
2. Find **Transmit Endpoint** field
3. Set it to: `https://7a6f-1-10-142-148.ngrok-free.app/webhook`
4. Click Save

**Note**: If ngrok URL changes, you must update this!

## Step 4: Test the Flow

1. Open http://localhost:5173
2. Login
3. Go to Chat with AI
4. Type a message and send
5. Check:
   - Browser console for logs
   - Server logs for webhook reception
   - Chat for AI response

## Expected Logs

### Browser Console (Frontend)
```
ChatPage - Connecting to SSE...
✅ Connected to webhook server
ChatPage - Sending message: Hello
ChatPage - Calling sendMessageToWebhook with secret: true
ChatPage - sendMessageToWebhook result: {success: true, ...}
```

### Server Console (Backend)
```
=== SENDING TO BOTNOI WITH SIGNATURE ===
- Signature: sha256=...
- Timestamp: 1234567890
Botnoi Response Status: 204
✅ Message sent successfully to Botnoi
```

### When Botnoi Responds
```
=== WEBHOOK RECEIVED FROM BOTNOI ===
Headers: {...}
Body: {...}
Broadcasting to 1 connected clients: {type: 'ai', text: '...'}
Sending to client: 1234567890
```

## Troubleshooting

### ngrok URL Changed
If you restart ngrok, the URL might change:
1. Check the new URL in ngrok terminal
2. Update it in Botnoi settings
3. Update it in server.js if needed

### Still No Response
1. Check if ngrok tunnel is active
2. Verify Transmit Endpoint in Botnoi is correct
3. Check Botnoi logs for errors
4. Try sending a test message via Postman

### Test with Postman
Use the provided Postman collection to test:
1. Set bot_id: `69fc338bfb3079f00790f761`
2. Set signingSecret: Your secret from Botnoi
3. Set webhookUrl: `https://api-gateway.botnoi.ai/webhook/custom/69fc338bfb3079f00790f761`
4. Send the request
5. Check if response comes back

## Architecture Reminder

```
Frontend (5173)
    ↓ SSE
Backend (3002)
    ↓ HTTP POST
ngrok Tunnel
    ↓
Botnoi API
    ↓
ngrok Tunnel
    ↓ HTTP POST
Backend (3002) /webhook
    ↓ SSE
Frontend (5173)
```

## Checklist

- [ ] ngrok running: `ngrok http 3002`
- [ ] ngrok URL copied
- [ ] Botnoi Transmit Endpoint updated
- [ ] Server running: `npm run server`
- [ ] Frontend running: `npm run dev`
- [ ] Frontend connected to SSE (🟢 Online)
- [ ] Message sent to Botnoi (Status 204)
- [ ] Response received from Botnoi
- [ ] Response displayed in chat

## Next Steps

1. Make sure ngrok is running
2. Verify ngrok URL in Botnoi settings
3. Send a test message
4. Check logs
5. If still no response, check Botnoi logs for errors
