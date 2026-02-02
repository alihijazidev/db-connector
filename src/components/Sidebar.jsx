import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ConnectionForm } from './ConnectionForm';
import { useConnection } from '@/context/ConnectionContext';
import { Database, PlusCircle, ChevronLeft, Code, Search, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const SidebarItem = ({ connectionName, databaseName, connectionId, isActive, onClick }) => {
  return (
    <div className={cn(
      "flex flex-col p-3 rounded-xl transition-all duration-200 cursor-pointer border border-transparent",
      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border-sidebar-border" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
    )} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn(
            "p-2 rounded-lg",
            isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          )}>
            <Database className="w-4 h-4" />
          </div>
          <div className="flex flex-col overflow-hidden text-right">
            <span className="font-bold truncate text-sm">{connectionName}</span>
            <div className="flex items-center text-[10px] text-muted-foreground mt-0.5">
              <Box className="w-3 h-3 ms-1 flex-shrink-0" />
              <span className="truncate">{databaseName}</span>
            </div>
          </div>
        </div>
        <ChevronLeft className={cn("w-4 h-4 transition-transform flex-shrink-0", isActive && "-rotate-90")} />
      </div>
      
      {isActive && (
        <Link to={`/query/${connectionId}`} className="mt-3" onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" size="sm" className="w-full justify-start rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs py-4">
            <Code className="w-3.5 h-3.5 ms-2" /> منشئ الاستعلامات
          </Button>
        </Link>
      )}
    </div>
  );
};

export const Sidebar = ({ isMobile }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { connections, activeConnectionId, setActiveConnection } = useConnection();

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
      "flex flex-col h-full bg-sidebar p-4 transition-all duration-300 overflow-hidden border-l",
      isMobile ? "w-full" : "w-64"
    )}>
      <h2 className="text-xl font-black text-primary mb-6 flex-shrink-0 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Database className="w-5 h-5 text-white" />
        </div>
        موصل البيانات
      </h2>

      <div className="flex-shrink-0 space-y-4 mb-6">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full rounded-xl py-6 text-base font-bold bg-primary hover:bg-primary/90 transition-all shadow-md">
              <PlusCircle className="w-5 h-5 ms-2" /> اتصال جديد
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md bg-background p-0">
            <SheetHeader className="p-6 border-b text-right">
              <SheetTitle className="text-2xl font-bold text-primary">إعداد الاتصال</SheetTitle>
              <SheetDescription>
                أدخل تفاصيل الاتصال بقاعدة البيانات الجديدة الخاصة بك.
              </SheetDescription>
            </SheetHeader>
            <div className="p-6">
              <ConnectionForm onSuccess={() => setIsSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="بحث بالاسم أو قاعدة البيانات..." 
            className="rounded-xl pr-9 bg-background/50 border-sidebar-border focus:bg-background transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pb-4">
        <div className="flex items-center justify-between mb-2 sticky top-0 bg-sidebar z-10 py-1">
          <h3 className="text-[10px] font-black text-sidebar-foreground/50 uppercase tracking-widest">
            الاتصالات ({filteredConnections.length})
          </h3>
        </div>
        
        {filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-2">
            <Database className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground italic">
              {searchQuery ? "لم يتم العثور على نتائج للبحث." : "لا توجد اتصالات بعد."}
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
  );
};