import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Database, X } from 'lucide-react';

export const Layout = ({ children }) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden" dir="rtl">
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <aside className="w-72 h-full bg-white border-e border-slate-200 shadow-sm z-30 flex-shrink-0">
          <Sidebar />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="absolute left-[-40px] top-4">
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white rounded-full shadow-lg text-slate-500">
                <X size={20} />
              </button>
            </div>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header for Mobile */}
        {isMobile && (
          <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
                <Database size={18} />
              </div>
              <span className="font-bold text-lg">موصل البيانات</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu size={24} className="text-slate-600" />
            </button>
          </header>
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto p-4 md:p-10 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};