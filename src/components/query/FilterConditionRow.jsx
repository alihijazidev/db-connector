import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, PlusCircle, Database, Type, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const OPERATORS = ["=", "!=", ">", "<", ">=" , "<=", "LIKE", "NOT LIKE", "IN", "NOT IN"];
const LOGICAL_OPERATORS = ["AND", "OR"];

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

  const handleSubqueryChange = (field, value) => {
    const currentSubquery = condition.subquery || { tableName: '', column: '', filters: [] };
    handleFieldChange('subquery', { ...currentSubquery, [field]: value });
  };

  const addSubqueryFilter = () => {
    const currentFilters = condition.subquery?.filters || [];
    handleSubqueryChange('filters', [
      ...currentFilters,
      { id: crypto.randomUUID(), column: '', operator: '=', value: '', valueType: 'literal', logicalOperator: 'AND' }
    ]);
  };

  const updateSubqueryFilter = (updatedFilter) => {
    const currentFilters = condition.subquery?.filters || [];
    handleSubqueryChange('filters', currentFilters.map(f => f.id === updatedFilter.id ? updatedFilter : f));
  };

  const removeSubqueryFilter = (filterId) => {
    const currentFilters = condition.subquery?.filters || [];
    handleSubqueryChange('filters', currentFilters.filter(f => f.id !== filterId));
  };

  const availableColumns = columns.map(c => c.name);
  const subqueryTable = allTables.find(t => t.name === condition.subquery?.tableName);
  const subqueryColumns = subqueryTable?.columns.map(c => c.name) || [];

  return (
    <div className={cn(
      "flex flex-col gap-3 p-4 border-b last:border-b-0 transition-colors",
      isSubqueryFilter ? "bg-primary/5 rounded-xl border-2 border-primary/10" : "bg-card/30 rounded-2xl hover:bg-card/50"
    )}>
      <div className="flex flex-wrap items-center gap-3">
        {index > 0 && (
          <div className="w-24">
            <Select
              value={condition.logicalOperator}
              onValueChange={(val) => handleFieldChange('logicalOperator', val)}
            >
              <SelectTrigger className="w-full rounded-xl border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOGICAL_OPERATORS.map(op => (
                  <SelectItem key={op} value={op}>{op === 'AND' ? 'وـ (AND)' : 'أو (OR)'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {index === 0 && <span className="w-24 text-center font-black text-primary/40 text-xs tracking-widest">{isSubqueryFilter ? "WHERE (Inner)" : "WHERE"}</span>}

        <div className="flex-1 min-w-[140px]">
          <Select
            value={condition.column}
            onValueChange={(val) => handleFieldChange('column', val)}
          >
            <SelectTrigger className="w-full rounded-xl border-2 bg-background">
              <SelectValue placeholder="اختر العمود" />
            </SelectTrigger>
            <SelectContent>
              {availableColumns.map(col => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-24">
          <Select
            value={condition.operator}
            onValueChange={(val) => handleFieldChange('operator', val)}
          >
            <SelectTrigger className="w-full rounded-xl border-2 bg-background font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPERATORS.map(op => (
                <SelectItem key={op} value={op} className="font-mono">{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isSubqueryFilter && (
          <div className="flex flex-col gap-1">
            <ToggleGroup 
              type="single" 
              value={condition.valueType} 
              onValueChange={(val) => val && handleFieldChange('valueType', val)}
              className="bg-secondary/50 p-1 rounded-lg"
            >
              <ToggleGroupItem value="literal" className="h-8 w-8 p-0 rounded-md" title="قيمة يدوية">
                <Type className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="subquery" className="h-8 w-8 p-0 rounded-md" title="من جدول آخر">
                <Database className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}

        <div className="flex-grow min-w-[200px] flex gap-2">
          {condition.valueType === 'literal' ? (
            <Input
              placeholder="أدخل القيمة..."
              value={condition.value}
              onChange={(e) => handleFieldChange('value', e.target.value)}
              className="rounded-xl border-2 bg-background h-10"
            />
          ) : (
            <div className="flex gap-2 w-full">
              <Select
                value={condition.subquery?.tableName}
                onValueChange={(val) => handleSubqueryChange('tableName', val)}
              >
                <SelectTrigger className="flex-1 rounded-xl border-2 bg-primary/5 h-10">
                  <SelectValue placeholder="اختر الجدول" />
                </SelectTrigger>
                <SelectContent>
                  {allTables.map(t => (
                    <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={condition.subquery?.column}
                onValueChange={(val) => handleSubqueryChange('column', val)}
                disabled={!condition.subquery?.tableName}
              >
                <SelectTrigger className="flex-1 rounded-xl border-2 bg-primary/5 h-10">
                  <SelectValue placeholder="العمود" />
                </SelectTrigger>
                <SelectContent>
                  {subqueryColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          {index === totalConditions - 1 && onAdd && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAdd}
              className="rounded-full text-primary hover:bg-primary/10 h-10 w-10"
              title="إضافة شرط"
            >
              <PlusCircle className="w-5 h-5" />
            </Button>
          )}
          {(totalConditions > 1 || isSubqueryFilter) && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemove(condition.id)}
              className="rounded-full text-destructive hover:bg-destructive/10 h-10 w-10"
              title="حذف الشرط"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {condition.valueType === 'subquery' && condition.subquery?.tableName && (
        <div className="mt-2 ms-12 p-4 border-l-4 border-primary/20 bg-primary/5 rounded-r-2xl space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
              <ListFilter className="w-3 h-3" /> شروط الاستعلام الفرعي ({condition.subquery.tableName})
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addSubqueryFilter}
              className="h-7 text-[10px] font-bold rounded-lg border-primary/30 hover:bg-primary/10"
            >
              <PlusCircle className="w-3 h-3 ms-1" /> إضافة شرط داخلي
            </Button>
          </div>
          
          <div className="space-y-2">
            {condition.subquery.filters.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic">لا توجد شروط داخلية.</p>
            ) : (
              condition.subquery.filters.map((f, i) => (
                <FilterConditionRow
                  key={f.id}
                  condition={f}
                  columns={subqueryTable?.columns || []}
                  allTables={allTables}
                  index={i}
                  totalConditions={condition.subquery?.filters.length || 0}
                  onChange={updateSubqueryFilter}
                  onRemove={() => removeSubqueryFilter(f.id)}
                  onAdd={addSubqueryFilter}
                  isSubqueryFilter={true}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};