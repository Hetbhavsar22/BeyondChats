import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Sparkles, FileText, Archive, Star } from "lucide-react";
import api from "../api/api";

export default function EmailThread({ email, isStarred, toggleStar }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const replyInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'r' && email) {
        e.preventDefault();
        replyInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [email]);

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-3">
        <FileText size={40} strokeWidth={1} className="text-slate-200" />
        <p className="text-sm font-medium">Select a conversation to read</p>
      </div>
    );
  }

  const sendReply = async () => {
    if (!reply.trim()) return;
    setLoading(true);
    try {
      await api.post("/reply", {
        to: email.sender,
        subject: email.subject,
        message: reply
      });
      setSent(true);
      setReply("");
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      alert("Error sending reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden pt-16 lg:pt-0">
      <div className="p-6 lg:p-10 border-b border-slate-100">
        <h2 className="text-xl lg:text-2xl font-bold text-black leading-tight mb-4 flex items-start gap-3">
          <button onClick={toggleStar} className="mt-1 flex-shrink-0 text-slate-300 hover:text-amber-400 transition-colors focus:outline-none">
            <Star size={20} className={isStarred ? "fill-amber-400 text-amber-400" : ""} />
          </button>
          <span>{email.subject || '(No Subject)'}</span>
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {email.sender ? email.sender[0].toUpperCase() : "?"}
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-none text-sm">
                {email.sender?.split('<')[0].trim() || email.sender}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">To: {email.receiver}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {email.has_attachments && (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
                <Paperclip size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-500 font-medium">Attached</span>
              </div>
            )}
            <div className="text-right text-xs text-slate-400 font-medium">
              {new Date(email.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-10 flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles size={11} />
              AI Summary
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {email.summary || `This email discusses "${email.subject}". Key points include coordinating response and tracking progress.`}
            </p>
          </div>

          <div
            className="text-[15px] text-slate-900 leading-relaxed font-normal selection:bg-blue-100 content-area"
            dangerouslySetInnerHTML={{
              __html: email.body && email.body.startsWith('<')
                ? email.body
                : `<div style="white-space:pre-wrap">${email.body || ''}</div>`
            }}
          />

          {email.has_attachments && (
            <div className="mt-10 pt-6 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Paperclip size={11} />
                Attachments
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <Archive size={12} className="text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-700">attachment.zip</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 lg:p-6 border-t border-slate-100 bg-slate-50/50">
        {sent && (
          <div className="flex items-center justify-center gap-2 mb-2 text-green-600 text-[11px] font-semibold bg-green-50 py-1.5 rounded-lg border border-green-100">
            <Send size={11} />
            Reply sent successfully!
          </div>
        )}
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:border-blue-400 transition-all">
          <textarea
            ref={replyInputRef}
            className="w-full p-3 lg:p-4 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent resize-none border-none focus:ring-0"
            rows={window.innerWidth < 1024 ? "2" : "4"}
            placeholder="Type your reply... (Press 'r' to focus)"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Replying to: {email.sender?.split('<')[0].trim()}</span>
            <button
              className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[11px] font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              onClick={sendReply}
              disabled={loading || !reply.trim()}
            >
              <Send size={11} />
              {loading ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}