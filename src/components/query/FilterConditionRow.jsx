import React from 'react';
import { Group, Select, TextInput, ActionIcon, Paper, Text, Stack, ThemeIcon, Box } from '@mantine/core';
import { X, Plus, Filter, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPERATORS = [
  { value: "=", label: "يساوي (=)" },
  { value: "!=", label: "لا يساوي (≠)" },
  { value: ">", label: "أكبر من (>)" },
  { value: "<", label: "أصغر من (<)" },
  { value: ">=", label: "أكبر أو يساوي (≥)" },
  { value: "<=", label: "أصغر أو يساوي (≤)" },
  { value: "LIKE", label: "يحتوي على (LIKE)" },
  { value: "IN", label: "واحد من (IN)" },
];

export const FilterConditionRow = ({
  condition,
  columns,
  index,
  totalConditions,
  onChange,
  onRemove,
  onAdd,
}) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...condition, [field]: value });
  };

  return (
    <Paper 
      p="md" 
      radius="2rem" 
      withBorder 
      className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border-slate-100"
    >
      <Group wrap="nowrap" align="flex-end" gap="md">
        {/* Logical Operator (AND/OR) */}
        <Box w={110}>
          {index > 0 ? (
            <Select
              label="الرابط"
              radius="xl"
              data={[{ value: 'AND', label: 'وـ (AND)' }, { value: 'OR', label: 'أو (OR)' }]}
              value={condition.logicalOperator}
              onChange={(val) => handleFieldChange('logicalOperator', val)}
              styles={{ input: { fontWeight: 900, color: 'var(--mantine-color-indigo-6)' } }}
            />
          ) : (
            <Stack gap={4}>
              <Text size="xs" fw={700} c="dimmed">النوع</Text>
              <ThemeIcon variant="light" color="indigo" radius="xl" size="lg" className="h-[42px] w-full">
                <Filter size={18} />
              </ThemeIcon>
            </Stack>
          )}
        </Box>

        {/* Column Selector */}
        <Select
          label="العمود المستهدف"
          placeholder="اختر العمود..."
          className="flex-1"
          radius="xl"
          size="md"
          data={columns.map(col => ({ value: col.name, label: col.name }))}
          value={condition.column}
          onChange={(val) => handleFieldChange('column', val)}
          searchable
          leftSection={<ArrowRight size={16} className="text-slate-400" />}
        />

        {/* Operator Selector */}
        <Select
          label="الشرط"
          w={160}
          radius="xl"
          size="md"
          data={OPERATORS}
          value={condition.operator}
          onChange={(val) => handleFieldChange('operator', val)}
        />

        {/* Value Input */}
        <TextInput
          label="القيمة المطلوبة"
          placeholder={condition.operator === 'IN' ? "مثال: 1, 2, 3" : "أدخل القيمة..."}
          className="flex-[1.5]"
          radius="xl"
          size="md"
          value={condition.value}
          onChange={(e) => handleFieldChange('value', e.currentTarget.value)}
        />

        {/* Action Buttons */}
        <Group gap={8} align="flex-end">
          {index === totalConditions - 1 && (
            <ActionIcon 
              variant="filled" 
              color="indigo" 
              size="lg" 
              radius="xl"
              onClick={onAdd}
              className="h-[42px] w-[42px]"
              title="إضافة شرط"
            >
              <Plus size={20} />
            </ActionIcon>
          )}
          <ActionIcon 
            variant="light" 
            color="red" 
            size="lg" 
            radius="xl"
            onClick={() => onRemove(condition.id)}
            className="h-[42px] w-[42px]"
            title="حذف"
          >
            <X size={20} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
};