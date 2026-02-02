import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Layout } from '@/components/Layout';
import { Stack, Container, Title, Text, Button, Select, Grid, Card, Badge, Group, ThemeIcon, Loader } from '@mantine/core';
import { Table as TableIcon, Columns, Play, PlusCircle, Link, Filter, Code, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDatabaseMetadata, executeQuery } from '@/api/mockDatabaseApi';
import { DataTable } from '@/components/query/DataTable';
import { toast } from 'sonner';
import { JoinClauseRow } from '@/components/query/JoinClauseRow';
import { FilterConditionRow } from '@/components/query/FilterConditionRow';
import { QueryBuilderSection } from '@/components/query/QueryBuilderSection';

const DEFAULT_LIMIT = 10;

const QueryBuilderPage = () => {
  const { connectionId } = useParams();
  const { connections } = useConnection();
  const connection = connections.find(c => c.id === connectionId);

  const [selectedTableName, setSelectedTableName] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(['*']);
  const [filters, setFilters] = useState([]);
  const [joins, setJoins] = useState([]);
  const [offset, setOffset] = useState(0);

  const { data: metadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ['dbMetadata', connectionId],
    queryFn: () => fetchDatabaseMetadata(connectionId),
    enabled: !!connectionId,
  });

  const tablesInQuery = useMemo(() => {
    if (!metadata || !selectedTableName) return [];
    const primary = metadata.tables.find(t => t.name === selectedTableName);
    if (!primary) return [];
    const joined = joins.map(j => metadata.tables.find(t => t.name === j.targetTable)).filter(t => !!t);
    const result = [primary];
    joined.forEach(t => {
      if (!result.find(existing => existing.name === t.name)) result.push(t);
    });
    return result;
  }, [metadata, selectedTableName, joins]);

  const allAvailableColumns = useMemo(() => {
    return tablesInQuery.flatMap(table => 
      table.columns.map(col => ({ ...col, name: `${table.name}.${col.name}` }))
    );
  }, [tablesInQuery]);

  const handleExecuteQuery = () => {
    if (!selectedTableName) {
      toast.warning("يرجى اختيار جدول أولاً.");
      return;
    }
    executeQueryRefetch();
  };

  const queryDefinition = useMemo(() => ({
    connectionId,
    tableName: selectedTableName,
    joins: joins.filter(j => j.sourceTable && j.targetTable && j.sourceColumn && j.targetColumn),
    columns: selectedColumns,
    filters: filters.filter(f => f.column && f.operator && (f.valueType === 'literal' ? f.value : f.subquery?.column)),
    orderBy: [],
    groupBy: [],
    limit: DEFAULT_LIMIT,
    offset: offset,
  }), [connectionId, selectedTableName, joins, selectedColumns, filters, offset]);

  const { data: queryResult, isFetching: isExecutingQuery, refetch: executeQueryRefetch } = useQuery({
    queryKey: ['queryResults', queryDefinition],
    queryFn: () => executeQuery(queryDefinition),
    enabled: false,
  });

  if (!connection) return <Layout>الاتصال غير موجود</Layout>;
  if (isLoadingMetadata) return <Layout><Stack align="center" justify="center" h="100vh"><Loader size="xl" /><Text fw={700}>جاري التحميل...</Text></Stack></Layout>;

  return (
    <Layout>
      <Container size="xl" py="xl">
        <Stack gap={50}>
          {/* Header */}
          <Card padding="xl" radius="2.5rem" withBorder>
            <Group justify="space-between" align="flex-end">
              <Stack gap="xs">
                <Group gap="xs">
                  <Sparkles size={20} color="var(--mantine-color-orange-5)" fill="var(--mantine-color-orange-5)" />
                  <Text size="xs" fw={900} c="indigo" tt="uppercase" lts={2}>المحلل الذكي</Text>
                </Group>
                <Title order={1} fw={900} size="h1" className="flex items-center gap-3">
                  <Code size={40} color="var(--mantine-color-indigo-6)" /> منشئ الاستعلامات
                </Title>
                <Text fw={600} c="dimmed">
                  أنت تعمل على: <Badge size="lg" radius="xl" color="indigo" variant="light">{connection.name}</Badge>
                </Text>
              </Stack>
            </Group>
          </Card>

          <Stack gap={40}>
            {/* Step 1 */}
            <QueryBuilderSection 
              title="الخطوة 1: الجدول الأساسي" 
              description="اختر الجدول الذي ستبدأ منه عملية جلب البيانات."
              icon={<TableIcon />}
              variant="indigo"
              badge={selectedTableName ? "جاهز" : "مطلوب"}
            >
              <Select
                placeholder="ابحث عن جدول..."
                size="lg"
                radius="xl"
                data={metadata?.tables.map(t => t.name)}
                value={selectedTableName}
                onChange={setSelectedTableName}
                searchable
                leftSection={<TableIcon size={18} />}
                className="max-w-md"
              />
            </QueryBuilderSection>

            {selectedTableName && (
              <>
                {/* Step 2 */}
                <QueryBuilderSection 
                  title="الخطوة 2: العلاقات" 
                  description="اربط جداول أخرى بالجدول الحالي لجلب المزيد من التفاصيل."
                  icon={<Link />}
                  variant="amber"
                >
                  <Stack gap="md">
                    {joins.map((join) => (
                      <JoinClauseRow
                        key={join.id}
                        join={join}
                        allTables={metadata?.tables || []}
                        availableSourceTables={tablesInQuery.map(t => t.name)}
                        onChange={(u) => setJoins(prev => prev.map(j => j.id === u.id ? u : j))}
                        onRemove={(id) => setJoins(prev => prev.filter(j => j.id !== id))}
                      />
                    ))}
                    <Button 
                      variant="light" 
                      color="orange" 
                      fullWidth 
                      size="lg" 
                      radius="xl" 
                      leftSection={<PlusCircle size={20} />}
                      onClick={() => setJoins(p => [...p, { id: crypto.randomUUID(), joinType: 'INNER JOIN', sourceTable: selectedTableName, targetTable: '', sourceColumn: '', targetColumn: '' }])}
                    >
                      إضافة علاقة ربط جديدة
                    </Button>
                  </Stack>
                </QueryBuilderSection>

                {/* Step 3 */}
                <QueryBuilderSection 
                  title="الخطوة 3: التصفية" 
                  description="حدد المعايير والشروط لتقليل حجم البيانات المسترجعة."
                  icon={<Filter />}
                  variant="emerald"
                >
                  <Stack gap="md">
                    {filters.map((filter, index) => (
                      <FilterConditionRow
                        key={filter.id}
                        condition={filter}
                        columns={allAvailableColumns}
                        allTables={metadata?.tables || []}
                        index={index}
                        totalConditions={filters.length}
                        onChange={(u) => setFilters(prev => prev.map(f => f.id === u.id ? u : f))}
                        onRemove={(id) => setFilters(prev => prev.filter(f => f.id !== id))}
                        onAdd={() => setFilters(p => [...p, { id: crypto.randomUUID(), column: '', operator: '=', value: '', valueType: 'literal', logicalOperator: 'AND' }])}
                      />
                    ))}
                  </Stack>
                </QueryBuilderSection>

                <Group justify="center" py={40}>
                  <Button 
                    size="xl" 
                    radius="2rem" 
                    loading={isExecutingQuery}
                    leftSection={<Play size={24} fill="white" />}
                    onClick={handleExecuteQuery}
                    className="shadow-2xl shadow-indigo-200"
                    px={60}
                    h={70}
                  >
                    استخراج البيانات الآن
                  </Button>
                </Group>
              </>
            )}
          </Stack>

          {queryResult && (
            <DataTable 
              result={queryResult} 
              limit={DEFAULT_LIMIT} 
              offset={offset} 
              onPageChange={(o) => {setOffset(o); executeQueryRefetch();}}
            />
          )}
        </Stack>
      </Container>
    </Layout>
  );
};

export default QueryBuilderPage;