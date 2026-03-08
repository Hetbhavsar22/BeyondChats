import { useEffect, useState } from "react"
import api from "../api/api"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

export default function Integrations() {
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const connectGmail = () => {
    window.location.href = "http://127.0.0.1:8000/api/gmail/connect"
  }

  const disconnectGmail = async () => {
    if (!window.confirm("Are you sure you want to disconnect your Gmail account?")) return
    try {
      await api.post("/gmail/disconnect")
      setIsConnected(false)
      alert("Account disconnected successfully.")
    } catch (err) {
      alert("Error disconnecting account.")
    }
  }

  const syncEmails = async () => {
    setLoading(true)
    try {
      await api.post("/sync", { days })
      alert("Sync request sent to server.")
    } catch (err) {
      alert("Integration error.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/50 z-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Drawer */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform lg:transform-none transition-transform duration-300 lg:block shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full animate-fade">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Email Integrations</h1>
            <p className="text-sm text-slate-500 mt-2">Manage your email connections and synchronization settings.</p>
          </div>

          <div className="grid gap-6">
            {/* Primary Gmail Connection Card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-red-100">
                    M
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Gmail Account</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                        {isConnected ? 'Connected & Private' : 'Not Connected'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    className={`font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm ${isConnected
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      : "bg-red-600 text-white hover:bg-red-700 shadow-red-100 shadow-lg"
                      }`}
                    onClick={connectGmail}
                  >
                    <span>{isConnected ? "Re-connect Account" : "Connect Gmail Account"}</span>
                  </button>
                  {isConnected && (
                    <button
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-4 py-2"
                      onClick={disconnectGmail}
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">SYNC SETTINGS</p>
                  <p className="text-sm text-slate-700">Choose how far back you want to sync your email history.</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 px-3">
                    <span className="text-xs font-bold text-slate-500">Last</span>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-10 text-center font-black text-slate-900 border-none focus:ring-0 p-0"
                    />
                    <span className="text-xs font-bold text-slate-500">Days</span>
                  </div>
                  <button
                    className="bg-white border border-slate-200 text-slate-900 font-bold py-2 px-6 rounded-lg hover:border-slate-400 transition-colors text-xs"
                    onClick={syncEmails}
                  >
                    Start Sync
                  </button>
                </div>
              </div>
            </div>

            {/* Placeholder for Future Integrations */}
            <div className="p-8 border border-slate-200 border-dashed rounded-2xl opacity-50 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl border border-slate-100 grayscale">
                    O
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-400">Outlook (Coming Soon)</h3>
                    <p className="text-sm text-slate-400">Microsoft 365 integration is planned for the next update.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 border border-slate-300 px-2 py-1 rounded">PLANNED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}