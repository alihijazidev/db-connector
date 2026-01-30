import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ConnectionForm } from './ConnectionForm';
import { useConnection } from '@/context/ConnectionContext';
import { Database, PlusCircle, ChevronLeft, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isMobile: boolean;
}

const SidebarItem: React.FC<{ connectionName: string, connectionId: string, isActive: boolean, onClick: () => void }> = ({ connectionName, connectionId, isActive, onClick }) => {
  return (
    <div className={cn(
      "flex flex-col p-3 rounded-xl transition-all duration-200 cursor-pointer",
      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
    )} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Database className="w-5 h-5 ms-3 text-primary" />
          <span className="font-medium truncate">{connectionName}</span>
        </div>
        <ChevronLeft className={cn("w-4 h-4 transition-transform", isActive && "-rotate-90")} />
      </div>
      
      {isActive && (
        <Link to={`/query/${connectionId}`} className="mt-2">
          <Button variant="secondary" size="sm" className="w-full justify-start rounded-lg bg-primary text-primary-foreground hover:bg-primary/80">
            <Code className="w-4 h-4 ms-2" /> منشئ الاستعلامات
          </Button>
        </Link>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { connections, activeConnectionId, setActiveConnection } = useConnection();

  const handleConnectionClick = (id: string) => {
    setActiveConnection(id === activeConnectionId ? null : id);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-sidebar p-4 transition-all duration-300 overflow-hidden",
      isMobile ? "w-full" : "w-64"
    )}>
      <h2 className="text-2xl font-extrabold text-primary mb-6 flex-shrink-0">موصل البيانات</h2>

      <div className="flex-shrink-0">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full mb-6 rounded-xl py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all shadow-lg">
              <PlusCircle className="w-5 h-5 ms-2" /> اتصال جديد
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md bg-background p-0">
            <SheetHeader className="p-6 border-b">
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
      </div>

      <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pb-4">
        <h3 className="text-lg font-semibold text-sidebar-foreground/80 mb-3 border-b pb-2 sticky top-0 bg-sidebar z-10">الاتصالات النشطة ({connections.length})</h3>
        {connections.length === 0 ? (
          <p className="text-sm text-sidebar-foreground/60 italic">لا توجد اتصالات بعد. انقر على "اتصال جديد" للبدء.</p>
        ) : (
          connections.map((conn) => (
            <SidebarItem
              key={conn.id}
              connectionName={conn.name}
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