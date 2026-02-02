import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const Layout = ({ children }) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background font-sans" dir="rtl">
        <header className="px-6 py-4 border-b flex justify-between items-center bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2 text-primary font-black">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg tracking-tight">موصل البيانات</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-72 sm:max-w-xs border-s-0">
              <Sidebar isMobile={true} />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-grow overflow-y-auto bg-slate-50/50">
          <div className="container mx-auto p-6 pb-24">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans" dir="rtl">
      <aside className="flex-shrink-0 h-full border-e border-border/50 shadow-xl shadow-black/5 z-40 bg-card">
        <Sidebar isMobile={false} />
      </aside>
      <main className="flex-grow overflow-y-auto h-full bg-slate-50/50 relative">
        <div className="container max-w-7xl mx-auto p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};