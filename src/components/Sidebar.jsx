import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ConnectionForm } from './ConnectionForm';
import { useConnection } from '@/context/ConnectionContext';
import { Database, PlusCircle, ChevronLeft, Code, Search, Box, Settings2, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const SidebarItem = ({ connectionName, databaseName, connectionId, isActive, onClick }) => {
  return (
    <div 
      className={cn(
        "group flex flex-col p-4 rounded-2xl transition-all duration-300 cursor-pointer border-2 mb-2",
        isActive 
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]" 
          : "bg-background border-transparent hover:border-primary/20 hover:bg-primary/5 text-foreground"
      )} 
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn(
            "p-2.5 rounded-xl transition-colors duration-300",
            isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
          )}>
            <Database className="w-5 h-5" />
          </div>
          <div className="flex flex-col overflow-hidden text-right">
            <span className="font-bold truncate text-sm leading-tight">{connectionName}</span>
            <div className={cn(
              "flex items-center text-[10px] mt-1 font-medium",
              isActive ? "text-white/80" : "text-muted-foreground"
            )}>
              <Box className="w-3 h-3 ms-1 flex-shrink-0" />
              <span className="truncate">{databaseName}</span>
            </div>
          </div>
        </div>
        <ChevronLeft className={cn(
          "w-4 h-4 transition-transform duration-300", 
          isActive ? "-rotate-90 text-white" : "text-muted-foreground group-hover:text-primary"
        )} />
      </div>
      
      {isActive && (
        <div className="mt-4 pt-4 border-t border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <Link to={`/query/${connectionId}`} className="block" onClick={(e) => e.stopPropagation()}>
            <Button variant="secondary" size="sm" className="w-full justify-center rounded-xl bg-white text-primary hover:bg-white/90 font-bold text-xs py-5">
              <Code className="w-4 h-4 ms-2" /> فتح منشئ الاستعلامات
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ isMobile }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { connections, activeConnectionId, setActiveConnection } = useConnection();
  const location = useLocation();

  const handleConnectionClick = (id) => {
    setActiveConnection(id === activeConnectionId ? null : id);
  };

  const filteredConnections = useMemo(() => {
    return connections.filter(conn => 
      conn.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      conn.database.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [connections, searchQuery]);

  return (
    <div className={cn(
      "flex flex-col h-full bg-card p-6 transition-all duration-300 overflow-hidden",
      isMobile ? "w-full" : "w-80"
    )}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <Database className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight leading-none">موصل البيانات</h2>
          <p className="text-[10px] text-muted-foreground font-bold mt-1 opacity-60 uppercase tracking-widest">الإصدار الذكي 2.0</p>
        </div>
      </div>

      <div className="flex-shrink-0 space-y-4 mb-8">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full rounded-2xl py-7 text-base font-black bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95">
              <PlusCircle className="w-5 h-5 ms-2" /> اتصال جديد
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md bg-background p-0 border-s-0">
            <SheetHeader className="p-8 border-b text-right bg-primary/5">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4">
                <Settings2 className="w-7 h-7 text-white" />
              </div>
              <SheetTitle className="text-3xl font-black text-primary">إعداد الاتصال</SheetTitle>
              <SheetDescription className="text-base text-muted-foreground font-medium">
                أدخل تفاصيل الاتصال بقاعدة البيانات الخاصة بك للبدء في تحليل البيانات.
              </SheetDescription>
            </SheetHeader>
            <div className="p-8">
              <ConnectionForm onSuccess={() => setIsSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="بحث في القواعد..." 
            className="rounded-2xl pr-10 py-6 bg-background/50 border-border/50 focus:border-primary/30 focus:bg-background transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 px-2 flex-shrink-0">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <History className="w-3 h-3" /> الاتصالات النشطة ({filteredConnections.length})
          </h3>
        </div>
        
        <div className="flex-grow overflow-y-auto custom-scrollbar px-1 pb-6 space-y-1">
          {filteredConnections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-border/50 px-4">
              <Database className="w-10 h-10 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground font-medium italic">
                {searchQuery ? "لا توجد نتائج للبحث." : "ابدأ بإضافة أول اتصال لك."}
              </p>
            </div>
          ) : (
            filteredConnections.map((conn) => (
              <SidebarItem
                key={conn.id}
                connectionName={conn.name}
                databaseName={conn.database}
                connectionId={conn.id}
                isActive={conn.id === activeConnectionId}
                onClick={() => handleConnectionClick(conn.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};