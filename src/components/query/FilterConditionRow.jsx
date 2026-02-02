import React from 'react';
import { Group, Select, TextInput, ActionIcon, Paper, Text, Stack, ThemeIcon, Tooltip, SegmentedControl } from '@mantine/core';
import { X, Plus, Type, Database, Layers, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPERATORS = [
  { value: "=", label: "=" },
  { value: "!=", label: "≠" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: ">=", label: "≥" },
  { value: "<=", label: "≤" },
  { value: "LIKE", label: "يشبه (LIKE)" },
  { value: "IN", label: "موجود في (IN)" },
];

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

  const subqueryTable = allTables.find(t => t.name === condition.subquery?.tableName);
  const subqueryColumns = subqueryTable?.columns.map(c => c.name) || [];

  return (
    <Paper 
      p="md" 
      radius="xl" 
      withBorder 
      className={cn(
        "transition-all duration-300",
        isSubqueryFilter ? "bg-indigo-50/30 border-dashed border-indigo-200" : "bg-white shadow-sm hover:shadow-md"
      )}
    >
      <Stack gap="md">
        <Group wrap="nowrap" align="flex-end" gap="sm">
          {/* Logical Operator (AND/OR) */}
          {index > 0 && (
            <Select
              w={100}
              radius="lg"
              data={[{ value: 'AND', label: 'وـ (AND)' }, { value: 'OR', label: 'أو (OR)' }]}
              value={condition.logicalOperator}
              onChange={(val) => handleFieldChange('logicalOperator', val)}
              styles={{ input: { fontWeight: 900, color: 'var(--mantine-color-indigo-6)' } }}
            />
          )}

          {index === 0 && (
            <Box w={index > 0 ? 0 : 40} className="flex items-center justify-center">
              <ThemeIcon variant="light" color="indigo" radius="md">
                <Filter size={16} />
              </ThemeIcon>
            </Box>
          )}

          {/* Column Selector */}
          <Select
            label={index === 0 ? "العمود" : null}
            placeholder="اختر العمود"
            className="flex-1"
            radius="lg"
            data={columns.map(col => ({ value: col.name, label: col.name }))}
            value={condition.column}
            onChange={(val) => handleFieldChange('column', val)}
            searchable
          />

          {/* Operator Selector */}
          <Select
            label={index === 0 ? "العملية" : null}
            w={120}
            radius="lg"
            data={OPERATORS}
            value={condition.operator}
            onChange={(val) => handleFieldChange('operator', val)}
          />

          {/* Value Type Toggle (Literal vs Subquery) */}
          {!isSubqueryFilter && (
            <Stack gap={2}>
              {index === 0 && <Text size="xs" fw={700} c="dimmed">نوع القيمة</Text>}
              <SegmentedControl
                radius="lg"
                size="sm"
                value={condition.valueType || 'literal'}
                onChange={(val) => handleFieldChange('valueType', val)}
                data={[
                  { label: <Tooltip label="قيمة نصية"><Type size={14} /></Tooltip>, value: 'literal' },
                  { label: <Tooltip label="استعلام فرعي"><Database size={14} /></Tooltip>, value: 'subquery' },
                ]}
              />
            </Stack>
          )}

          {/* Value Input or Subquery Selectors */}
          <Box className="flex-grow">
            {condition.valueType === 'literal' ? (
              <TextInput
                label={index === 0 ? "القيمة" : null}
                placeholder="أدخل القيمة هنا..."
                radius="lg"
                value={condition.value}
                onChange={(e) => handleFieldChange('value', e.currentTarget.value)}
              />
            ) : (
              <Group gap="xs" grow align="flex-end">
                <Select
                  label={index === 0 ? "جدول المصدر" : null}
                  placeholder="اختر جدول"
                  radius="lg"
                  data={allTables.map(t => t.name)}
                  value={condition.subquery?.tableName}
                  onChange={(val) => handleFieldChange('subquery', { ...condition.subquery, tableName: val })}
                />
                <Select
                  label={index === 0 ? "عمود المصدر" : null}
                  placeholder="اختر عمود"
                  radius="lg"
                  data={subqueryColumns}
                  value={condition.subquery?.column}
                  onChange={(val) => handleFieldChange('subquery', { ...condition.subquery, column: val })}
                  disabled={!condition.subquery?.tableName}
                />
              </Group>
            )}
          </Box>

          {/* Action Buttons */}
          <Group gap={4} align="flex-end">
            {index === totalConditions - 1 && onAdd && (
              <ActionIcon 
                variant="light" 
                color="indigo" 
                size="lg" 
                radius="xl"
                onClick={onAdd}
              >
                <Plus size={18} />
              </ActionIcon>
            )}
            <ActionIcon 
              variant="light" 
              color="red" 
              size="lg" 
              radius="xl"
              onClick={() => onRemove(condition.id)}
            >
              <X size={18} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Subquery Helper Info */}
        {condition.valueType === 'subquery' && condition.subquery?.tableName && (
          <Paper p="xs" radius="md" withBorder bg="indigo.0" className="border-indigo-100">
            <Group gap="xs">
              <Layers size={14} className="text-indigo-500" />
              <Text size="xs" fw={700} c="indigo">
                سيتم مطابقة البيانات مع نتائج الاستعلام من جدول <span className="underline">{condition.subquery.tableName}</span>
              </Text>
            </Group>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
};

// Helper components for Mantine context
import { Box, Filter } from '@mantine/core';