/**
 * Send message to Botnoi via backend proxy
 * This avoids CORS issues by routing through our Express server
 */

const WEBHOOK_SERVER_URL = 'https://cs497-botnoi-backend.onrender.com'

// Configuration
const CONFIG = {
  bot_id: '69fc494afb3079f00790fcf7',
  signingSecret: 'sk_live_40355cd5f1bf3891d41e554d79110b27',
  display_name: 'AI Interview User'
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
        signingSecret: signingSecret
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
