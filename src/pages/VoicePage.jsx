import { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

export default function VoicePage({ onGoChat, onGoHistory, onLogout, isDark, toggleTheme }) {
  const [mode, setMode] = useState('normal')
  const [isRecording, setIsRecording] = useState(false)
  const [micStatus, setMicStatus] = useState('idle') // 'idle', 'error'
  
  const streamRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const visualizerRef = useRef(null)

  const stopMicrophone = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error)
      audioContextRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (visualizerRef.current) {
      visualizerRef.current.style.transform = 'scale(1)'
      visualizerRef.current.style.boxShadow = 'none'
    }
    setIsRecording(false)
    setMicStatus('idle')
  }

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setIsRecording(true)
      setMicStatus('listening')

      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength
        
        if (visualizerRef.current) {
          // Calculate scale and glow based on volume
          const scale = 1 + (average / 150)
          const clampedScale = Math.min(Math.max(scale, 1), 1.4)
          visualizerRef.current.style.transform = `scale(${clampedScale})`
          
          const glowIntensity = Math.min(average * 0.8, 100)
          visualizerRef.current.style.boxShadow = `0 0 ${glowIntensity}px ${glowIntensity / 3}px rgba(168, 85, 247, 0.5)`
        }
        
        animationFrameRef.current = requestAnimationFrame(updateVisualizer)
      }

      updateVisualizer()
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setMicStatus('error')
      alert('ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาตรวจสอบการอนุญาตใช้งานไมโครโฟนในเบราว์เซอร์ของคุณ')
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopMicrophone()
    } else {
      startMicrophone()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone()
    }
  }, [])

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans ${isDark ? 'dark' : ''}`}>
      <Sidebar 
        activeTab="voice" 
        onGoChat={onGoChat} 
        onGoHistory={onGoHistory}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Interview</h1>
          
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
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">User</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                U
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Voice Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-950 relative">
            
            <div className="text-center max-w-2xl w-full z-10 animate-fade-in-up">
              <div className="mb-12 relative inline-block">
                {isRecording && (
                  <>
                    <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute -inset-4 bg-purple-400 rounded-full animate-pulse opacity-10"></div>
                  </>
                )}
                
                {/* Visualizer Target */}
                <div 
                  ref={visualizerRef}
                  className={`w-40 h-40 rounded-full flex items-center justify-center text-6xl shadow-2xl relative z-10 transition-colors duration-300 ${
                    isRecording 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                  style={{ transition: 'transform 0.1s ease-out, background 0.3s' }}
                >
                  🎙️
                </div>
              </div>

              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                {isRecording ? 'Listening...' : 'Ready to speak'}
              </h2>
              
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 h-14">
                {isRecording 
                  ? 'Speak your answer clearly. The UI will react to your voice.' 
                  : 'Tap the button below to allow microphone access and test.'}
              </p>

              <button 
                onClick={toggleRecording}
                className={`px-10 py-5 rounded-full text-xl font-bold shadow-xl transition-all hover-lift flex items-center gap-3 mx-auto ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30'
                }`}
              >
                {isRecording ? (
                  <>
                    <span className="w-4 h-4 bg-white rounded-sm animate-pulse"></span>
                    Stop Listening
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Start Speaking
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Sidebar - Mode Settings */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 flex flex-col shrink-0 hidden lg:flex">
            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">
              Voice Settings
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => !isRecording && setMode('normal')}
                className={`w-full text-left p-5 rounded-2xl transition-all border ${
                  mode === 'normal'
                    ? 'bg-white dark:bg-gray-800 border-purple-500 shadow-md ring-1 ring-purple-500'
                    : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isRecording}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">Normal Voice</h4>
                  {mode === 'normal' && <span className="w-3 h-3 rounded-full bg-purple-500"></span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Relaxed practice. The AI will be friendly and accommodating.
                </p>
              </button>

              <button
                onClick={() => !isRecording && setMode('virtual')}
                className={`w-full text-left p-5 rounded-2xl transition-all border ${
                  mode === 'virtual'
                    ? 'bg-white dark:bg-gray-800 border-pink-500 shadow-md ring-1 ring-pink-500'
                    : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isRecording}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">Virtual Voice</h4>
                  {mode === 'virtual' && <span className="w-3 h-3 rounded-full bg-pink-500"></span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Strict evaluation focusing on tone, clarity, and professionalism.
                </p>
              </button>
            </div>
            
            <div className="mt-8 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
               <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Microphone Status</h4>
               
               {micStatus === 'error' ? (
                 <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                   Access Denied
                 </p>
               ) : micStatus === 'listening' ? (
                 <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-2 font-bold animate-pulse">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                   Microphone is active
                 </p>
               ) : (
                 <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                   Ready to connect
                 </p>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
