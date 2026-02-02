import React from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const JOIN_TYPES = [
  { value: "INNER JOIN", label: "ربط داخلي (Inner)" },
  { value: "LEFT JOIN", label: "ربط يساري (Left)" },
  { value: "RIGHT JOIN", label: "ربط يميني (Right)" },
  { value: "FULL OUTER JOIN", label: "ربط كامل (Full)" },
];

export const JoinClauseRow = ({
  join,
  allTables,
  availableSourceTables,
  onChange,
  onRemove,
}) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...join, [field]: value });
  };

  const sourceTableMetadata = allTables.find(t => t.name === join.sourceTable);
  const targetTableMetadata = allTables.find(t => t.name === join.targetTable);
  
  const sourceTableColumns = sourceTableMetadata?.columns.map(c => c.name) || [];
  const targetTableColumns = targetTableMetadata?.columns.map(c => c.name) || [];

  const selectClass = "w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer";

  return (
    <div className="group relative flex flex-wrap items-center gap-3 p-5 bg-slate-50/50 hover:bg-white border border-slate-200 hover:border-indigo-200 rounded-[1.5rem] transition-all duration-300">
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRightLeft size={12} />
      </div>

      {/* نوع الربط */}
      <div className="min-w-[140px]">
        <select 
          className={selectClass}
          value={join.joinType}
          onChange={(e) => handleFieldChange('joinType', e.target.value)}
        >
          {JOIN_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* الجدول الهدف */}
      <div className="flex-1 min-w-[120px]">
        <select 
          className={cn(selectClass, "font-bold text-indigo-700")}
          value={join.targetTable}
          onChange={(e) => handleFieldChange('targetTable', e.target.value)}
        >
          <option value="">اختر الجدول...</option>
          {allTables.map(table => (
            <option key={table.name} value={table.name}>{table.name}</option>
          ))}
        </select>
      </div>

      <span className="text-xs font-black text-slate-400 uppercase">على</span>

      {/* الجدول والعمود المصدر */}
      <div className="flex flex-1 gap-1 min-w-[200px]">
        <select 
          className={cn(selectClass, "w-1/2")}
          value={join.sourceTable}
          onChange={(e) => handleFieldChange('sourceTable', e.target.value)}
        >
          {availableSourceTables.map(table => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
        <select 
          className={cn(selectClass, "w-1/2")}
          value={join.sourceColumn}
          onChange={(e) => handleFieldChange('sourceColumn', e.target.value)}
          disabled={sourceTableColumns.length === 0}
        >
          <option value="">العمود...</option>
          {sourceTableColumns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>

      <span className="text-indigo-600 font-bold">=</span>

      {/* العمود الهدف */}
      <div className="flex-1 min-w-[120px]">
        <select 
          className={selectClass}
          value={join.targetColumn}
          onChange={(e) => handleFieldChange('targetColumn', e.target.value)}
          disabled={targetTableColumns.length === 0}
        >
          <option value="">عمود الهدف...</option>
          {targetTableColumns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>

      <button 
        onClick={() => onRemove(join.id)}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        title="حذف العلاقة"
      >
        <X size={18} />
      </button>
    </div>
  );
};