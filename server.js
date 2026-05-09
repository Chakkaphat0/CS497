import express from 'express'
import cors from 'cors'
import CryptoJS from 'crypto-js'

const app = express()
const PORT = process.env.PORT || 3002

// Store for active connections
const clients = new Map()

// Middleware
app.use(cors())
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}))

const bot_id = process.env.BOTNOI_BOT_ID || '69ff88c4fb3079f00791405c';

const CONFIG = {
  bot_id: bot_id,
  signingSecret: process.env.BOTNOI_SECRET || 'YOUR_SECRET_KEY',
  botnoi_webhook_url: `https://api-gateway.botnoi.ai/webhook/custom/${bot_id}`,
  ngrok_url: 'https://cs497-botnoi-backend.onrender.com'
}

/**
 * Generate UUID v4
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate HMAC-SHA256 signature
 * According to Postman collection: signature = HmacSHA256(body, signingSecret)
 */
function generateSignature(body, signingSecret) {
  const hash = CryptoJS.HmacSHA256(body, signingSecret).toString(CryptoJS.enc.Hex)
  return `sha256=${hash}`
}

/**
 * Verify webhook signature from Botnoi
 */
function verifySignature(body, signature, secret) {
  const hash = CryptoJS.HmacSHA256(body, secret).toString(CryptoJS.enc.Hex)
  const expectedSignature = `sha256=${hash}`

  console.log('Signature Verification:')
  console.log('- Received Signature:', signature)
  console.log('- Expected Signature:', expectedSignature)
  console.log('- Match:', signature === expectedSignature)

  return signature === expectedSignature
}

/**
 * POST /api/send-message - Send message to Botnoi via backend
 */
