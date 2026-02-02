import React from 'react';
import { cn } from '@/lib/utils';

interface QueryBuilderSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  badge?: string;
}

export const QueryBuilderSection: React.FC<QueryBuilderSectionProps> = ({
  title,
  description,
  icon,
  children,
  className,
  badge
}) => {
  return (
    <div className={cn("relative p-6 rounded-3xl border-2 border-primary/5 bg-background/40 hover:border-primary/20 transition-all duration-300", className)}>
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-black text-foreground">{title}</h4>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      <div className="ps-0 md:ps-14">
        {children}
      </div>
    </div>
  );
};