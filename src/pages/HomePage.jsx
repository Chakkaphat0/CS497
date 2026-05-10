import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

export default function HomePage({ onGoChat, onGoVoice, onGoProfile }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(
          collection(db, 'chatHistory'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const historyData = [];
        querySnapshot.forEach((doc) => {
          historyData.push({ id: doc.id, ...doc.data() });
        });
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [])

  return (
    <section className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-500 relative overflow-hidden flex flex-col items-center">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={onGoProfile}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all hover-lift"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 border border-gray-300 dark:border-gray-600">
            {auth.currentUser?.photoURL ? (
              <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          Profile
        </button>
      </div>

      <div className="max-w-5xl w-full z-10 mt-12 mb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 mb-6 tracking-tight">
            Choose Your Interview Mode
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select how you want to practice your interview skills. You can chat with our AI or use your voice for a more realistic experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* CHAT */}
          <button
            onClick={onGoChat}
            className="group glass-panel rounded-[2.5rem] p-10 text-left hover-lift transition-all duration-300 border-2 border-transparent hover:border-primary-500/50"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-300">
              💬
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Chat Interview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Practice answering interview questions through text. Take your time to formulate your responses and get detailed feedback.
            </p>
          </button>

          {/* VOICE */}
          <button
            onClick={onGoVoice}
            className="group glass-panel rounded-[2.5rem] p-10 text-left hover-lift transition-all duration-300 border-2 border-transparent hover:border-purple-500/50"
          >
            <div className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-300">
              🎙️
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Voice Interview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Experience a realistic interview simulation by speaking your answers aloud. Practice your delivery and tone.
            </p>
          </button>
        </div>
      </div>

      {/* Chat History Section */}
      <div className="max-w-5xl w-full z-10">
        <div className="glass-panel p-8 rounded-[2rem]">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Interview History
          </h2>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              No interview history found. Start a new interview to see it here!
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChat(chat)}
                  className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800/80 group flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${chat.mode === 'virtual' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'}`}>
                        {chat.mode === 'virtual' ? 'Virtual Mode' : 'Normal Mode'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {chat.timestamp ? new Date(chat.timestamp.toDate()).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-1">
                      {chat.messages && chat.messages.length > 2 
                        ? chat.messages[2]?.text 
                        : "No conversation data"}
                    </p>
                  </div>
                  <div className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* History Modal */}
      {selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Interview Record</h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.timestamp ? new Date(selectedChat.timestamp.toDate()).toLocaleString() : 'Unknown Time'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedChat(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950/50">
              {selectedChat.messages?.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.type === 'ai'
                      ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm'
                      : 'bg-primary-600 text-white rounded-tr-none shadow-md'
                  }`}>
                    {msg.type === 'ai' && <div className="text-xs font-bold text-primary-500 mb-1">AI</div>}
                    {msg.type === 'user' && <div className="text-xs font-bold text-primary-200 mb-1">You</div>}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
