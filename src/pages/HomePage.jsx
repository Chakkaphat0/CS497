export default function HomePage({ onGoChat, onGoVoice }) {
  return (
    <section className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-500 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full z-10">
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
    </section>
  )
}
