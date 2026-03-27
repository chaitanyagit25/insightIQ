import { useState } from 'react'
import Dashboard from './pages/Dashboard'

function App() {
  const [file, setFile] = useState(null)
  const [showDashboard, setShowDashboard] = useState(false)

  if (showDashboard) {
    return <Dashboard fileName={file?.name} file={file} onReset={() => { setFile(null); setShowDashboard(false) }} />
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500"></div>
          <span className="font-semibold text-white tracking-tight">InsightIQ</span>
        </div>
        <button className="text-sm text-white/50 hover:text-white transition">
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <div className="text-xs font-medium tracking-widest text-violet-400 uppercase mb-4">
          AI Business Intelligence
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Your data, <span className="text-violet-400">finally</span> speaking.
        </h1>
        <p className="text-white/40 text-lg max-w-xl mb-10">
          Upload your business data and ask anything in plain English. No SQL. No analyst. Just answers.
        </p>

        {/* Upload Box */}
        <div className="w-full max-w-lg border border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center gap-4 hover:border-violet-500/50 transition cursor-pointer bg-white/5">
          <div className="text-3xl">📁</div>
          <p className="text-white/60 text-sm">Drop your CSV or Excel file here</p>
          <label className="cursor-pointer bg-violet-600 hover:bg-violet-500 transition text-white text-sm font-medium px-5 py-2 rounded-lg">
            Browse File
            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          {file && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-violet-400 text-sm">✓ {file.name}</p>
              <button
                onClick={() => setShowDashboard(true)}
                className="bg-violet-600 hover:bg-violet-500 transition text-white text-sm font-medium px-6 py-2 rounded-lg"
              >
                Analyse →
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default App