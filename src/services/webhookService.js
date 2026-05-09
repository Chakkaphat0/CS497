/**
 * Send message to Botnoi via backend proxy
 * This avoids CORS issues by routing through our Express server
 */

const WEBHOOK_SERVER_URL = 'https://cs497-botnoi-backend.onrender.com'

// Configuration
const CONFIG = {
  bot_id: '69ff88c4fb3079f00791405c',
  signingSecret: 'YOUR_SECRET_KEY',
  display_name: 'AI Interview User'
}

/**
 * Get or create a consistent user ID for this session
 * This ensures Botnoi remembers the context of the conversation
 */
function getUserId() {
  let userId = localStorage.getItem('botnoi_user_id')
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('botnoi_user_id', userId)
  }
  return userId
}

/**
 * Send message to Botnoi webhook via backend proxy
 */
export async function sendMessageToWebhook(messageText, mode = 'normal', signingSecret) {
  try {
    console.log('Frontend - Sending message via backend proxy')
    console.log('- Message:', messageText)
    console.log('- Mode:', mode)
    console.log('- Has Secret:', !!signingSecret)

    const response = await fetch(`${WEBHOOK_SERVER_URL}/api/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messageText: messageText,
        mode: mode,
        signingSecret: signingSecret,
        userId: getUserId()
      })
    })

    console.log('Frontend - Backend Response Status:', response.status)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `Backend error: ${response.status}`)
    }

    console.log('Frontend - Message sent successfully:', data)

    return {
      success: true,
      data: data,
      userUid: data.userUid,
      messageId: data.messageId,
      timestamp: data.timestamp
    }
  } catch (error) {
    console.error('Frontend - Error sending message:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Set signing secret
 */
export function setSigningSecret(secret) {
  CONFIG.signingSecret = secret
}

/**
 * Get current config
 */
export function getConfig() {
  return { ...CONFIG }
}
