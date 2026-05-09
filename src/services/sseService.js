/**
 * Server-Sent Events service for receiving real-time messages from Botnoi
 */

let eventSource = null
let listeners = []

/**
 * Connect to SSE endpoint
 */
export function connectSSE(onMessage, onError) {
  if (eventSource) {
    eventSource.close()
  }

  try {
    eventSource = new EventSource('http://localhost:3002/events')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('SSE Message received:', data)
        
        if (onMessage) {
          onMessage(data)
        }

        // Notify all listeners
        listeners.forEach(listener => listener(data))
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      if (onError) {
        onError(error)
      }
      eventSource.close()
    }

    console.log('Connected to SSE endpoint')
  } catch (error) {
    console.error('Error connecting to SSE:', error)
    if (onError) {
      onError(error)
    }
  }
}

/**
 * Disconnect from SSE
 */
export function disconnectSSE() {
  if (eventSource) {
    eventSource.close()
    eventSource = null
    console.log('Disconnected from SSE')
  }
}

/**
 * Subscribe to SSE messages
 */
export function subscribeToMessages(callback) {
  listeners.push(callback)
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter(l => l !== callback)
  }
}

/**
 * Check if connected
 */
export function isConnected() {
  return eventSource !== null && eventSource.readyState === EventSource.OPEN
}
