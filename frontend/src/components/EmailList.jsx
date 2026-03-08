import { useState, useMemo } from "react";

export default function EmailList({ emails, selectEmail, selectedId }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 1) : "?";
  };

  const getTags = (email) => {
    const subject = (email.subject || "").toLowerCase();
    const tags = [];
    if (subject.includes("meeting") || subject.includes("call") || subject.includes("zoom")) 
      tags.push({ text: "Meeting", color: "bg-blue-100 text-blue-700" });
    if (subject.includes("invoice") || subject.includes("bill") || subject.includes("payment")) 
      tags.push({ text: "Invoice", color: "bg-emerald-100 text-emerald-700" });
    if (subject.includes("urgent") || subject.includes("asap") || subject.includes("priority")) 
      tags.push({ text: "Urgent", color: "bg-rose-100 text-rose-700" });
    if (subject.includes("newsletter") || subject.includes("digest") || subject.includes("weekly")) 
      tags.push({ text: "Digest", color: "bg-slate-100 text-slate-600" });
    return tags;
  };

  const filteredEmails = useMemo(() => {
    let base = emails;
    if (filter === "Files") base = emails.filter(e => e.has_attachments || (e.body || "").includes("[Attachment]"));
    else if (filter === "Urgent") base = emails.filter(e => {
        const sub = (e.subject || "").toLowerCase();
        const body = (e.body || "").toLowerCase();
        return sub.match(/urgent|asap|priority|action required|immediate|response needed/) ||
               body.match(/urgent|asap|action required/);
    });
    else if (filter === "Work") base = emails.filter(e => {
        const sub = (e.subject || "").toLowerCase();
        const sender = (e.sender || "").toLowerCase();
        return sender.match(/office|team|client|hr|hiring|recruiter|noreply|support|admin|info@|career/) ||
               sub.match(/interview|offer|application|meeting|project|deadline|report|invoice|proposal/);
    });
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(e =>
        (e.subject || "").toLowerCase().includes(q) ||
        (e.sender || "").toLowerCase().includes(q)
      );
    }
    return base;
  }, [emails, filter, search]);

  const stats = useMemo(() => {
    return {
        urgent: emails.filter(e => (e.subject || "").toLowerCase().match(/urgent|asap|priority/)).length,
        files: emails.filter(e => e.has_attachments).length,
        work: emails.filter(e => (e.sender || "").toLowerCase().match(/office|team|client/)).length
    };
  }, [emails]);

  return (
    <div className="w-full lg:w-80 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Analytics Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-900 text-xs uppercase tracking-widest">Inbox</span>
          <span className="text-[10px] font-bold text-slate-400">{filteredEmails.length}/{emails.length}</span>
        </div>
        {/* Search Bar */}
        <div className="relative mb-2">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search sender or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-[11px] border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">✕</button>}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
                { id: 'All', label: 'All' },
                { id: 'Files', label: '📎 Files', count: stats.files },
                { id: 'Urgent', label: '⚠️ Urgent', count: stats.urgent },
                { id: 'Work', label: '💼 Work', count: stats.work }
            ].map(chip => (
                <button
                    key={chip.id}
                    onClick={() => setFilter(chip.id)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                        filter === chip.id 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {chip.label} {chip.count > 0 && <span className="ml-1 opacity-60">{chip.count}</span>}
                </button>
            ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredEmails.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-medium">No messages matching "{filter}".</div>
        ) : (
          filteredEmails.map(email => {
            const tags = getTags(email);
            return (
              <div
                key={email.id}
                className={`p-4 border-b border-slate-100 transition-colors cursor-pointer ${
                  selectedId === email.id ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
                onClick={() => selectEmail(email)}
              >
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    selectedId === email.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {getInitials(email.sender)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className={`text-sm font-bold truncate ${selectedId === email.id ? "text-blue-700" : "text-slate-900"}`}>
                        {email.sender?.split('<')[0].trim() || email.sender}
                      </h4>
                      <span className="text-[9px] font-bold text-slate-400 shrink-0">
                        {new Date(email.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="text-xs font-medium text-slate-600 truncate">
                        {email.subject || '(No Subject)'}
                      </h5>
                      {email.has_attachments && (
                        <span className="text-[10px] text-slate-400">📎</span>
                      )}
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {tags.map(tag => (
                          <span key={tag.text} className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${tag.color}`}>
                            {tag.text}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-400 line-clamp-1 leading-normal">
                      {email.body?.replace(/<[^>]*>/g, '').substring(0, 60)}...
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}