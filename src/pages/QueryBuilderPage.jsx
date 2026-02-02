import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Layout } from '@/components/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Table as TableIcon, Columns, Play, PlusCircle, Link, Filter, Code, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDatabaseMetadata, executeQuery } from '@/api/mockDatabaseApi';
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

const QueryBuilderPage = () => {
  const { connectionId } = useParams();
  const { connections } = useConnection();
  const connection = connections.find(c => c.id === connectionId);

  const [selectedTableName, setSelectedTableName] = useState('');
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
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

  const handlePrimaryTableChange = (newTable) => {
    setSelectedTableName(newTable);
    setFilters([{ id: crypto.randomUUID(), column: '', operator: '=', value: '', valueType: 'literal', logicalOperator: 'AND' }]);
    setSelectedColumns(['*']);
    setJoins([]);
    setOffset(0);
    setIsTableSelectorOpen(false);
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

  const handleExecuteQuery = () => {
    if (!selectedTableName) {
      toast.warning("يرجى اختيار جدول أولاً.");
      return;
    }
    executeQueryRefetch();
  };

  if (!connection) return <Layout><Alert variant="destructive"><AlertDescription>الاتصال غير موجود</AlertDescription></Alert></Layout>;
  if (isLoadingMetadata) return <Layout><div className="flex flex-col items-center justify-center h-screen space-y-4 text-indigo-600"><Loader2 className="h-12 w-12 animate-spin" /><p className="text-xl font-bold">جاري تحميل هيكل البيانات...</p></div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-amber-500 w-5 h-5 fill-amber-500" />
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">المحلل الذكي</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <Code className="w-10 h-10 text-indigo-600" /> منشئ الاستعلامات
            </h1>
            <p className="text-slate-500 mt-2 text-lg">أنت تعمل على: <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{connection.name}</span></p>
          </div>
        </header>

        <div className="space-y-12">
          {/* Step 1 */}
          <QueryBuilderSection 
            title="الخطوة 1: الجدول الأساسي" 
            description="اختر الجدول الذي ستبدأ منه عملية جلب البيانات."
            icon={<TableIcon />}
            variant="indigo"
            badge={selectedTableName ? "جاهز" : "مطلوب"}
          >
            <div className="max-w-md">
              <Popover open={isTableSelectorOpen} onOpenChange={setIsTableSelectorOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-2xl h-14 text-lg border-2 border-indigo-100 hover:border-indigo-400 px-4 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <TableIcon className="w-5 h-5 text-indigo-600" />
                      <span className={selectedTableName ? "text-slate-900 font-bold" : "text-slate-400"}>
                        {selectedTableName || "ابحث عن جدول..."}
                      </span>
                    </div>
                    <ChevronDown className="ms-2 h-5 w-5 opacity-40" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-[2rem] shadow-2xl border-2 border-indigo-50 overflow-hidden" align="start">
                  <Command className="rounded-none">
                    <CommandInput placeholder="اكتب اسم الجدول..." className="h-14 border-none focus:ring-0 text-right" />
                    <CommandList className="max-h-[300px] custom-scrollbar">
                      <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                      <CommandGroup>
                        {metadata?.tables.map((table) => (
                          <CommandItem
                            key={table.name}
                            value={table.name}
                            onSelect={handlePrimaryTableChange}
                            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-indigo-50"
                          >
                            <TableIcon className="w-4 h-4 text-indigo-400" />
                            <span className="font-bold text-slate-700">{table.name}</span>
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
              {/* Step 2 */}
              <QueryBuilderSection 
                title="الخطوة 2: العلاقات" 
                description="اربط جداول أخرى بالجدول الحالي لجلب المزيد من التفاصيل."
                icon={<Link />}
                variant="amber"
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
                  <button 
                    onClick={() => setJoins(p => [...p, { id: crypto.randomUUID(), joinType: 'INNER JOIN', sourceTable: selectedTableName, targetTable: '', sourceColumn: '', targetColumn: '' }])}
                    className="w-full py-4 border-2 border-dashed border-amber-200 rounded-2xl text-amber-600 font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={20} />
                    إضافة علاقة ربط جديدة
                  </button>
                </div>
              </QueryBuilderSection>

              {/* Step 3 */}
              <QueryBuilderSection 
                title="الخطوة 3: التصفية" 
                description="حدد المعايير والشروط لتقليل حجم البيانات المسترجعة."
                icon={<Filter />}
                variant="emerald"
              >
                <div className="space-y-4">
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

              {/* Step 4 */}
              <QueryBuilderSection 
                title="الخطوة 4: الأعمدة" 
                description="اختر البيانات المحددة التي تريد رؤيتها في الجدول النهائي."
                icon={<Columns />}
                variant="blue"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tablesInQuery.map(table => (
                    <div key={table.name} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                      <p className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
                        <TableIcon size={12} /> {table.name}
                      </p>
                      <div className="space-y-2">
                        {table.columns.map(col => {
                          const qName = `${table.name}.${col.name}`;
                          const isSelected = selectedColumns.includes(qName) || selectedColumns.includes('*');
                          return (
                            <div 
                              key={col.name} 
                              className={cn(
                                "flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all",
                                isSelected ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-white hover:bg-blue-50 text-slate-600"
                              )}
                              onClick={() => {
                                setSelectedColumns(prev => {
                                  const base = prev.filter(x => x !== '*');
                                  return isSelected ? base.filter(x => x !== qName) : [...base, qName];
                                });
                              }}
                            >
                              <div className={cn("w-4 h-4 rounded border flex items-center justify-center", isSelected ? "bg-white text-blue-600 border-white" : "border-slate-300")}>
                                {isSelected && <Check size={12} strokeWidth={4} />}
                              </div>
                              <span className="text-sm font-bold">{col.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </QueryBuilderSection>

              <div className="flex justify-center py-10">
                <button 
                  onClick={handleExecuteQuery} 
                  disabled={isExecutingQuery}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-12 py-5 rounded-[2rem] text-xl font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-4"
                >
                  {isExecutingQuery ? <Loader2 className="animate-spin" size={24} /> : <Play className="fill-current" size={24} />}
                  <span>{isExecutingQuery ? "جاري المعالجة..." : "استخراج البيانات الآن"}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {queryResult && (
          <div className="mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <DataTable 
              result={queryResult} 
              limit={DEFAULT_LIMIT} 
              offset={offset} 
              onPageChange={(o) => {setOffset(o); executeQueryRefetch();}}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QueryBuilderPage;