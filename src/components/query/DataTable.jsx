import React from 'react';
import { Table, Paper, Group, Text, ThemeIcon, Badge, Stack, ActionIcon, Pagination, ScrollArea } from '@mantine/core';
import { Info, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

/**
 * A responsive data table component using Mantine UI.
 * Displays query results with pagination support.
 * 
 * @param {Object} result - { columns: string[], data: Object[], totalRows: number }
 * @param {number} limit - Number of rows per page
 * @param {number} offset - Current row offset
 * @param {Function} onPageChange - Callback for pagination
 */
export const DataTable = ({ result, limit, offset, onPageChange }) => {
  const { columns, data, totalRows } = result;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalRows / limit);

  // Empty state handling
  if (data.length === 0) {
    return (
      <Paper p="xl" radius="2.5rem" withBorder bg="orange.0" style={{ borderColor: 'var(--mantine-color-orange-2)' }}>
        <Group gap="xl">
          <ThemeIcon size={50} radius="xl" color="orange" variant="light">
            <Info size={26} />
          </ThemeIcon>
          <Stack gap={2}>
            <Text fw={900} size="xl" c="orange.9">لم يتم العثور على نتائج</Text>
            <Text fw={500} c="orange.8" opacity={0.8}>جرب تعديل الفلاتر أو الشروط للحصول على بيانات.</Text>
          </Stack>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper radius="2.5rem" withBorder shadow="sm" className="overflow-hidden bg-white">
      {/* Table Header Section */}
      <Group justify="space-between" p="xl" className="border-b border-slate-50 bg-slate-50/30">
        <Group gap="md">
          <ThemeIcon size="lg" color="green" radius="md">
            <CheckCircle2 size={20} />
          </ThemeIcon>
          <Text fw={900} size="xl">النتائج المستخرجة</Text>
        </Group>
        <Badge variant="light" color="indigo" size="lg" radius="xl">
          {totalRows} سجل إجمالي
        </Badge>
      </Group>

      {/* Scrollable Table Area */}
      <Table.ScrollContainer minWidth={500}>
        <Table 
          striped 
          highlightOnHover 
          verticalSpacing="md" 
          horizontalSpacing="xl"
          className="text-right"
        >
          <Table.Thead className="bg-slate-50/50">
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col} className="text-right">
                  <Text size="xs" fw={900} c="dimmed" tt="uppercase">
                    {col}
                  </Text>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((row, i) => (
              <Table.Tr key={i}>
                {columns.map((col) => (
                  <Table.Td key={col}>
                    <Text size="sm" fw={600} c="slate.7">
                      {String(row[col] ?? 'NULL')}
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Pagination Footer */}
      {totalRows > limit && (
        <Group justify="space-between" p="xl" className="border-t border-slate-50">
          <Text size="sm" fw={700} c="dimmed">
            الصفحة <Text component="span" c="indigo" fw={900}>{currentPage}</Text> من {totalPages}
          </Text>
          
          <Group gap="xs">
            <ActionIcon 
              variant="light" 
              size="lg" 
              radius="xl" 
              disabled={currentPage === 1}
              onClick={() => onPageChange(offset - limit)}
            >
              <ChevronRight size={18} />
            </ActionIcon>
            
            <Pagination.Root 
              total={totalPages} 
              value={currentPage} 
              onChange={(p) => onPageChange((p - 1) * limit)}
              size="sm"
              radius="xl"
            >
              <Group gap={5} justify="center">
                <Pagination.Items />
              </Group>
            </Pagination.Root>

            <ActionIcon 
              variant="light" 
              size="lg" 
              radius="xl" 
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(offset + limit)}
            >
              <ChevronLeft size={18} />
            </ActionIcon>
          </Group>
        </Group>
      )}
    </Paper>
  );
};