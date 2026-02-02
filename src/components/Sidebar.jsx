import React, { useState } from 'react';
import { useConnection } from '@/context/ConnectionContext';
import { Database, Plus, Code, Search, Box, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const { connections, activeConnectionId, setActiveConnection } = useConnection();
  const [search, setSearch] = useState('');
  const location = useLocation();

  const filtered = connections.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.database.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full p-5 overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
          <Database size={22} />
        </div>
        <div>
          <h1 className="font-black text-slate-800 text-lg leading-tight">داتا-مايند</h1>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">موصل ذكي</p>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 mb-6">
        <Plus size={20} />
        <span>اتصال جديد</span>
      </button>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="ابحث عن قاعدة..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Nav Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 space-y-1.5">
        <Link to="/" className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
          location.pathname === '/' ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"
        )}>
          <LayoutDashboard size={18} />
          <span>الرئيسية</span>
        </Link>

        <div className="pt-4 pb-2 px-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">قواعد البيانات</span>
        </div>

        {filtered.map(conn => {
          const isActive = conn.id === activeConnectionId;
          return (
            <div key={conn.id} className="space-y-1">
              <button 
                onClick={() => setActiveConnection(conn.id === activeConnectionId ? null : conn.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border-2",
                  isActive 
                    ? "bg-white border-indigo-600 shadow-md" 
                    : "bg-transparent border-transparent hover:bg-slate-50 text-slate-600"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden text-right">
                  <div className={cn("p-2 rounded-xl", isActive ? "bg-indigo-600 text-white" : "bg-slate-100")}>
                    <Database size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-sm truncate">{conn.name}</div>
                    <div className="text-[10px] text-slate-400 truncate uppercase">{conn.database}</div>
                  </div>
                </div>
                <ChevronLeft size={14} className={cn("transition-transform", isActive && "-rotate-90 text-indigo-600")} />
              </button>

              {isActive && (
                <div className="mx-2 p-1 bg-indigo-50 rounded-b-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                  <Link to={`/query/${conn.id}`} className="flex items-center gap-2 w-full p-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 rounded-xl transition-colors">
                    <Code size={14} />
                    <span>منشئ الاستعلامات</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-10 text-center px-4">
            <Box className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-xs text-slate-400">لا توجد اتصالات حالياً</p>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
        داتا-مايند v2.0 © 2024
      </div>
    </div>
  );
};