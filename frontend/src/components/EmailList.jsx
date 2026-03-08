export default function EmailList({ emails, selectEmail, selectedId }) {
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 1) : "?";
  };

  return (
    <div className="w-full lg:w-80 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <span className="font-bold text-slate-900 text-xs uppercase tracking-widest">Inbox</span>
        <span className="text-[10px] font-bold text-slate-400">{emails.length} items</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {emails.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-medium">No messages found.</div>
        ) : (
          emails.map(email => (
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
                  
                  <p className="text-xs text-slate-400 line-clamp-1 leading-normal">
                    {email.body?.substring(0, 60)}...
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}