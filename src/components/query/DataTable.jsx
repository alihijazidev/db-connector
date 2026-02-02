import React from 'react';
import { Info, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

export const DataTable = ({ result, limit, offset, onPageChange }) => {
  const { columns, data, totalRows } = result;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalRows / limit);

  if (data.length === 0) {
    return (
      <div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-[2.5rem] flex items-center gap-6 text-amber-800 shadow-sm">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-black text-xl mb-1">لم يتم العثور على نتائج</h4>
          <p className="font-medium opacity-80">جرب تعديل الفلاتر أو الشروط للحصول على بيانات.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] border-2 border-indigo-50 shadow-2xl shadow-indigo-100/20 overflow-hidden">
      <div className="p-8 border-b border-indigo-50 flex justify-between items-center bg-gradient-to-l from-indigo-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-black text-2xl text-slate-800 tracking-tight">النتائج المستخرجة</h4>
        </div>
        <div className="flex items-center gap-2 bg-indigo-100/50 px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
          <span className="text-sm font-black text-indigo-700">{totalRows} سجل إجمالي</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-slate-50/50">
              {columns.map((col) => (
                <th key={col} className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-indigo-50">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                {columns.map((col) => (
                  <td key={col} className="px-8 py-5 text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                    {String(row[col] ?? 'NULL')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalRows > limit && (
        <div className="p-8 bg-slate-50/30 border-t border-indigo-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500">
              الصفحة <span className="text-indigo-600 font-black px-2 py-1 bg-white rounded-lg shadow-sm">{currentPage}</span> من {totalPages}
            </span>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => onPageChange(offset - limit)}
              disabled={currentPage === 1}
              className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-indigo-100 bg-white hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
            <button 
              onClick={() => onPageChange(offset + limit)}
              disabled={currentPage === totalPages}
              className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-indigo-100 bg-white hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};