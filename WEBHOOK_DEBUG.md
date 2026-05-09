# Webhook Debug Checklist

## Current Status
✅ Message sent to Botnoi (Status 200)
❓ Botnoi response not received

## Debug Steps

### Step 1: Verify ngrok is Running
```bash
# In a new terminal
ngrok http 3002
```

You should see:
```
Forwarding                     https://c2c9-1-10-142-148.ngrok-free.app -> http://localhost:3002
```

### Step 2: Test ngrok Tunnel
```bash
curl https://c2c9-1-10-142-148.ngrok-free.app/health
```

Should return:
```json
{"status":"ok","timestamp":"...","connectedClients":1}
```

### Step 3: Test Webhook Locally
```bash
curl -X POST http://localhost:3002/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": {"text": "Test response"}}'
```

Should see in server logs:
```
=== WEBHOOK RECEIVED FROM BOTNOI ===
```

### Step 4: Test via ngrok
```bash
curl -X POST https://c2c9-1-10-142-148.ngrok-free.app/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": {"text": "Test response"}}'
```

### Step 5: Check Botnoi Settings
In Botnoi Management Console:
- [ ] Transmit Endpoint: `https://c2c9-1-10-142-148.ngrok-free.app/webhook`
- [ ] Inbound webhook URL: `https://api-gateway.botnoi.ai/webhook/custom/69fc4600fb3079f00790fc5c`
- [ ] Bot ID: `69fc4600fb3079f00790fc5c`
- [ ] Signing Secret: `YOUR_SECRET_KEY`

### Step 6: Send Test Message
1. Open http://localhost:5173
2. Login
3. Chat with AI
4. Send message: "test"
5. Check server logs

### Step 7: Check Server Logs
Look for:
```
=== SENDING TO BOTNOI WITH SIGNATURE ===
✅ Message sent successfully to Botnoi
```

Then wait for:
```
=== WEBHOOK RECEIVED FROM BOTNOI ===
Broadcasting to X connected clients
```

## Possible Issues

### Issue 1: ngrok tunnel offline
**Symptom:** `ERR_NGROK_3200 The endpoint is offline`
**Solution:** 
- Restart ngrok: `ngrok http 3002`
- Update ngrok URL in Botnoi settings

### Issue 2: Webhook not received
**Symptom:** Message sent but no webhook received
**Possible causes:**
1. Transmit Endpoint not updated in Botnoi
2. ngrok tunnel not active
3. Botnoi not configured to send responses
4. Response format mismatch

**Debug:**
- Test webhook locally: `curl http://localhost:3002/webhook ...`
- Test via ngrok: `curl https://c2c9-1-10-142-148.ngrok-free.app/webhook ...`
- Check Botnoi logs for errors

### Issue 3: Response format wrong
**Symptom:** Webhook received but message not displayed
**Solution:**
- Check server logs for response format
- Verify message.text field exists
- Check browser console for SSE errors

## Testing Tools

### 1. Browser Test Page
Open `test-ngrok.html` in browser to test webhook

### 2. curl Commands
```bash
# Test local webhook
curl -X POST http://localhost:3002/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": {"text": "Test"}}'

# Test ngrok webhook
curl -X POST https://c2c9-1-10-142-148.ngrok-free.app/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": {"text": "Test"}}'

# Test health
curl https://c2c9-1-10-142-148.ngrok-free.app/health
```

### 3. PowerShell Commands
```powershell
# Test local webhook
$body = @{message=@{text="Test"}} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3002/webhook" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body

# Test ngrok webhook
Invoke-WebRequest -Uri "https://c2c9-1-10-142-148.ngrok-free.app/webhook" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

## Next Steps

1. Verify all Botnoi settings are correct
2. Test webhook locally and via ngrok
3. Send test message and check logs
4. If still not working, check Botnoi logs for errors
5. Contact Botnoi support if needed

## Important Notes

⚠️ **ngrok URL changes when restarted**
- Every time you restart ngrok, URL changes
- Must update in Botnoi settings
- Use ngrok paid plan for static URL

⚠️ **Signing Secret is sensitive**
- Never commit to git
- Keep in .env file
- Use environment variables in production
