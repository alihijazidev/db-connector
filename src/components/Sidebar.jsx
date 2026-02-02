import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Database, LayoutDashboard, Plus, Code, Box } from 'lucide-react';

export const Sidebar = () => {
  const { connections, activeConnectionId, setActiveConnection } = useConnection();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <Database size={22} />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 leading-tight">داتا-مايند</h1>
          <p className="text-[10px] text-indigo-500 font-bold uppercase">الجيل القادم</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6">
        <div>
          <Link to="/" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname === '/' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutDashboard size={18} />
            <span>الرئيسية</span>
          </Link>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">اتصالاتك</h3>
          <div className="space-y-2">
            {connections.map(conn => (
              <div key={conn.id} className="space-y-1">
                <button 
                  onClick={() => setActiveConnection(conn.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${activeConnectionId === conn.id ? 'bg-white border-indigo-200 shadow-sm text-indigo-600' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Database size={16} className={activeConnectionId === conn.id ? 'text-indigo-600' : 'text-slate-400'} />
                    <span className="truncate text-sm font-medium">{conn.name}</span>
                  </div>
                </button>
                {activeConnectionId === conn.id && (
                  <Link to={`/query/${conn.id}`} className="flex items-center gap-2 mx-2 p-2.5 text-xs font-bold text-indigo-500 bg-indigo-50/50 rounded-lg hover:bg-indigo-50 transition-colors">
                    <Code size={14} />
                    <span>منشئ الاستعلامات</span>
                  </Link>
                )}
              </div>
            ))}
            {connections.length === 0 && (
              <div className="text-center py-6">
                <Box size={24} className="mx-auto text-slate-200 mb-2" />
                <p className="text-xs text-slate-400">لا يوجد اتصالات</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-6 border-t border-slate-100">
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all">
          <Plus size={18} />
          <span>اتصال جديد</span>
        </button>
      </div>
    </div>
  );
};