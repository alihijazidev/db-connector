import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, Database, X } from 'lucide-react';

export const Layout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden" dir="rtl">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-e border-slate-200">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl">
            <div className="p-4 flex justify-end">
              <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Database size={18} />
            </div>
            <span className="font-bold">موصل البيانات</span>
          </div>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};