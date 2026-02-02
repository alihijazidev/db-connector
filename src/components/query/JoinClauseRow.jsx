import React from 'react';
import { Group, Select, ActionIcon, Paper, Text, Box, ThemeIcon, Stack } from '@mantine/core';
import { X, ArrowRightLeft, Database, Link as LinkIcon, Table as TableIcon } from 'lucide-react';

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
  
  const sourceTableColumns = sourceTableMetadata?.columns.map(c => ({ value: c.name, label: c.name })) || [];
  const targetTableColumns = targetTableMetadata?.columns.map(c => ({ value: c.name, label: c.name })) || [];

  return (
    <Paper 
      p="lg" 
      radius="2rem" 
      withBorder 
      className="bg-white/50 hover:bg-white transition-all duration-300 border-slate-100 shadow-sm hover:shadow-md"
    >
      <Stack gap="md">
        <Group wrap="nowrap" align="flex-end" grow>
          {/* نوع الربط */}
          <Select
            label="نوع الربط"
            placeholder="اختر النوع"
            data={JOIN_TYPES}
            value={join.joinType}
            onChange={(val) => handleFieldChange('joinType', val)}
            radius="xl"
            leftSection={<LinkIcon size={16} className="text-indigo-500" />}
          />

          {/* الجدول المستهدف */}
          <Select
            label="الجدول الهدف"
            placeholder="اختر الجدول"
            data={allTables.map(t => t.name)}
            value={join.targetTable}
            onChange={(val) => handleFieldChange('targetTable', val)}
            radius="xl"
            searchable
            leftSection={<TableIcon size={16} className="text-amber-500" />}
            styles={{ input: { fontWeight: 900 } }}
          />
        </Group>

        <Box className="relative py-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-dashed border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <Paper radius="xl" px="sm" py={2} withBorder className="bg-slate-50 border-slate-100">
              <Text size="xs" fw={900} c="dimmed" tt="uppercase">شرط الربط (ON)</Text>
            </Paper>
          </div>
        </Box>

        <Group wrap="nowrap" align="flex-end" grow>
          {/* المصدر */}
          <Group gap="xs" grow wrap="nowrap">
            <Select
              label="من الجدول"
              data={availableSourceTables}
              value={join.sourceTable}
              onChange={(val) => handleFieldChange('sourceTable', val)}
              radius="xl"
              size="sm"
              disabled
            />
            <Select
              label="عمود المصدر"
              placeholder="العمود..."
              data={sourceTableColumns}
              value={join.sourceColumn}
              onChange={(val) => handleFieldChange('sourceColumn', val)}
              radius="xl"
              size="sm"
              searchable
            />
          </Group>

          <Box className="flex items-center justify-center pt-6">
            <ThemeIcon variant="light" color="indigo" radius="xl" size="md">
              <Text fw={900} size="xs">=</Text>
            </ThemeIcon>
          </Box>

          {/* الهدف */}
          <Group gap="xs" grow wrap="nowrap">
            <Select
              label="إلى الجدول"
              data={[join.targetTable || '']}
              value={join.targetTable}
              radius="xl"
              size="sm"
              disabled
            />
            <Select
              label="عمود الهدف"
              placeholder="العمود..."
              data={targetTableColumns}
              value={join.targetColumn}
              onChange={(val) => handleFieldChange('targetColumn', val)}
              radius="xl"
              size="sm"
              searchable
            />
          </Group>

          <Box className="flex items-center pt-6 shrink-0">
            <ActionIcon 
              variant="light" 
              color="red" 
              size="lg" 
              radius="xl"
              onClick={() => onRemove(join.id)}
              className="h-[36px] w-[36px]"
            >
              <X size={18} />
            </ActionIcon>
          </Box>
        </Group>
      </Stack>
    </Paper>
  );
};