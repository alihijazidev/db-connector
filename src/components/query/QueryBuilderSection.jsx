import React from 'react';
import { cn } from '@/lib/utils';

export const QueryBuilderSection = ({
  title,
  description,
  icon,
  children,
  className,
  badge
}) => {
  return (
    <div className={cn(
      "relative p-8 rounded-[2.5rem] border-2 border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 group", 
      className
    )}>
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-lg shadow-primary/5">
          {icon}
        </div>
        <div className="flex-grow space-y-2">
          <div className="flex items-center gap-3">
            <h4 className="text-2xl font-black text-foreground tracking-tight">{title}</h4>
            {badge && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {badge}
              </span>
            )}
          </div>
          <p className="text-base text-muted-foreground font-medium leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="ps-0 md:ps-20">
        {children}
      </div>
    </div>
  );
};