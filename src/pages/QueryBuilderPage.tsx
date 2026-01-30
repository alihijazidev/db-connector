import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Layout } from '@/components/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Table as TableIcon, Columns, Play, PlusCircle, Link, Filter, CheckCircle2, Code, ChevronDown, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDatabaseMetadata, executeQuery } from '@/api/mockDatabaseApi';
import { ColumnMetadata, FilterCondition, QueryDefinition, QueryResult, TableMetadata, JoinClause } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/query/DataTable';
import { toast } from 'sonner';
import { JoinClauseRow } from '@/components/query/JoinClauseRow';
import { FilterConditionRow } from '@/components/query/FilterConditionRow';
import { QueryBuilderSection } from '@/components/query/QueryBuilderSection';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const DEFAULT_LIMIT = 10;

const QueryBuilderPage: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const { connections } = useConnection();
  
  const connection = connections.find(c => c.id === connectionId);

  // --- State ---
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['*']);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [joins, setJoins] = useState<JoinClause[]>([]);
  const [offset, setOffset] = useState(0);

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
    const result = [primary];
    joined.forEach(t => {
      if (!result.find(existing => existing.name === t.name)) result.push(t);
    });
    return result;
  }, [metadata, selectedTableName, joins]);

  const allAvailableColumns: ColumnMetadata[] = useMemo(() => {
    return tablesInQuery.flatMap(table => 
      table.columns.map(col => ({ ...col, name: `${table.name}.${col.name}` }))
    );
  }, [tablesInQuery]);

  const handlePrimaryTableChange = (newTable: string) => {
    setSelectedTableName(newTable);
    setFilters([{ id: crypto.randomUUID(), column: '', operator: '=', value: '', valueType: 'literal', logicalOperator: 'AND' }]);
    setSelectedColumns(['*']);
    setJoins([]);
    setOffset(0);
    setIsTableSelectorOpen(false);
  };

  const queryDefinition: QueryDefinition = useMemo(() => ({
    connectionId: connectionId!,
    tableName: selectedTableName,
    joins: joins.filter(j => j.sourceTable && j.targetTable && j.sourceColumn && j.targetColumn),
    columns: selectedColumns,
    filters: filters.filter(f => f.column && f.operator && (f.valueType === 'literal' ? f.value : f.subquery?.column)),
    orderBy: [],
    groupBy: [],
    limit: DEFAULT_LIMIT,
    offset: offset,
  }), [connectionId, selectedTableName, joins, selectedColumns, filters, offset]);

  const { data: queryResult, isFetching: isExecutingQuery, refetch: executeQueryRefetch } = useQuery<QueryResult>({
    queryKey: ['queryResults', queryDefinition],
    queryFn: () => executeQuery(queryDefinition),
    enabled: false,
  });

  const handleExecuteQuery = () => {
    if (!selectedTableName) {
      toast.warning("يرجى اختيار جدول أولاً.");
      return;
    }
    executeQueryRefetch();
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    setTimeout(() => executeQueryRefetch(), 0);
  };

  if (!connection) return <Layout><Alert variant="destructive"><AlertDescription>الاتصال غير موجود</AlertDescription></Alert></Layout>;
  if (isLoadingMetadata) return <Layout><div className="flex flex-col items-center justify-center h-screen space-y-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="text-xl font-bold">جاري تحميل هيكل البيانات...</p></div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-foreground flex items-center gap-3">
              <Code className="w-10 h-10 text-primary" /> منشئ الاستعلامات
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">أنت تعمل على اتصال: <span className="font-bold text-primary">{connection.name}</span></p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          
          {/* STEP 1: SELECT TABLE */}
          <QueryBuilderSection 
            title="الخطوة 1: الجدول الأساسي" 
            description="ابحث عن الجدول الرئيسي واختره لبدء الاستعلام."
            icon={<TableIcon className="w-6 h-6" />}
            badge={selectedTableName ? "تم الاختيار" : "مطلوب"}
            className={selectedTableName ? "bg-primary/5" : "bg-card"}
          >
            <div className="max-w-md">
              <Popover open={isTableSelectorOpen} onOpenChange={setIsTableSelectorOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isTableSelectorOpen}
                    className="w-full justify-between rounded-xl h-14 text-lg border-2 border-primary/20 hover:border-primary px-4 bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <TableIcon className="w-5 h-5 text-primary" />
                      {selectedTableName || "ابحث عن جدول..."}
                    </div>
                    <ChevronDown className="ms-2 h-5 w-5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-2" align="start">
                  <Command className="rounded-2xl">
                    <CommandInput placeholder="اكتب اسم الجدول للبحث..." className="h-12 border-none focus:ring-0" />
                    <CommandList className="max-h-[300px] custom-scrollbar">
                      <CommandEmpty>لم يتم العثور على أي جدول بهذا الاسم.</CommandEmpty>
                      <CommandGroup heading="الجداول المتاحة">
                        {metadata?.tables.map((table) => (
                          <CommandItem
                            key={table.name}
                            value={table.name}
                            onSelect={handlePrimaryTableChange}
                            className="flex items-center justify-between p-3 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-md bg-secondary text-primary">
                                <TableIcon className="w-4 h-4" />
                              </div>
                              <span className="font-medium">{table.name}</span>
                            </div>
                            {selectedTableName === table.name && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </QueryBuilderSection>

          {selectedTableName && (
            <>
              {/* STEP 2: JOINS */}
              <QueryBuilderSection 
                title="الخطوة 2: العلاقات (Joins)" 
                description="اربط جداول إضافية بالجدول الأساسي لجلب بيانات مرتبطة."
                icon={<Link className="w-6 h-6" />}
                badge={joins.length > 0 ? `${joins.length} علاقات` : undefined}
              >
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
                  <Button onClick={() => setJoins(p => [...p, { id: crypto.randomUUID(), joinType: 'INNER JOIN', sourceTable: selectedTableName, targetTable: '', sourceColumn: '', targetColumn: '' }])} variant="outline" className="rounded-xl border-dashed border-2 hover:bg-primary/5 transition-colors">
                    <PlusCircle className="w-5 h-5 ms-2" /> إضافة علاقة جديدة
                  </Button>
                </div>
              </QueryBuilderSection>

              {/* STEP 3: FILTERS */}
              <QueryBuilderSection 
                title="الخطوة 3: الشروط (Filters)" 
                description="قم بتصفية النتائج بناءً على قيم محددة أو استعلامات من جداول أخرى."
                icon={<Filter className="w-6 h-6" />}
                badge={filters.length > 0 ? `${filters.length} شروط` : undefined}
              >
                <div className="space-y-3">
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
                </div>
              </QueryBuilderSection>

              {/* STEP 4: COLUMNS */}
              <QueryBuilderSection 
                title="الخطوة 4: تحديد الأعمدة" 
                description="اختر الأعمدة التي تريد عرضها في النتائج."
                icon={<Columns className="w-6 h-6" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-secondary/20 rounded-2xl border-2 border-primary/5">
                  {tablesInQuery.map(table => (
                    <div key={table.name} className="space-y-3 p-4 bg-background rounded-xl shadow-sm border border-primary/5">
                      <p className="text-xs font-black text-primary uppercase border-b pb-2 flex items-center justify-between">
                        {table.name}
                        <TableIcon className="w-3 h-3" />
                      </p>
                      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                        {table.columns.map(col => {
                          const qName = `${table.name}.${col.name}`;
                          const isSelected = selectedColumns.includes(qName) || selectedColumns.includes('*');
                          return (
                            <div 
                              key={col.name} 
                              className={cn(
                                "flex items-center p-2 rounded-lg transition-colors cursor-pointer hover:bg-primary/5",
                                isSelected && "bg-primary/5 text-primary"
                              )}
                              onClick={() => {
                                setSelectedColumns(prev => {
                                  const base = prev.filter(x => x !== '*');
                                  return isSelected ? base.filter(x => x !== qName) : [...base, qName];
                                });
                              }}
                            >
                              <Checkbox checked={isSelected} className="rounded-md" />
                              <Label className="ms-3 font-medium cursor-pointer flex-grow text-sm">{col.name}</Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </QueryBuilderSection>

              {/* Action Button Section */}
              <div className="flex justify-center py-6">
                <Button 
                  onClick={handleExecuteQuery} 
                  className="rounded-2xl h-16 px-12 text-xl font-black shadow-xl hover:scale-105 transition-transform group bg-primary" 
                  disabled={isExecutingQuery || !selectedTableName}
                >
                  {isExecutingQuery ? <Loader2 className="ms-3 h-6 w-6 animate-spin" /> : <Play className="ms-3 h-6 w-6 fill-current" />}
                  {isExecutingQuery ? "جاري التشغيل..." : "تشغيل الاستعلام وعرض النتائج"}
                </Button>
              </div>
            </>
          )}
        </div>

        {queryResult && (
          <div className="mt-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" /> النتائج المستخرجة
            </h3>
            <DataTable 
              result={queryResult} 
              limit={DEFAULT_LIMIT} 
              offset={offset} 
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QueryBuilderPage;