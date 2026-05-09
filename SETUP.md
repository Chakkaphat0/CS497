# Botnoi AI Interview Chat - Setup Guide

## Understanding the Integration

### Request/Response Flow

```
1. User sends message in Chat UI
   ↓
2. Frontend sends to Botnoi API with HMAC-SHA256 signature
   POST https://api-gateway.botnoi.ai/webhook/custom/69fc338bfb3079f00790f761
   Headers:
   - X-Platform-Signature: sha256=<hmac_hash>
   - X-Platform-Timestamp: <unix_timestamp_seconds>
   ↓
3. Botnoi processes message and generates AI response
   ↓
4. Botnoi sends response to ngrok webhook
   POST https://7a6f-1-10-142-148.ngrok-free.app/webhook
   ↓
5. Express server receives response at /webhook endpoint
   ↓
6. Server broadcasts to all connected SSE clients
   ↓
7. Frontend receives via SSE and displays in chat
```

### Request Body Structure (from Postman Collection)

```json
{
  "bot_id": "69fc338bfb3079f00790f761",
  "source": {
    "source_id": "user-uuid",
    "source_type": "user"
  },
  "sender": {
    "uid": "user-uuid",
    "display_name": "AI Interview User",
    "profile_img_url": ""
  },
  "message": {
    "mid": "message-uuid",
    "type": "text",
    "text": "User message here",
    "timestamp": 1234567890000,
    "mode": "normal"
  }
}
```

### Signature Generation

```javascript
// 1. Create string to sign
stringToSign = JSON.stringify(body) + timestamp_seconds

// 2. Generate HMAC-SHA256
hash = HmacSHA256(stringToSign, signingSecret)

// 3. Create signature header
signature = "sha256=" + hash_in_hex

// 4. Add headers
X-Platform-Signature: sha256=<hex_hash>
X-Platform-Timestamp: <unix_timestamp_seconds>
```

## Setup Steps

### 1. Get Signing Secret from Botnoi

1. Go to Botnoi Management Console
2. Navigate to Channel Permissions → Token
3. Copy the signing secret
4. Save it somewhere safe

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

Create `.env` file:
```
VITE_BOT_ID=69fc338bfb3079f00790f761
VITE_SIGNING_SECRET=your_signing_secret_from_botnoi
```

Or set it in the chat UI when you start using it.

### 4. Start ngrok Tunnel

```bash
ngrok http 3002
```

This exposes your local webhook server to the internet.
Copy the ngrok URL (e.g., `https://7a6f-1-10-142-148.ngrok-free.app`)

### 5. Configure Botnoi Webhook

In Botnoi Management Console:
1. Go to Custom Channel settings
2. Set **Outbound Webhook URL** to: `https://7a6f-1-10-142-148.ngrok-free.app/webhook`
3. This is where Botnoi will send AI responses

### 6. Start Both Servers

Terminal 1 - Start React dev server:
```bash
npm run dev
```

Terminal 2 - Start Express webhook server:
```bash
npm run server
```

Or run both together:
```bash
npm run dev:all
```

### 7. Use the Chat

1. Open `http://localhost:5173` in browser
2. Login
3. Go to "Chat with AI"
4. Select mode (Normal or Virtual)
5. Type your message and send
6. Wait for AI response from Botnoi

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Express webhook server that receives responses from Botnoi |
| `src/services/webhookService.js` | Sends messages to Botnoi with proper signature |
| `src/services/sseService.js` | Receives real-time updates via Server-Sent Events |
| `src/pages/ChatPage.jsx` | Chat UI component |

## API Endpoints

### Frontend → Botnoi
- **POST** `https://api-gateway.botnoi.ai/webhook/custom/69fc338bfb3079f00790f761`
  - Sends user message
  - Requires HMAC-SHA256 signature
  - Returns 204 No Content

### Botnoi → Backend (via ngrok)
- **POST** `https://7a6f-1-10-142-148.ngrok-free.app/webhook`
  - Receives AI response from Botnoi
  - Broadcasts to all connected SSE clients

### Backend → Frontend
- **GET** `http://localhost:3002/events`
  - Server-Sent Events endpoint
  - Streams AI responses in real-time

## Troubleshooting

### Connection Status Indicators

- 🟢 **Online** - Connected to webhook server, ready to chat
- 🟡 **Connecting** - Attempting to connect to webhook server
- 🔴 **Offline** - Cannot connect to webhook server

### Common Issues

1. **"Cannot connect to webhook server"**
   - Ensure Express server is running: `npm run server`
   - Check if port 3002 is available
   - Check browser console for errors

2. **"No response from Botnoi"**
   - Verify ngrok tunnel is active and running
   - Check Botnoi webhook URL is set correctly in Management Console
   - Verify bot_id matches: `69fc338bfb3079f00790f761`
   - Check signing secret is correct

3. **"Invalid signature" error**
   - Verify signing secret is correct
   - Check timestamp format (should be Unix seconds)
   - Ensure body is JSON stringified without extra spaces

4. **CORS errors**
   - Express server has CORS enabled
   - Check browser console for specific error
   - Verify ngrok URL is correct

## Testing with Postman

You can test the webhook using the provided Postman collection:

1. Import `custom-channel-postman-collection-69cd3595b08317197c904775 (1).json`
2. Set variables:
   - `bot_id`: `69fc338bfb3079f00790f761`
   - `signingSecret`: Your signing secret from Botnoi
   - `webhookUrl`: `https://api-gateway.botnoi.ai/webhook/custom/69fc338bfb3079f00790f761`
3. Send the request
4. Check server logs for response

## Security Notes

- Keep your signing secret safe - never commit it to version control
- Use environment variables for sensitive data
- The signature ensures message authenticity
- Timestamp prevents replay attacks

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│              (http://localhost:5173)                         │
│  - Chat UI                                                   │
│  - SSE Connection to receive AI responses                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP POST (send message with signature)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Botnoi API Gateway                          │
│  (https://api-gateway.botnoi.ai/webhook/custom/...)         │
│  - Verifies signature                                       │
│  - Processes user message                                   │
│  - Generates AI response                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP POST (AI response)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    ngrok Tunnel                              │
│         (https://7a6f-1-10-142-148.ngrok-free.app)          │
│  - Routes response back to local server                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP POST (AI response)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Backend Server                          │
│              (http://localhost:3002)                         │
│  - /webhook endpoint receives AI response                   │
│  - Broadcasts to all connected SSE clients                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ SSE (broadcast AI response)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│              (http://localhost:5173)                         │
│  - Receives AI response via SSE                             │
│  - Displays in chat UI                                      │
└─────────────────────────────────────────────────────────────┘
```
