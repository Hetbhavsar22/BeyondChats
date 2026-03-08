import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function StatCard({ label, value, sub, color = "bg-slate-50" }) {
  return (
    <div className={`${color} rounded-xl p-4 border border-slate-100`}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Analytics() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/emails").then(res => {
      setEmails(res.data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    if (!emails.length) return null;

    // Sender frequency
    const senderMap = {};
    emails.forEach(e => {
      const name = (e.sender || "Unknown").split("<")[0].trim();
      senderMap[name] = (senderMap[name] || 0) + 1;
    });
    const topSenders = Object.entries(senderMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Topic distribution 
    const topics = { Meeting: 0, Invoice: 0, Urgent: 0, Digest: 0, Other: 0 };
    emails.forEach(e => {
      const sub = (e.subject || "").toLowerCase();
      if (sub.match(/meeting|call|zoom/)) topics.Meeting++;
      else if (sub.match(/invoice|bill|payment/)) topics.Invoice++;
      else if (sub.match(/urgent|asap|priority/)) topics.Urgent++;
      else if (sub.match(/newsletter|digest|weekly/)) topics.Digest++;
      else topics.Other++;
    });

    // Attachments
    const withFiles = emails.filter(e => e.has_attachments).length;

    // Daily frequency (last 7 days)
    const today = new Date();
    const daily = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const label = d.toLocaleDateString([], { weekday: "short" });
      const count = emails.filter(e => {
        const ed = new Date(e.created_at);
        return ed.toDateString() === d.toDateString();
      }).length;
      return { label, count };
    });
    const maxDay = Math.max(...daily.map(d => d.count), 1);

    return { topSenders, topics, withFiles, daily, maxDay };
  }, [emails]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading insights...</div>
  );

  if (!stats) return (
    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">No data yet. Sync some emails first.</div>
  );

  const topicColors = {
    Meeting: "bg-blue-500", Invoice: "bg-emerald-500",
    Urgent: "bg-rose-500", Digest: "bg-slate-400", Other: "bg-slate-200"
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-5">
          <Link to="/" className="text-[11px] text-slate-400 hover:text-slate-600 font-bold">← Back to Inbox</Link>
          <h1 className="text-xl font-black text-slate-900 mt-1">Inbox Insights</h1>
          <p className="text-xs text-slate-400 mt-0.5">Analytics calculated from your synced emails in real-time.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatCard label="Total Emails" value={emails.length} sub="In your inbox" color="bg-white" />
          <StatCard label="With Attachments" value={stats.withFiles} sub={`${Math.round(stats.withFiles / emails.length * 100)}% of inbox`} color="bg-white" />
          <StatCard label="Urgent Emails" value={stats.topics.Urgent} sub="Flagged as urgent" color="bg-rose-50" />
          <StatCard label="Top Category" value={Object.entries(stats.topics).sort((a,b)=>b[1]-a[1])[0][0]} sub="Most common topic" color="bg-blue-50" />
        </div>

        {/* Daily Activity Bar Chart */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 mb-4">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">7-Day Activity</h2>
          <div className="flex items-end gap-2 h-20">
            {stats.daily.map(day => (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 rounded-t-sm transition-all"
                  style={{ height: `${Math.max(4, (day.count / stats.maxDay) * 64)}px` }}
                  title={`${day.count} emails`}
                />
                <span className="text-[9px] text-slate-400 font-bold">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 mb-4">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">Topic Breakdown</h2>
          <div className="space-y-2">
            {Object.entries(stats.topics).map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 w-16">{topic}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className={`${topicColors[topic]} h-2 rounded-full transition-all`}
                    style={{ width: `${(count / emails.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Senders */}
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">Top Senders</h2>
          <div className="space-y-2">
            {stats.topSenders.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-300 w-4">#{i + 1}</span>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                  {name[0]?.toUpperCase()}
                </div>
                <span className="flex-1 text-xs text-slate-700 font-medium truncate">{name}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{count} emails</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
