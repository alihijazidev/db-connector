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
      "bg-white rounded-[2rem] border border-slate-200 p-6 md:p-10 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow", 
      className
    )}>
      {/* Decorative background element */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
            {icon}
          </div>
        </div>
        
        <div className="flex-grow space-y-2">
          <div className="flex items-center flex-wrap gap-3">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
            {badge && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-200">
                {badge}
              </span>
            )}
          </div>
          <p className="text-slate-500 font-medium text-base leading-relaxed max-w-2xl">{description}</p>
          
          <div className="pt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};