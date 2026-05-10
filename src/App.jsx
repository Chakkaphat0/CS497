import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import VoicePage from './pages/VoicePage'
import ProfilePage from './pages/ProfilePage'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const handleLogin = () => {
    setCurrentPage('home')
  }

  const handleGoHome = () => {
    setCurrentPage('home')
  }

  const handleGoChat = () => {
    setCurrentPage('chat')
  }

  const handleGoVoice = () => {
    setCurrentPage('voice')
  }

  const handleGoProfile = () => {
    setCurrentPage('profile')
  }

  const handleLogout = () => {
    setCurrentPage('login')
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className={`transition-all duration-300 ${isDark ? 'dark' : ''}`}>
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'home' && <HomePage onGoChat={handleGoChat} onGoVoice={handleGoVoice} onGoProfile={handleGoProfile} />}
      {currentPage === 'profile' && <ProfilePage onBack={handleGoHome} onLogout={handleLogout} />}
      {currentPage === 'chat' && (
        <ChatPage 
          onGoVoice={handleGoVoice} 
          onLogout={handleLogout}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      )}
      {currentPage === 'voice' && (
        <VoicePage 
          onGoChat={handleGoChat} 
          onLogout={handleLogout}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  )
}

export default App
