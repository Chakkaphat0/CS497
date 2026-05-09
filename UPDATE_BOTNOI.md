# Update Botnoi Settings

## New ngrok URL
```
https://c2c9-1-10-142-148.ngrok-free.app
```

## Steps to Update in Botnoi Management Console

### 1. Go to Custom Channel Settings
- Login to Botnoi Management Console
- Navigate to Custom Channel
- Find the channel settings

### 2. Update Transmit Endpoint
**Old:** `https://7a6f-1-10-142-148.ngrok-free.app/webhook`
**New:** `https://c2c9-1-10-142-148.ngrok-free.app/webhook`

### 3. Verify Other Settings
- **Inbound webhook URL**: `https://api-gateway.botnoi.ai/webhook/custom/69fc4600fb3079f00790fc5c` ✅
- **Bot ID**: `69fc4600fb3079f00790fc5c` ✅
- **Signing Secret**: `YOUR_SECRET_KEY` ✅

### 4. Save Changes

## Test the Connection

After updating, test with:
```bash
curl https://c2c9-1-10-142-148.ngrok-free.app/health
```

Should return:
```json
{"status":"ok","timestamp":"...","connectedClients":...}
```

## Now Test the Chat

1. Open http://localhost:5173
2. Login
3. Go to Chat with AI
4. Send a message
5. Wait for response from Botnoi

## If Still Not Working

1. **Check ngrok is running:**
   ```bash
   ngrok http 3002
   ```

2. **Check server is running:**
   ```bash
   npm run server
   ```

3. **Check frontend is running:**
   ```bash
   npm run dev
   ```

4. **Check browser console** for errors

5. **Check server logs** for webhook reception

## Important Notes

⚠️ **ngrok URL changes every time you restart ngrok**
- If you restart ngrok, the URL will change
- You must update it in Botnoi settings again
- To keep the same URL, use ngrok paid plan

For now, whenever ngrok URL changes:
1. Copy new URL from ngrok terminal
2. Update in Botnoi settings
3. Update in .env file
4. Restart server if needed
