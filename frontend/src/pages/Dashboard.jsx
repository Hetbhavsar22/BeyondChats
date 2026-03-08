import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"
import EmailList from "../components/EmailList"
import EmailThread from "../components/EmailThread"
import api from "../api/api"

export default function Dashboard({ folder = "inbox" }) {
  const [emails, setEmails] = useState([])
  const [selected, setSelected] = useState(null)
  const [isMobileListVisible, setIsMobileListVisible] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [starredIds, setStarredIds] = useState(() => {
    const saved = localStorage.getItem("starredEmails")
    return saved ? JSON.parse(saved) : []
  })

  // Save starred tags to completely local storage
  useEffect(() => {
    localStorage.setItem("starredEmails", JSON.stringify(starredIds))
  }, [starredIds])

  useEffect(() => {
    fetchEmails()
    setSelected(null)
    setIsMobileListVisible(true)
  }, [folder])

  const fetchEmails = () => {
    api.get("/emails").then(res => {
      setEmails(res.data)
    })
  }

  const handleSelectEmail = (email) => {
    setSelected(email)
    if (window.innerWidth < 1024) {
      setIsMobileListVisible(false)
    }
  }

  const toggleStar = (id, e) => {
    e.stopPropagation()
    setStarredIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const displayedEmails = emails.filter(e => e.folder === folder)

  // Global Keyboard Shortcuts for Navigation (j/k)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault();
        const currentIdx = displayedEmails.findIndex(m => m.id === selected?.id);
        
        if (e.key === 'j') {
          // move down
          if (currentIdx === -1 && displayedEmails.length > 0) {
            handleSelectEmail(displayedEmails[0]);
          } else if (currentIdx < displayedEmails.length - 1) {
            handleSelectEmail(displayedEmails[currentIdx + 1]);
            document.getElementById(`email-row-${displayedEmails[currentIdx + 1].id}`)?.scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'k') {
          // move up
          if (currentIdx > 0) {
            handleSelectEmail(displayedEmails[currentIdx - 1]);
            document.getElementById(`email-row-${displayedEmails[currentIdx - 1].id}`)?.scrollIntoView({ block: 'nearest' });
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayedEmails, selected]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative">
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform lg:transform-none transition-transform duration-300 lg:block shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} activeTab={folder} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-2xl relative">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} onSyncComplete={fetchEmails} />

        <div className="flex flex-1 overflow-hidden relative">
          <div className={`${isMobileListVisible ? 'flex' : 'hidden'} lg:flex h-full border-r border-slate-100 shrink-0`}>
            <EmailList
              emails={displayedEmails}
              selectEmail={handleSelectEmail}
              selectedId={selected?.id}
              folderName={folder === 'sent' ? 'Sent' : 'Inbox'}
              starredIds={starredIds}
              toggleStar={toggleStar}
            />
          </div>

          <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} lg:flex flex-1 h-full z-20 bg-white overflow-hidden relative`}>
            {!isMobileListVisible && (
              <div className="lg:hidden absolute top-4 left-4 z-50">
                <button 
                  onClick={() => setIsMobileListVisible(true)}
                  className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                >
                  <span className="text-lg font-normal">←</span> Back to {folder === 'sent' ? 'Sent' : 'Inbox'}
                </button>
              </div>
            )}
            <EmailThread 
              email={selected} 
              isStarred={selected ? starredIds.includes(selected.id) : false}
              toggleStar={(e) => selected && toggleStar(selected.id, e)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}