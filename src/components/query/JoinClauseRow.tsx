import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Link } from 'lucide-react';
import { JoinClause, JoinType, TableMetadata } from '@/types/database';
import { cn } from '@/lib/utils';

interface JoinClauseRowProps {
  join: JoinClause;
  allTables: TableMetadata[];
  primaryTableColumns: string[];
  onChange: (join: JoinClause) => void;
  onRemove: (id: string) => void;
}

const JOIN_TYPES: JoinType[] = ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"];

export const JoinClauseRow: React.FC<JoinClauseRowProps> = ({
  join,
  allTables,
  primaryTableColumns,
  onChange,
  onRemove,
}) => {
  const handleFieldChange = (field: keyof JoinClause, value: string) => {
    onChange({ ...join, [field]: value });
  };

  const targetTableMetadata = allTables.find(t => t.name === join.targetTable);
  const targetTableColumns = targetTableMetadata?.columns.map(c => c.name) || [];

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border rounded-xl bg-background shadow-sm">
      
      {/* Join Type Selector */}
      <div className="w-32">
        <Select
          value={join.joinType}
          onValueChange={(val) => handleFieldChange('joinType', val as JoinType)}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="Join Type" />
          </SelectTrigger>
          <SelectContent>
            {JOIN_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Target Table Selector */}
      <div className="flex-1 min-w-[120px]">
        <Select
          value={join.targetTable}
          onValueChange={(val) => handleFieldChange('targetTable', val)}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="Target Table" />
          </SelectTrigger>
          <SelectContent>
            {allTables.map(table => (
              <SelectItem key={table.name} value={table.name}>{table.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-sm font-medium text-muted-foreground">ON</span>

      {/* Source Column Selector (Primary Table) */}
      <div className="flex-1 min-w-[120px]">
        <Select
          value={join.sourceColumn}
          onValueChange={(val) => handleFieldChange('sourceColumn', val)}
          disabled={primaryTableColumns.length === 0}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="Primary Column" />
          </SelectTrigger>
          <SelectContent>
            {primaryTableColumns.map(col => (
              <SelectItem key={col} value={col}>{col}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-sm font-bold text-primary">=</span>

      {/* Target Column Selector (Joined Table) */}
      <div className="flex-1 min-w-[120px]">
        <Select
          value={join.targetColumn}
          onValueChange={(val) => handleFieldChange('targetColumn', val)}
          disabled={targetTableColumns.length === 0}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="Joined Column" />
          </SelectTrigger>
          <SelectContent>
            {targetTableColumns.map(col => (
              <SelectItem key={col} value={col}>{col}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <Button 
        variant="destructive" 
        size="icon" 
        onClick={() => onRemove(join.id)}
        className="rounded-full flex-shrink-0"
        title="Remove Join"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};