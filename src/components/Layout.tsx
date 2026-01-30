import React, { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="p-4 border-b flex justify-between items-center bg-card shadow-sm">
          <h1 className="text-xl font-bold text-primary">DB App</h1>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 sm:max-w-xs">
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
    <div className="flex min-h-screen bg-background">
      <aside className="flex-shrink-0">
        <Sidebar isMobile={false} />
      </aside>
      <main className="flex-grow p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};