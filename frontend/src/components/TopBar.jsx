import { useState, useEffect } from "react";
import { Menu, RefreshCw, Wifi, WifiOff, Check, AlertCircle } from "lucide-react";
import api from "../api/api";

export default function TopBar({ onMenuClick, onSyncComplete }) {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await api.get("/gmail/status");
      setIsConnected(res.data.connected);
    } catch (err) {
      console.error("Status check failed");
    }
  };

  const connect = () => {
    window.location.href = "http://127.0.0.1:8000/api/gmail/connect";
  };

  const syncEmails = async () => {
    setLoading(true);
    setSyncMsg(null);
    try {
      const res = await api.post("/sync", { days });
      const count = res.data?.count ?? "some";
      setSyncMsg({ type: "success", text: `Synced ${count} emails from last ${days} day(s)` });
    } catch (err) {
      setSyncMsg({ type: "warning", text: "Sync may have timed out. Refreshing inbox..." });
    } finally {
      setLoading(false);
      if (onSyncComplete) onSyncComplete();
      setTimeout(() => setSyncMsg(null), 4000);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white">
      <div className="border-b border-slate-200 h-14 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <Menu size={18} />
          </button>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Dashboard</h2>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="hidden lg:flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100">
              <Wifi size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Gmail Connected</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">
              <WifiOff size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Not Connected</span>
            </div>
          )}

          {isConnected && (
            <div className="lg:hidden flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-green-600 uppercase">Live</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase hidden sm:inline">History:</span>
            <input
              type="number"
              value={days}
              min={1}
              max={90}
              onChange={(e) => setDays(e.target.value)}
              className="bg-transparent border-none text-center font-black text-slate-900 text-xs w-6 focus:ring-0 p-0"
            />
            <span className="text-[9px] font-bold text-slate-400 uppercase">Days</span>
          </div>

          {!isConnected && (
            <button
              className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
              onClick={connect}
            >
              Connect Gmail
            </button>
          )}

          <button
            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            onClick={syncEmails}
            disabled={loading}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className={`flex items-center justify-center gap-2 py-1.5 px-4 text-[11px] font-semibold ${syncMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"
          }`}>
          {syncMsg.type === "success" ? <Check size={12} /> : <AlertCircle size={12} />}
          {syncMsg.text}
        </div>
      )}
    </div>
  );
}