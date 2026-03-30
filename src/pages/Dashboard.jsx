import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import axios from 'axios'

function Dashboard({ fileName, file, onReset }) {
  const [csvData, setCsvData] = useState([])
  const [columns, setColumns] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data)
          setColumns(Object.keys(results.data[0] || {}))
        }
      })
    }
  }, [file])
   const chartData = csvData
    .reduce((acc, row) => {
      const product = row['PRODUCTLINE']
      const sales = parseFloat(row['SALES']) || 0
      const existing = acc.find(a => a.name === product)
      if (existing) existing.sales += sales
      else acc.push({ name: product, sales: Math.round(sales) })
      return acc
    }, [])
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6)
    

  const askAI = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('question', question)

      const response = await axios.post('https://insightiq-backend-4ifh.onrender.com/analyze', formData)
      setAnswer(response.data.answer)
    } catch (err) {
      console.log('Error:', err)
      setAnswer('Something went wrong.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-8 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-violet-500"></div>
            <span className="font-semibold tracking-tight">InsightIQ</span>
          </div>
          <p className="text-white/40 text-sm">Analyzing: {fileName}</p>
        </div>
        <button 
        onClick={onReset}
        className="text-sm bg-white/5 hover:bg-white/10 transition px-4 py-2 rounded-lg border border-white/10">
          Upload new file
        </button>
      </div>

      {/* Columns Detected */}
      <div className="mb-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Columns Detected</p>
        <div className="flex flex-wrap gap-2">
          {columns.map((col) => (
            <span key={col} className="bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1 rounded-full">
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Total Rows</p>
          <p className="text-2xl font-bold">{csvData.length}</p>
          <p className="text-violet-400 text-xs mt-1">records loaded</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Total Columns</p>
          <p className="text-2xl font-bold">{columns.length}</p>
          <p className="text-violet-400 text-xs mt-1">fields detected</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">File Name</p>
          <p className="text-lg font-bold truncate">{fileName}</p>
          <p className="text-violet-400 text-xs mt-1">uploaded</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">AI Status</p>
          <p className="text-2xl font-bold">Ready</p>
          <p className="text-violet-400 text-xs mt-1">Gemini connected</p>
        </div>
      </div>
      {/* Chart */}
{chartData.length > 0 && (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
    <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Sales by Product Line</p>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 12 }} />
        <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 12 }} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff20', borderRadius: '8px' }}
          labelStyle={{ color: '#fff' }}
        />
        <Bar dataKey="sales" fill="#7c3aed" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}

      {/* AI Chat Box */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Ask your data anything</p>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAI()}
            placeholder="e.g. Which product had the highest sales?"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500 transition"
          />
          <button
            onClick={askAI}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 transition px-5 py-3 rounded-xl text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>

        {/* AI Answer */}
        {answer && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <p className="text-xs text-violet-400 mb-2">AI Insight</p>
            <p className="text-white/80 text-sm leading-relaxed">{answer}</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard