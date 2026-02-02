import React from 'react';
import { Info, ChevronRight, ChevronLeft } from 'lucide-react';

export const DataTable = ({ result, limit, offset, onPageChange }) => {
  const { columns, data, totalRows } = result;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalRows / limit);

  if (data.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-center gap-4 text-amber-800">
        <Info className="flex-shrink-0" />
        <div>
          <h4 className="font-bold">لا توجد نتائج</h4>
          <p className="text-sm opacity-80">الاستعلام لم يرجع أي بيانات حالياً.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h4 className="font-black text-slate-800">نتائج الاستعلام</h4>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
          {totalRows} إجمالي الصفوف
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {columns.map((col) => (
                <th key={col} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                {columns.map((col) => (
                  <td key={col} className="px-6 py-4 text-sm font-medium text-slate-600">
                    {String(row[col] ?? 'NULL')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalRows > limit && (
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium">
            عرض صفحة <span className="text-indigo-600 font-bold">{currentPage}</span> من <span className="text-slate-800 font-bold">{totalPages}</span>
          </p>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onPageChange(offset - limit)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => onPageChange(offset + limit)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};