import React from 'react';
import { cn } from '@/lib/utils';

export const QueryBuilderSection = ({
  title,
  description,
  icon,
  children,
  className,
  badge,
  variant = "indigo"
}) => {
  const variants = {
    indigo: "bg-indigo-50/30 border-indigo-100",
    amber: "bg-amber-50/30 border-amber-100",
    emerald: "bg-emerald-50/30 border-emerald-100",
    blue: "bg-blue-50/30 border-blue-100",
  };

  const iconVariants = {
    indigo: "bg-indigo-600 shadow-indigo-200",
    amber: "bg-amber-500 shadow-amber-200",
    emerald: "bg-emerald-500 shadow-emerald-200",
    blue: "bg-blue-600 shadow-blue-200",
  };

  return (
    <div className={cn(
      "rounded-[2.5rem] border-2 p-8 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-50/50",
      variants[variant] || variants.indigo,
      className
    )}>
      {/* Header Layout: Horizontal Icon + Title */}
      <div className="flex items-center gap-6 mb-8">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0",
          iconVariants[variant] || iconVariants.indigo
        )}>
          {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
            {badge && (
              <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-indigo-600 text-[10px] font-black uppercase rounded-full border border-indigo-100 shadow-sm">
                {badge}
              </span>
            )}
          </div>
          <p className="text-slate-500 font-medium mt-1">{description}</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-inner">
        {children}
      </div>
    </div>
  );
};