import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { JoinClause, JoinType, TableMetadata } from '@/types/database';

interface JoinClauseRowProps {
  join: JoinClause;
  allTables: TableMetadata[];
  availableSourceTables: string[]; // Tables already included in the query (primary + previous joins)
  onChange: (join: JoinClause) => void;
  onRemove: (id: string) => void;
}

const JOIN_TYPES: { value: JoinType, label: string, description: string }[] = [
  { value: "INNER JOIN", label: "ربط داخلي (Inner Join)", description: "تضمين الصفوف التي لها تطابق في كلا الجدولين فقط." },
  { value: "LEFT JOIN", label: "ربط يساري (Left Join)", description: "تضمين كافة صفوف الجدول الأساسي، مع الصفوف المتطابقة من الجدول المنضم." },
  { value: "RIGHT JOIN", label: "ربط يميني (Right Join)", description: "تضمين كافة صفوف الجدول المنضم، مع الصفوف المتطابقة من الجدول الأساسي." },
  { value: "FULL OUTER JOIN", label: "ربط خارجي كامل (Full Join)", description: "تضمين كافة الصفوف من كلا الجدولين، مع المطابقة حيثما أمكن." },
];

export const JoinClauseRow: React.FC<JoinClauseRowProps> = ({
  join,
  allTables,
  availableSourceTables,
  onChange,
  onRemove,
}) => {
  const handleFieldChange = (field: keyof JoinClause, value: string) => {
    onChange({ ...join, [field]: value });
  };

  // Get metadata for the currently selected source and target tables
  const sourceTableMetadata = allTables.find(t => t.name === join.sourceTable);
  const targetTableMetadata = allTables.find(t => t.name === join.targetTable);
  
  const sourceTableColumns = sourceTableMetadata?.columns.map(c => c.name) || [];
  const targetTableColumns = targetTableMetadata?.columns.map(c => c.name) || [];

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border rounded-xl bg-background shadow-sm">
      
      {/* Join Type Selector */}
      <div className="w-44">
        <Select
          value={join.joinType}
          onValueChange={(val) => handleFieldChange('joinType', val as JoinType)}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="نوع الربط" />
          </SelectTrigger>
          <SelectContent>
            {JOIN_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value} title={type.description}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Target Table Selector (The table being added) */}
      <div className="flex-1 min-w-[120px]">
        <Select
          value={join.targetTable}
          onValueChange={(val) => handleFieldChange('targetTable', val)}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="الجدول الهدف" />
          </SelectTrigger>
          <SelectContent>
            {allTables.map(table => (
              <SelectItem key={table.name} value={table.name}>{table.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-sm font-medium text-muted-foreground">على</span>

      {/* Source Table Selector (The table already in the query) */}
      <div className="flex-1 min-w-[120px]">
        <Select
          value={join.sourceTable}
          onValueChange={(val) => handleFieldChange('sourceTable', val)}
          disabled={availableSourceTables.length === 0}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="الجدول المصدر" />
          </SelectTrigger>
          <SelectContent>
            {availableSourceTables.map(table => (
              <SelectItem key={table} value={table}>{table}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-sm font-bold text-primary">.</span>

      {/* Source Column Selector (Column from Source Table) */}
      <div className="flex-1 min-w-[120px]">
        <Select
          value={join.sourceColumn}
          onValueChange={(val) => handleFieldChange('sourceColumn', val)}
          disabled={sourceTableColumns.length === 0}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="العمود المصدر" />
          </SelectTrigger>
          <SelectContent>
            {sourceTableColumns.map(col => (
              <SelectItem key={col} value={col}>{col}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-sm font-bold text-primary">=</span>

      {/* Target Column Selector (Column from Joined Table) */}
      <div className="flex-1 min-w-[120px]">
        <Select
          value={join.targetColumn}
          onValueChange={(val) => handleFieldChange('targetColumn', val)}
          disabled={targetTableColumns.length === 0}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="العمود الهدف" />
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
        title="حذف العلاقة"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};