app.post('/api/send-message', async (req, res) => {
  try {
    const { messageText, mode, signingSecret, userId } = req.body

    if (!messageText) {
      return res.status(400).json({ error: 'messageText is required' })
    }

    const userUid = userId || generateUUID()
    const messageId = generateUUID()
    const timestampMs = Date.now()
    const timestampSec = Math.floor(timestampMs / 1000).toString()

    const payload = {
      bot_id: CONFIG.bot_id,
      source: {
        source_id: userUid,
        source_type: 'user'
      },
      sender: {
        uid: userUid,
        display_name: 'AI Interview User',
        profile_img_url: ''
      },
      message: {
        mid: messageId,
        type: 'text',
        text: messageText,
        timestamp: timestampMs,
        mode: mode || 'normal'
      }
    }

    const bodyString = JSON.stringify(payload)

    let headers = {
      'Content-Type': 'application/json'
    }

    const activeSecret = (signingSecret && signingSecret !== 'YOUR_SECRET_KEY') ? signingSecret : (CONFIG.signingSecret !== 'YOUR_SECRET_KEY' ? CONFIG.signingSecret : null);

    if (activeSecret) {
      const signature = generateSignature(bodyString, activeSecret)
      headers['X-Platform-Signature'] = signature
      headers['X-Platform-Timestamp'] = timestampSec

      console.log('\n' + '='.repeat(60))
      console.log('=== SENDING TO BOTNOI ===')
      console.log('='.repeat(60))
      console.log('Timestamp:', timestampSec)
      console.log('Signature:', signature)
      console.log('Body:', bodyString)
      console.log('='.repeat(60) + '\n')
    } else {
      console.log('⚠️  No signing secret provided')
    }

    const botnoi_response = await fetch(CONFIG.botnoi_webhook_url, {
      method: 'POST',
      headers: headers,
      body: bodyString
    })

    console.log('Botnoi Response Status:', botnoi_response.status)

    if (botnoi_response.status === 204 || botnoi_response.ok) {
      console.log('✅ Message sent successfully to Botnoi')
      res.json({
        success: true,
        message: 'Message sent to Botnoi',
        userUid: userUid,
        messageId: messageId,
        timestamp: timestampMs
      })
    } else {
      const errorText = await botnoi_response.text()
      console.log('❌ Botnoi error:', errorText)
      res.status(botnoi_response.status).json({
        success: false,
        error: `Botnoi error: ${botnoi_response.status}`,
        details: errorText
      })
    }
  } catch (error) {
    console.error('❌ Error sending to Botnoi:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /webhook - Receive messages from Botnoi
 */
app.post('/webhook', (req, res) => {
  try {
    console.log('\n' + '='.repeat(60))
    console.log('=== WEBHOOK RECEIVED FROM BOTNOI ===')
    console.log('='.repeat(60))
    console.log('Timestamp:', new Date().toISOString())
    console.log('Headers:', JSON.stringify(req.headers, null, 2))
    console.log('Body:', JSON.stringify(req.body, null, 2))
    console.log('='.repeat(60) + '\n')

    const body = req.rawBody || JSON.stringify(req.body)
    const signature = req.headers['x-platform-signature']

    // Verify signature if secret is configured
    if (CONFIG.signingSecret && signature) {
      if (!verifySignature(body, signature, CONFIG.signingSecret)) {
        console.warn('❌ Invalid signature')
        return res.status(401).json({ error: 'Invalid signature' })
      }
    }

    // Extract messages from Botnoi response
    let messagesToBroadcast = []

    if (Array.isArray(req.body.messages)) {
      // New Botnoi format uses "messages" array
      messagesToBroadcast = req.body.messages
    } else if (req.body.message) {
      // Fallback for object format
      messagesToBroadcast = [req.body.message]
    }

    if (messagesToBroadcast.length === 0) {
      console.log('No messages found in webhook payload')
      return res.status(200).json({ success: true })
    }

    // Broadcast each message to connected clients
    messagesToBroadcast.forEach(msg => {
      const response = {
        type: 'ai',
        text: msg.text || 'No response text',
        sender: 'AI Interviewer', // Botnoi reply doesn't include sender display_name
        timestamp: msg.timestamp,
        mid: msg.mid
      }

      console.log('Broadcasting to', clients.size, 'connected clients:', response)

      // Send to all connected clients via Server-Sent Events
      clients.forEach((client, clientId) => {
        client.write(`data: ${JSON.stringify(response)}\n\n`)
      })
    })

    // Acknowledge receipt
    res.json({
      success: true,
      message: 'Message received and broadcasted',
      received_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /events - Server-Sent Events endpoint
 */
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const clientId = Date.now()
  console.log(`Client ${clientId} connected to SSE`)

  clients.set(clientId, res)

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`)

  // Handle client disconnect
  req.on('close', () => {
    console.log(`Client ${clientId} disconnected`)
    clients.delete(clientId)
  })
})

/**
 * POST /api/set-secret - Set signing secret
 */
app.post('/api/set-secret', (req, res) => {
  const { secret } = req.body
  if (secret) {
    CONFIG.signingSecret = secret
    res.json({ success: true, message: 'Secret set successfully' })
  } else {
    res.status(400).json({ error: 'Secret is required' })
  }
})

/**
 * GET /api/config - Get current config
 */
app.get('/api/config', (req, res) => {
  res.json({
    bot_id: CONFIG.bot_id,
    botnoi_webhook_url: CONFIG.botnoi_webhook_url,
    hasSecret: !!CONFIG.signingSecret,
    actualSecret: CONFIG.signingSecret,
    envSecret: process.env.BOTNOI_SECRET
  })
})

/**
 * GET /health - Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connectedClients: clients.size
  })
})

/**
 * POST /test-webhook - Test webhook
 */
app.post('/test-webhook', (req, res) => {
  console.log('=== TEST WEBHOOK RECEIVED ===')
  console.log('Body:', JSON.stringify(req.body, null, 2))

  const testResponse = {
    type: 'ai',
    text: 'This is a test response from Botnoi',
    sender: 'Test AI',
    timestamp: Date.now()
  }

  console.log('Broadcasting test message to', clients.size, 'clients')

  clients.forEach((client, clientId) => {
    console.log('Sending to client:', clientId)
    client.write(`data: ${JSON.stringify(testResponse)}\n\n`)
  })

  res.json({ success: true, message: 'Test webhook received' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`)
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`)
  console.log(`📊 SSE endpoint: http://localhost:${PORT}/events`)
  console.log(`📤 Send message endpoint: http://localhost:${PORT}/api/send-message`)
  console.log(`⚙️  Config endpoint: http://localhost:${PORT}/api/config`)
})
