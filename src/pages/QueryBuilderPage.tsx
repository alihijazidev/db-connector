import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Table as TableIcon, Columns, Play, PlusCircle, Link } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDatabaseMetadata, executeQuery } from '@/api/mockDatabaseApi';
import { ColumnMetadata, FilterCondition, QueryDefinition, QueryResult, TableMetadata, JoinClause, OrderByClause, GroupByClause } from '@/types/database';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/query/DataTable';
import { toast } from 'sonner';
import { JoinClauseRow } from '@/components/query/JoinClauseRow';

const DEFAULT_LIMIT = 10;

const QueryBuilderPage: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const { connections } = useConnection();
  
  const connection = connections.find(c => c.id === connectionId);

  // --- State ---
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['*']);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [joins, setJoins] = useState<JoinClause[]>([]);
  const [orderBy, setOrderBy] = useState<OrderByClause[]>([]);
  const [groupBy, setGroupBy] = useState<GroupByClause[]>([]);
  const [offset, setOffset] = useState(0);

  // جلب البيانات الوصفية (الميتاداتا) يظل تلقائياً لتهيئة الواجهة
  const { data: metadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ['dbMetadata', connectionId],
    queryFn: () => fetchDatabaseMetadata(connectionId!),
    enabled: !!connectionId,
  });

  const tablesInQuery: TableMetadata[] = useMemo(() => {
    if (!metadata || !selectedTableName) return [];
    const primary = metadata.tables.find(t => t.name === selectedTableName);
    if (!primary) return [];
    const joined = joins.map(j => metadata.tables.find(t => t.name === j.targetTable)).filter((t): t is TableMetadata => !!t);
    return [primary, ...joined].reduce((acc: TableMetadata[], curr) => {
      if (!acc.find(t => t.name === curr.name)) acc.push(curr);
      return acc;
    }, []);
  }, [metadata, selectedTableName, joins]);

  const handlePrimaryTableChange = (newTable: string) => {
    setSelectedTableName(newTable);
    setFilters([{ id: crypto.randomUUID(), column: '', operator: '=', value: '', logicalOperator: 'AND' }]);
    setSelectedColumns(['*']);
    setJoins([]);
    setOrderBy([]);
    setGroupBy([]);
    setOffset(0);
  };

  const queryDefinition: QueryDefinition = useMemo(() => ({
    connectionId: connectionId!,
    tableName: selectedTableName,
    joins: joins.filter(j => j.sourceTable && j.targetTable && j.sourceColumn && j.targetColumn),
    columns: selectedColumns,
    filters: filters.filter(f => f.column && f.operator && f.value),
    orderBy: orderBy.filter(o => o.column),
    groupBy: groupBy.filter(g => g.column),
    limit: DEFAULT_LIMIT,
    offset: offset,
  }), [connectionId, selectedTableName, joins, selectedColumns, filters, orderBy, groupBy, offset]);

  // تعطيل الجلب التلقائي باستخدام enabled: false
  const { data: queryResult, isFetching: isExecutingQuery, refetch: executeQueryRefetch } = useQuery<QueryResult>({
    queryKey: ['queryResults', queryDefinition],
    queryFn: () => executeQuery(queryDefinition),
    enabled: false,
    staleTime: 0,
  });

  const handleExecuteQuery = () => {
    if (!selectedTableName) {
      toast.warning("يرجى اختيار جدول أولاً.");
      return;
    }
    executeQueryRefetch();
  };

  // معالجة تغيير الصفحة - نحتاج لتنفيذ الاستعلام مرة أخرى عند تغيير الأوفست
  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    // نستخدم setTimeout لضمان تحديث الـ offset في الـ queryDefinition قبل إعادة الجلب
    setTimeout(() => executeQueryRefetch(), 0);
  };

  if (!connection) return <Layout><Alert variant="destructive"><AlertDescription>الاتصال غير موجود</AlertDescription></Alert></Layout>;
  if (isLoadingMetadata) return <Layout><div className="flex items-center justify-center h-64"><Loader2 className="ms-3 h-8 w-8 animate-spin" /> تحميل البيانات...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-8">
        <Card className="shadow-xl rounded-2xl border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-primary/5 rounded-t-2xl border-b p-6">
            <CardTitle className="text-3xl font-extrabold text-primary flex items-center">
              <Search className="w-8 h-8 ms-3" /> منشئ الاستعلامات: {connection.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            
            <div className="space-y-4">
              <h4 className="text-xl font-bold flex items-center text-foreground">
                <TableIcon className="w-6 h-6 ms-2 text-primary" /> الجدول الأساسي
              </h4>
              <Select value={selectedTableName} onValueChange={handlePrimaryTableChange}>
                <SelectTrigger className="w-full md:w-1/2 rounded-xl py-6 text-lg border-2">
                  <SelectValue placeholder="اختر جدولاً..." />
                </SelectTrigger>
                <SelectContent>
                  {metadata?.tables.map(table => (
                    <SelectItem key={table.name} value={table.name}>{table.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTableName && (
              <div className="space-y-4 p-6 border-2 border-primary/10 rounded-2xl bg-secondary/20">
                <h4 className="text-xl font-bold flex items-center text-foreground">
                  <Link className="w-6 h-6 ms-2 text-primary" /> العلاقات (Joins)
                </h4>
                <div className="space-y-4">
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
                  <Button onClick={() => setJoins(p => [...p, { id: crypto.randomUUID(), joinType: 'INNER JOIN', sourceTable: selectedTableName, targetTable: '', sourceColumn: '', targetColumn: '' }])} variant="outline" className="w-full md:w-auto rounded-xl py-6">
                    <PlusCircle className="w-5 h-5 ms-2" /> إضافة علاقة مع جدول آخر
                  </Button>
                </div>
              </div>
            )}

            {selectedTableName && (
              <div className="space-y-4 p-6 border-2 border-primary/10 rounded-2xl bg-secondary/20">
                <h4 className="text-xl font-bold flex items-center text-foreground">
                  <Columns className="w-6 h-6 ms-2 text-primary" /> تحديد الأعمدة
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tablesInQuery.map(table => (
                    <div key={table.name} className="space-y-3 p-4 bg-background rounded-xl border border-primary/5">
                      <div className="flex items-center space-x-2 border-b pb-2 mb-2">
                        <span className="font-bold text-sm text-muted-foreground uppercase">{table.name}</span>
                      </div>
                      <div className="space-y-2">
                        {table.columns.map(col => (
                          <div key={col.name} className="flex items-center space-x-3 group">
                            <Checkbox 
                              id={`${table.name}-${col.name}`} 
                              checked={selectedColumns.includes(`${table.name}.${col.name}`) || selectedColumns.includes('*')}
                              onCheckedChange={(checked) => {
                                const qName = `${table.name}.${col.name}`;
                                setSelectedColumns(prev => checked ? [...prev.filter(x => x !== '*'), qName] : prev.filter(x => x !== qName));
                              }}
                            />
                            <Label htmlFor={`${table.name}-${col.name}`} className="ms-2 cursor-pointer">{col.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6">
              <Button onClick={handleExecuteQuery} className="w-full rounded-2xl py-8 text-xl font-black shadow-2xl group" disabled={isExecutingQuery}>
                {isExecutingQuery ? <Loader2 className="ms-3 h-6 w-6 animate-spin" /> : <Play className="ms-3 h-6 w-6" />}
                {isExecutingQuery ? "جاري المعالجة..." : "تشغيل الاستعلام"}
              </Button>
            </div>

            {queryResult && (
              <div className="mt-12">
                <DataTable 
                  result={queryResult} 
                  limit={DEFAULT_LIMIT} 
                  offset={offset} 
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default QueryBuilderPage;