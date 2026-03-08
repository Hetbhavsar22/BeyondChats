import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const navItems = [
    { name: "Chats", icon: "✉️", path: "/" },
    { name: "Integrations", icon: "⚙️", path: "/integrations" },
  ];

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 h-screen flex flex-col sticky top-0 shadow-xl lg:shadow-none">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="text-blue-600">●</span> BeyondChats
        </h1>
        <button 
          onClick={onClose}
          className="lg:hidden p-1.5 hover:bg-slate-200 rounded text-slate-400"
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-medium ${location.pathname === item.path
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
           v1.0.0 Stable
        </p>
      </div>
    </div>
  );
}