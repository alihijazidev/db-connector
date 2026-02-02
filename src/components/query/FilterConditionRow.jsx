import React from 'react';
import { X, Plus, Type, Database, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPERATORS = ["=", "!=", ">", "<", ">=" , "<=", "LIKE", "NOT LIKE", "IN", "NOT IN"];

export const FilterConditionRow = ({
  condition,
  columns,
  allTables,
  index,
  totalConditions,
  onChange,
  onRemove,
  onAdd,
  isSubqueryFilter = false,
}) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...condition, [field]: value });
  };

  const selectClass = "bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none cursor-pointer";
  const inputClass = "bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none";

  const subqueryTable = allTables.find(t => t.name === condition.subquery?.tableName);
  const subqueryColumns = subqueryTable?.columns.map(c => c.name) || [];

  return (
    <div className={cn(
      "flex flex-col gap-4 p-5 transition-all duration-300",
      isSubqueryFilter ? "bg-indigo-50/50 rounded-2xl border-2 border-indigo-100/50" : "bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md"
    )}>
      <div className="flex flex-wrap items-center gap-3">
        {/* المنطق (AND/OR) */}
        {index > 0 && (
          <select
            className={cn(selectClass, "w-24 font-bold text-indigo-600 bg-indigo-50 border-indigo-100")}
            value={condition.logicalOperator}
            onChange={(e) => handleFieldChange('logicalOperator', e.target.value)}
          >
            <option value="AND">وـ (AND)</option>
            <option value="OR">أو (OR)</option>
          </select>
        )}
        
        {index === 0 && (
          <div className="w-24 flex items-center justify-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              {isSubqueryFilter ? "فلتر داخلي" : "تصفية بـ"}
            </span>
          </div>
        )}

        {/* اختيار العمود */}
        <div className="flex-1 min-w-[150px]">
          <select
            className={cn(selectClass, "w-full font-medium")}
            value={condition.column}
            onChange={(e) => handleFieldChange('column', e.target.value)}
          >
            <option value="">اختر العمود...</option>
            {columns.map(col => (
              <option key={col.name} value={col.name}>{col.name}</option>
            ))}
          </select>
        </div>

        {/* العملية */}
        <div className="w-24">
          <select
            className={cn(selectClass, "w-full font-mono font-bold text-center")}
            value={condition.operator}
            onChange={(e) => handleFieldChange('operator', e.target.value)}
          >
            {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
          </select>
        </div>

        {/* نوع القيمة */}
        {!isSubqueryFilter && (
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => handleFieldChange('valueType', 'literal')}
              className={cn("p-1.5 rounded-lg transition-all", condition.valueType === 'literal' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400")}
              title="قيمة نصية"
            >
              <Type size={16} />
            </button>
            <button 
              onClick={() => handleFieldChange('valueType', 'subquery')}
              className={cn("p-1.5 rounded-lg transition-all", condition.valueType === 'subquery' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400")}
              title="استعلام فرعي"
            >
              <Database size={16} />
            </button>
          </div>
        )}

        {/* إدخال القيمة */}
        <div className="flex-grow min-w-[200px]">
          {condition.valueType === 'literal' ? (
            <input
              type="text"
              placeholder="القيمة المطلوبة..."
              className={cn(inputClass, "w-full")}
              value={condition.value}
              onChange={(e) => handleFieldChange('value', e.target.value)}
            />
          ) : (
            <div className="flex gap-2">
              <select 
                className={cn(selectClass, "flex-1 bg-indigo-50/50")}
                value={condition.subquery?.tableName}
                onChange={(e) => handleFieldChange('subquery', { ...condition.subquery, tableName: e.target.value })}
              >
                <option value="">الجدول...</option>
                {allTables.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
              <select 
                className={cn(selectClass, "flex-1 bg-indigo-50/50")}
                value={condition.subquery?.column}
                onChange={(e) => handleFieldChange('subquery', { ...condition.subquery, column: e.target.value })}
                disabled={!condition.subquery?.tableName}
              >
                <option value="">العمود...</option>
                {subqueryColumns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-1">
          {index === totalConditions - 1 && onAdd && (
            <button onClick={onAdd} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
              <Plus size={20} />
            </button>
          )}
          <button onClick={() => onRemove(condition.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* عرض الاستعلام الفرعي إذا تم اختياره */}
      {condition.valueType === 'subquery' && condition.subquery?.tableName && (
        <div className="ms-10 p-4 border-r-4 border-indigo-200 bg-indigo-50/30 rounded-l-2xl flex items-center gap-3">
          <Layers className="text-indigo-400" size={16} />
          <span className="text-xs font-bold text-indigo-700">
            سيتم البحث في <span className="underline">{condition.subquery.tableName}</span> بناءً على عمود <span className="underline">{condition.subquery.column}</span>
          </span>
        </div>
      )}
    </div>
  );
};