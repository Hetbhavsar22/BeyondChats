import { useState } from "react"
import api from "../api/api"

export default function EmailThread({ email }) {
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <p className="text-sm font-medium">Select a conversation to read.</p>
      </div>
    )
  }

  const sendReply = async () => {
    if (!reply.trim()) return
    setLoading(true)
    try {
      await api.post("/reply", {
        to: email.sender,
        subject: email.subject,
        message: reply
      })
      alert("Reply sent")
      setReply("")
    } catch (err) {
      alert("Error sending reply")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fade pt-16 lg:pt-0">
      {/* Header */}
      <div className="p-6 lg:p-10 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-black leading-tight mb-4">
          {email.subject || '(No Subject)'}
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
              {email.sender ? email.sender[0].toUpperCase() : "?"}
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-none">{email.sender}</p>
              <p className="text-xs text-slate-500 mt-1">To: {email.receiver}</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 font-medium">
            {new Date(email.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>
      </div>

      {/* Body Content - CRITICAL READABILITY FIX */}
      <div className="p-4 lg:p-10 flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          {/* Simulation Layer: Summary (Minimal) */}
          <div className="mb-4 lg:mb-8 p-4 lg:p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 lg:mb-2 flex items-center gap-1">
              <span>✨</span> AI Summary
            </h4>
            <p className="text-xs lg:text-sm text-slate-700 leading-relaxed font-medium">
              {email.summary || `This email discusses "${email.subject}". Key points include coordinating response and tracking progress.`}
            </p>
          </div>

          {/* Email Body: Highly Readable */}
          <div className="text-[15px] lg:text-[16px] text-slate-900 leading-relaxed whitespace-pre-line font-normal selection:bg-blue-100">
            {email.body}
          </div>

          {/* Simulation Layer: Attachments (Minimal) */}
          <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 lg:mb-4">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="text-xs">📄</span>
                <span className="text-[11px] font-semibold text-slate-700">document_1.pdf</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="text-xs">📂</span>
                <span className="text-[11px] font-semibold text-slate-700">assets.zip</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Reply Footer - COLLAPSIBLE/SMALL ON MOBILE */}
      <div className="p-4 lg:p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:border-blue-400 transition-all">
          <textarea
            className="w-full p-3 lg:p-4 text-sm lg:text-[15px] text-slate-900 placeholder:text-slate-400 bg-transparent resize-none border-none focus:ring-0"
            rows={window.innerWidth < 1024 ? "2" : "4"}
            placeholder="Type your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
            <button
              className="bg-blue-600 text-white px-5 py-1.5 rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={sendReply}
              disabled={loading || !reply.trim()}
            >
              {loading ? "..." : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}