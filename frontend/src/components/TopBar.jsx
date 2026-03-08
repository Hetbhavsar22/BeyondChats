import { useState, useEffect } from "react"
import api from "../api/api"

export default function TopBar({ onMenuClick, onSyncComplete }) {
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [syncMsg, setSyncMsg] = useState(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const res = await api.get("/gmail/status")
      setIsConnected(res.data.connected)
    } catch (err) {
      console.error("Status check failed")
    }
  }

  const connect = () => {
    window.location.href = "http://127.0.0.1:8000/api/gmail/connect"
  }

  const syncEmails = async () => {
    setLoading(true)
    setSyncMsg(null)
    try {
      await api.post("/sync", { days })
      if (onSyncComplete) onSyncComplete()
      setSyncMsg({ type: 'success', text: `✓ Synced ${days}-day inbox` })
    } catch (err) {
      setSyncMsg({ type: 'error', text: '✗ Sync failed. Check backend.' })
    } finally {
      setLoading(false)
      setTimeout(() => setSyncMsg(null), 3500)
    }
  }

  return (
    <div className="sticky top-0 z-30 bg-white">
      <div className="border-b border-slate-200 min-h-16 lg:h-16 flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-6 py-3 lg:py-0 transition-all">
      <div className="flex items-center justify-between w-full lg:w-auto mb-3 lg:mb-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Dashboard</h2>
        </div>
        {isConnected && (
          <div className="lg:hidden flex items-center gap-1.5 bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black uppercase">Live</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:gap-4 justify-end lg:justify-end w-full lg:w-auto">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 flex-1 sm:flex-none justify-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase hidden sm:inline">History:</span>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="bg-transparent border-none text-center font-black text-slate-900 text-xs w-6 focus:ring-0 p-0"
          />
          <span className="text-[9px] font-bold text-slate-400 uppercase">Days</span>
        </div>

        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          {isConnected ? (
            <div className="hidden lg:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span className="text-[10px] font-bold uppercase tracking-wide">Gmail Connected</span>
            </div>
          ) : (
            <button
              className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors shadow-sm flex-1 sm:flex-none"
              onClick={connect}
            >
              Connect
            </button>
          )}

          <button
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-100 disabled:opacity-50 flex-1 sm:flex-none"
            onClick={syncEmails}
            disabled={loading}
          >
            {loading ? "..." : "Sync Now"}
          </button>
        </div>
      </div>
      </div>
      {syncMsg && (
        <div className={`text-center text-[11px] font-bold py-1.5 px-4 transition-all ${
          syncMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {syncMsg.text}
        </div>
      )}
    </div>
  )
}