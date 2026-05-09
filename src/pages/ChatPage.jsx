import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import { sendMessageToWebhook, getConfig } from '../services/webhookService'
import { connectSSE, disconnectSSE, subscribeToMessages } from '../services/sseService'

const CONFIG = getConfig()

export default function ChatPage({ onGoVoice, onLogout, isDark, toggleTheme }) {
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Tell me about yourself and your experience.' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [mode, setMode] = useState('normal')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Connect to SSE on mount
  useEffect(() => {
    setConnectionStatus('connecting')
    
    connectSSE(
      (data) => {
        if (data.type === 'connected') {
          setConnectionStatus('connected')
        } else if (data.type === 'ai' && data.text) {
          const cleanText = data.text.trim()
          if (cleanText !== '' && cleanText !== 'No response text') {
            setMessages(prev => [...prev, {
              type: 'ai',
              text: cleanText
            }])
          }
          setIsLoading(false)
        }
      },
      (error) => {
        setConnectionStatus('error')
      }
    )

    // Cleanup on unmount
    return () => {
      disconnectSSE()
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')
    setIsLoading(true)

    try {
      const result = await sendMessageToWebhook(userMessage, mode, CONFIG.signingSecret)
      if (!result.success) {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: `Error: ${result.error}` 
        }])
        setIsLoading(false)
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: 'Sorry, there was an error processing your message.' 
      }])
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans ${isDark ? 'dark' : ''}`}>
      <Sidebar 
        activeTab="chat" 
        onGoVoice={onGoVoice} 
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Interview</h1>
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 
              connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 
              'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                'bg-red-500'
              }`}></span>
              {connectionStatus === 'connected' ? 'Online' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 
               'Offline'}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.415l-.708-.708a1 1 0 010-1.415zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.636 15.636a1 1 0 010 1.415l-.707.707a1 1 0 01-1.415-1.414l.707-.707a1 1 0 011.415 0zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM5.364 15.636a1 1 0 01-1.415 0l-.707-.707a1 1 0 011.414-1.415l.708.708a1 1 0 010 1.414zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zM6.778 5.364a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                User
              </span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold shadow-md">
                U
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950 relative">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-6 py-4 shadow-sm ${
                    msg.type === 'ai'
                      ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 rounded-tl-none'
                      : 'bg-primary-600 text-white rounded-tr-none'
                  }`}>
                    {msg.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-xs">
                          🤖
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">AI Interviewer</span>
                      </div>
                    )}
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800/80 rounded-2xl rounded-tl-none px-6 py-5 shadow-sm flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="max-w-4xl mx-auto flex gap-3 items-end">
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
                  <textarea
                    className="w-full bg-transparent px-5 py-4 outline-none text-gray-900 dark:text-white placeholder-gray-400 resize-none min-h-[56px] max-h-[200px]"
                    placeholder="Type your answer here..."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!isLoading) handleSendMessage();
                      }
                    }}
                    disabled={isLoading}
                    rows="1"
                  />
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-14 h-14 shrink-0 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all hover-lift"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
              <div className="text-center mt-3">
                <span className="text-xs text-gray-400 dark:text-gray-500">Press Enter to send, Shift + Enter for new line</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Mode Settings */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 flex flex-col shrink-0 overflow-y-auto hidden lg:flex">
            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">
              Interview Settings
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => setMode('normal')}
                className={`w-full text-left p-5 rounded-2xl transition-all border ${
                  mode === 'normal'
                    ? 'bg-white dark:bg-gray-800 border-primary-500 shadow-md ring-1 ring-primary-500'
                    : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">Normal Mode</h4>
                  {mode === 'normal' && <span className="w-3 h-3 rounded-full bg-primary-500"></span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Casual practice. Take your time to answer without pressure.
                </p>
              </button>

              <button
                onClick={() => setMode('virtual')}
                className={`w-full text-left p-5 rounded-2xl transition-all border ${
                  mode === 'virtual'
                    ? 'bg-white dark:bg-gray-800 border-purple-500 shadow-md ring-1 ring-purple-500'
                    : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">Virtual Mode</h4>
                  {mode === 'virtual' && <span className="w-3 h-3 rounded-full bg-purple-500"></span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Strict evaluation. Simulates a real, high-pressure interview.
                </p>
              </button>
            </div>
            
            <div className="mt-8 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
               <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Tips</h4>
               <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc pl-4">
                 <li>Be concise and clear in your answers.</li>
                 <li>Use the STAR method (Situation, Task, Action, Result).</li>
                 <li>Take a deep breath before responding.</li>
               </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
