import { Link, useLocation } from "react-router-dom";
import { Mail, Send, Settings, BarChart2, X } from "lucide-react";

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const navItems = [
    { name: "Inbox", icon: Mail, path: "/" },
    { name: "Sent", icon: Send, path: "/sent" },
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
    { name: "Integrations", icon: Settings, path: "/integrations" },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 shadow-xl lg:shadow-none">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
          BeyondChats
        </h1>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-medium ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
          v1.0.0 Stable
        </p>
      </div>
    </div>
  );
}