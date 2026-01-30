import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, PlusCircle } from 'lucide-react';
import { ColumnMetadata, FilterCondition, LogicalOperator, Operator } from '@/types/database';
import { cn } from '@/lib/utils';

interface FilterConditionRowProps {
  condition: FilterCondition;
  columns: ColumnMetadata[];
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
  index,
  totalConditions,
  onChange,
  onRemove,
  onAdd,
}) => {
  const handleFieldChange = (field: keyof FilterCondition, value: string) => {
    onChange({ ...condition, [field]: value });
  };

  const availableColumns = columns.map(c => c.name);

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border-b last:border-b-0 bg-card/50 rounded-lg">
      
      {/* Logical Operator (AND/OR) */}
      {index > 0 && (
        <div className="w-20">
          <Select
            value={condition.logicalOperator}
            onValueChange={(val) => handleFieldChange('logicalOperator', val as LogicalOperator)}
          >
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOGICAL_OPERATORS.map(op => (
                <SelectItem key={op} value={op}>{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {index === 0 && <span className={cn("w-20 text-center font-semibold text-primary/80", index > 0 ? "hidden" : "block")}>WHERE</span>}

      {/* Column Selector */}
      <div className="flex-1 min-w-[120px]">
        <Select
          value={condition.column}
          onValueChange={(val) => handleFieldChange('column', val)}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="Select Column" />
          </SelectTrigger>
          <SelectContent>
            {availableColumns.map(col => (
              <SelectItem key={col} value={col}>{col}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Operator Selector */}
      <div className="w-24">
        <Select
          value={condition.operator}
          onValueChange={(val) => handleFieldChange('operator', val as Operator)}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OPERATORS.map(op => (
              <SelectItem key={op} value={op}>{op}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Value Input */}
      <div className="flex-1 min-w-[150px]">
        <Input
          placeholder="Value"
          value={condition.value}
          onChange={(e) => handleFieldChange('value', e.target.value)}
          className="rounded-lg"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {index === totalConditions - 1 && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onAdd}
            className="rounded-full text-primary hover:bg-primary/10 border-primary/50"
            title="Add Condition"
          >
            <PlusCircle className="w-4 h-4" />
          </Button>
        )}
        {totalConditions > 1 && (
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={() => onRemove(condition.id)}
            className="rounded-full"
            title="Remove Condition"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};