import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, PlusCircle, Database, Type } from 'lucide-react';
import { ColumnMetadata, FilterCondition, LogicalOperator, Operator, TableMetadata } from '@/types/database';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FilterConditionRowProps {
  condition: FilterCondition;
  columns: ColumnMetadata[];
  allTables: TableMetadata[]; // Added to support subqueries
  index: number;
  totalConditions: number;
  onChange: (condition: FilterCondition) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

const OPERATORS: Operator[] = ["=", "!=", ">", "<", ">=" , "<=", "LIKE", "NOT LIKE", "IN", "NOT IN"];
const LOGICAL_OPERATORS: LogicalOperator[] = ["AND", "OR"];

export const FilterConditionRow: React.FC<FilterConditionRowProps> = ({
  condition,
  columns,
  allTables,
  index,
  totalConditions,
  onChange,
  onRemove,
  onAdd,
}) => {
  const handleFieldChange = (field: keyof FilterCondition, value: any) => {
    onChange({ ...condition, [field]: value });
  };

  const handleSubqueryChange = (field: 'tableName' | 'column', value: string) => {
    const currentSubquery = condition.subquery || { tableName: '', column: '' };
    handleFieldChange('subquery', { ...currentSubquery, [field]: value });
  };

  const availableColumns = columns.map(c => c.name);
  const subqueryTable = allTables.find(t => t.name === condition.subquery?.tableName);
  const subqueryColumns = subqueryTable?.columns.map(c => c.name) || [];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b last:border-b-0 bg-card/30 rounded-2xl hover:bg-card/50 transition-colors">
      
      {/* Logical Operator */}
      {index > 0 && (
        <div className="w-24">
          <Select
            value={condition.logicalOperator}
            onValueChange={(val) => handleFieldChange('logicalOperator', val as LogicalOperator)}
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
      {index === 0 && <span className="w-24 text-center font-black text-primary/40 text-xs tracking-widest">WHERE</span>}

      {/* Main Column */}
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

      {/* Operator */}
      <div className="w-24">
        <Select
          value={condition.operator}
          onValueChange={(val) => handleFieldChange('operator', val as Operator)}
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

      {/* Value Source Switcher */}
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

      {/* Value Input Area */}
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

      {/* Actions */}
      <div className="flex gap-2 items-center">
        {index === totalConditions - 1 && (
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
        {totalConditions > 1 && (
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
  );
};