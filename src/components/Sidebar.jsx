import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Database, LayoutDashboard, Plus, Code, Settings, ChevronLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const { connections, activeConnectionId, setActiveConnection } = useConnection();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full p-5 bg-white shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)]">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-11 h-11 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-300">
          <Database size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-black text-slate-800 text-xl tracking-tight leading-none">داتا-مايند</h1>
          <div className="flex items-center gap-1 mt-1">
            <Sparkles size={10} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">إصدار المحترفين</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-1">
        {/* Main Nav */}
        <div className="space-y-1.5">
          <Link to="/" className={cn(
            "flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 group",
            location.pathname === '/' 
              ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
              : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
          )}>
            <LayoutDashboard size={20} />
            <span className="font-bold">لوحة التحكم</span>
          </Link>
        </div>

        {/* Connections List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">اتصالاتك النشطة</h3>
            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {connections.length}
            </span>
          </div>
          
          <div className="space-y-2">
            {connections.map(conn => {
              const isActive = activeConnectionId === conn.id;
              return (
                <div key={conn.id} className="group/item">
                  <button 
                    onClick={() => setActiveConnection(conn.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-300",
                      isActive 
                        ? "bg-white border-indigo-600 shadow-lg scale-[1.02]" 
                        : "border-transparent bg-slate-50/50 text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                        isActive ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400"
                      )}>
                        <Database size={16} />
                      </div>
                      <span className="truncate text-sm font-bold">{conn.name}</span>
                    </div>
                    <ChevronLeft size={14} className={cn("transition-transform duration-300", isActive && "-rotate-90 text-indigo-600")} />
                  </button>
                  
                  {isActive && (
                    <div className="mt-2 mr-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                      <Link 
                        to={`/query/${conn.id}`} 
                        className="flex items-center gap-2 p-2.5 text-xs font-black text-indigo-600 bg-indigo-50/50 rounded-xl hover:bg-indigo-50 transition-colors"
                      >
                        <Code size={14} />
                        <span>منشئ الاستعلامات</span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-slate-100 space-y-3">
        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl font-black shadow-xl shadow-slate-200 transition-all active:scale-95 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>إضافة اتصال</span>
        </button>
        <button className="w-full flex items-center justify-center gap-2 p-3 text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold">
          <Settings size={18} />
          <span>الإعدادات</span>
        </button>
      </div>
    </div>
  );
};