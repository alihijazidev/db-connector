import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const Layout = ({ children }) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <header className="p-4 border-b flex justify-between items-center bg-card shadow-sm flex-shrink-0">
          <h1 className="text-xl font-bold text-primary">تطبيق قواعد البيانات</h1>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-64 sm:max-w-xs">
              <Sidebar isMobile={true} />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-grow p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="flex-shrink-0 h-full border-e border-sidebar-border overflow-hidden">
        <Sidebar isMobile={false} />
      </aside>
      <main className="flex-grow p-8 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
};