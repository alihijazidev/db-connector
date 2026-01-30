import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Search, Table as TableIcon, Columns, Filter, Play, PlusCircle, Link, ListOrdered } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDatabaseMetadata, executeQuery } from '@/api/mockDatabaseApi';
import { ColumnMetadata, FilterCondition, QueryDefinition, QueryResult, TableMetadata, JoinClause, OrderByClause, GroupByClause } from '@/types/database';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterConditionRow } from '@/components/query/FilterConditionRow';
import { DataTable } from '@/components/query/DataTable';
import { toast } from 'sonner';
import { JoinClauseRow } from '@/components/query/JoinClauseRow';
import SortAndGroupBuilder from '@/components/query/SortAndGroupBuilder';

const DEFAULT_LIMIT = 10;

const QueryBuilderPage: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const { connections } = useConnection();
  
  const connection = connections.find(c => c.id === connectionId);

  // --- State Management ---
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['*']);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [joins, setJoins] = useState<JoinClause[]>([]);
  const [orderBy, setOrderBy] = useState<OrderByClause[]>([]);
  const [groupBy, setGroupBy] = useState<GroupByClause[]>([]);
  const [offset, setOffset] = useState(0);

  // --- Data Fetching (Metadata) ---
  const { data: metadata, isLoading: isLoadingMetadata, error: metadataError } = useQuery({
    queryKey: ['dbMetadata', connectionId],
    queryFn: () => fetchDatabaseMetadata(connectionId!),
    enabled: !!connectionId,
  });

  // --- Derived State ---
  
  // All tables currently in the query (primary + targets of valid joins)
  const tablesInQuery: TableMetadata[] = useMemo(() => {
    if (!metadata || !selectedTableName) return [];
    const primary = metadata.tables.find(t => t.name === selectedTableName);
    if (!primary) return [];

    const joined = joins
      .map(j => metadata.tables.find(t => t.name === j.targetTable))
      .filter((t): t is TableMetadata => !!t);

    // Filter out duplicates (though schema usually prevents this)
    return [primary, ...joined].reduce((acc: TableMetadata[], curr) => {
      if (!acc.find(t => t.name === curr.name)) acc.push(curr);
      return acc;
    }, []);
  }, [metadata, selectedTableName, joins]);

  // Names of tables available to be a source for a join
  const availableSourceTables: string[] = useMemo(() => {
    return tablesInQuery.map(t => t.name);
  }, [tablesInQuery]);

  // All columns from all tables in the query, qualified as table.column
  const allAvailableColumns: ColumnMetadata[] = useMemo(() => {
    return tablesInQuery.flatMap(table => 
      table.columns.map(col => ({
        ...col,
        name: `${table.name}.${col.name}`
      }))
    );
  }, [tablesInQuery]);

  const allAvailableColumnNames: string[] = useMemo(() => {
    return allAvailableColumns.map(c => c.name);
  }, [allAvailableColumns]);

  // Reset logic when primary table changes
  React.useEffect(() => {
    if (metadata && metadata.tables.length > 0) {
      if (!selectedTableName || !metadata.tables.some(t => t.name === selectedTableName)) {
        setSelectedTableName(metadata.tables[0].name);
      }
    }
  }, [metadata]);

  // Handle full reset when primary table changes
  const handlePrimaryTableChange = (newTable: string) => {
    setSelectedTableName(newTable);
    setFilters([{ id: crypto.randomUUID(), column: '', operator: '=', value: '', logicalOperator: 'AND' }]);
    setSelectedColumns(['*']);
    setJoins([]);
    setOrderBy([]);
    setGroupBy([]);
    setOffset(0);
  };

  // --- Query Execution Definition ---
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

  const { data: queryResult, isLoading: isExecutingQuery, refetch: executeQueryRefetch } = useQuery<QueryResult>({
    queryKey: ['queryResults', queryDefinition],
    queryFn: () => executeQuery(queryDefinition),
    enabled: !!selectedTableName && !!connectionId,
    staleTime: 0,
  });

  // --- Handlers ---

  const handleToggleColumn = (columnName: string, isChecked: boolean) => {
    setOffset(0);
    setSelectedColumns(prev => {
      if (columnName === '*') {
        return isChecked ? ['*'] : [];
      }
      
      let current = prev.includes('*') ? [] : prev;

      if (isChecked) {
        return [...current, columnName];
      } else {
        const newCols = current.filter(c => c !== columnName);
        return newCols.length === 0 ? ['*'] : newCols;
      }
    });
  };

  const handleFilterChange = useCallback((updatedCondition: FilterCondition) => {
    setOffset(0);
    setFilters(prev => prev.map(f => f.id === updatedCondition.id ? updatedCondition : f));
  }, []);

  const handleAddFilter = () => {
    setOffset(0);
    setFilters(prev => [
      ...prev, 
      { id: crypto.randomUUID(), column: '', operator: '=', value: '', logicalOperator: 'AND' }
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    setOffset(0);
    setFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleJoinChange = useCallback((updatedJoin: JoinClause) => {
    setOffset(0);
    setJoins(prev => prev.map(j => j.id === updatedJoin.id ? updatedJoin : j));
  }, []);

  const handleAddJoin = () => {
    setOffset(0);
    setJoins(prev => [
      ...prev, 
      { 
        id: crypto.randomUUID(), 
        joinType: 'INNER JOIN', 
        sourceTable: selectedTableName,
        targetTable: '', 
        sourceColumn: '', 
        targetColumn: '' 
      }
    ]);
  };

  const handleRemoveJoin = (id: string) => {
    setOffset(0);
    setJoins(prev => prev.filter(j => j.id !== id));
  };

  const handleAddOrderBy = () => {
    setOffset(0);
    setOrderBy(prev => [
      ...prev,
      { id: crypto.randomUUID(), column: '', order: 'ASC' }
    ]);
  };

  const handleRemoveOrderBy = (id: string) => {
    setOffset(0);
    setOrderBy(prev => prev.filter(o => o.id !== id));
  };

  const handleUpdateOrderBy = useCallback((updatedClause: OrderByClause) => {
    setOffset(0);
    setOrderBy(prev => prev.map(o => o.id === updatedClause.id ? updatedClause : o));
  }, []);

  const handleAddGroupBy = () => {
    setOffset(0);
    setGroupBy(prev => [
      ...prev,
      { id: crypto.randomUUID(), column: '' }
    ]);
  };

  const handleRemoveGroupBy = (id: string) => {
    setOffset(0);
    setGroupBy(prev => prev.filter(g => g.id !== id));
  };

  const handleUpdateGroupBy = useCallback((updatedClause: GroupByClause) => {
    setOffset(0);
    setGroupBy(prev => prev.map(g => g.id === updatedClause.id ? updatedClause : g));
  }, []);

  const handleExecuteQuery = () => {
    if (!selectedTableName) {
      toast.warning("Please select a table first.");
      return;
    }
    setOffset(0);
    executeQueryRefetch();
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    executeQueryRefetch();
  };

  if (!connection) {
    return (
      <Layout>
        <Alert variant="destructive" className="rounded-xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Not Found</AlertTitle>
          <AlertDescription>
            The specified connection ID ({connectionId}) is invalid or has been removed.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  if (isLoadingMetadata) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <span className="text-lg text-muted-foreground">Loading database schema...</span>
        </div>
      </Layout>
    );
  }

  if (metadataError) {
    return (
      <Layout>
        <Alert variant="destructive" className="rounded-xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Metadata Error</AlertTitle>
          <AlertDescription>
            Failed to fetch database metadata: {metadataError.message}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <Card className="shadow-xl rounded-2xl border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-primary/5 rounded-t-2xl border-b p-6">
            <CardTitle className="text-3xl font-extrabold text-primary flex items-center">
              <Search className="w-8 h-8 mr-3" /> Query Builder: {connection.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            
            {/* 1. Primary Table Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold flex items-center text-foreground">
                  <TableIcon className="w-6 h-6 mr-2 text-primary" /> Primary Table
                </h4>
                <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">Required</span>
              </div>
              <Select
                value={selectedTableName}
                onValueChange={handlePrimaryTableChange}
              >
                <SelectTrigger className="w-full md:w-1/2 rounded-xl py-6 text-lg border-2 border-primary/20 focus:ring-primary transition-all hover:border-primary/40 bg-background">
                  <SelectValue placeholder="Choose a starting table..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {metadata?.tables.map(table => (
                    <SelectItem key={table.name} value={table.name} className="text-base">
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Join Relationships */}
            {selectedTableName && (
              <div className="space-y-4 p-6 border-2 border-primary/10 rounded-2xl bg-secondary/20 shadow-inner">
                <h4 className="text-xl font-bold flex items-center text-foreground">
                  <Link className="w-6 h-6 mr-2 text-primary" /> Relationships (Joins)
                </h4>
                <div className="space-y-4">
                  {joins.map((join) => (
                    <JoinClauseRow
                      key={join.id}
                      join={join}
                      allTables={metadata?.tables || []}
                      availableSourceTables={availableSourceTables}
                      onChange={handleJoinChange}
                      onRemove={handleRemoveJoin}
                    />
                  ))}
                  <Button onClick={handleAddJoin} variant="outline" className="w-full md:w-auto rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 py-6">
                    <PlusCircle className="w-5 h-5 mr-2" /> Link Another Table
                  </Button>
                </div>
              </div>
            )}

            {/* 3. Column Selection - Grouped by Table */}
            {selectedTableName && (
              <div className="space-y-4 p-6 border-2 border-primary/10 rounded-2xl bg-secondary/20">
                <h4 className="text-xl font-bold flex items-center text-foreground">
                  <Columns className="w-6 h-6 mr-2 text-primary" /> Select Columns
                </h4>
                
                <div className="flex items-center space-x-3 pb-4 border-b border-primary/10">
                  <Checkbox
                    id="select-all"
                    checked={selectedColumns.includes('*')}
                    onCheckedChange={(checked) => handleToggleColumn('*', !!checked)}
                    className="w-5 h-5 rounded-md"
                  />
                  <Label htmlFor="select-all" className="font-bold text-lg text-primary cursor-pointer">
                    All Columns (*)
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                  {tablesInQuery.map(table => (
                    <div key={table.name} className="space-y-3 p-4 bg-background rounded-xl shadow-sm border border-primary/5">
                      <div className="flex items-center space-x-2 border-b pb-2 mb-2">
                        <TableIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{table.name}</span>
                      </div>
                      <div className="space-y-2">
                        {table.columns.map(col => {
                          const qualifiedName = `${table.name}.${col.name}`;
                          return (
                            <div key={qualifiedName} className="flex items-center space-x-3 group">
                              <Checkbox
                                id={`col-${qualifiedName}`}
                                checked={selectedColumns.includes(qualifiedName) && !selectedColumns.includes('*')}
                                onCheckedChange={(checked) => handleToggleColumn(qualifiedName, !!checked)}
                                className="w-4 h-4 rounded group-hover:border-primary transition-colors"
                              />
                              <Label htmlFor={`col-${qualifiedName}`} className="text-sm cursor-pointer group-hover:text-primary transition-colors flex justify-between w-full">
                                <span>{col.name}</span>
                                <span className="text-[10px] text-muted-foreground opacity-50">{col.dataType}</span>
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Filters - All Available Columns */}
            {selectedTableName && (
              <div className="space-y-4 p-6 border-2 border-primary/10 rounded-2xl bg-secondary/20">
                <h4 className="text-xl font-bold flex items-center text-foreground">
                  <Filter className="w-6 h-6 mr-2 text-primary" /> Filters (WHERE)
                </h4>
                <div className="space-y-3">
                  {filters.map((condition, index) => (
                    <FilterConditionRow
                      key={condition.id}
                      condition={condition}
                      columns={allAvailableColumns}
                      index={index}
                      totalConditions={filters.length}
                      onChange={handleFilterChange}
                      onRemove={handleRemoveFilter}
                      onAdd={handleAddFilter}
                    />
                  ))}
                  {filters.length === 0 && (
                    <Button onClick={handleAddFilter} variant="outline" className="rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5">
                      <PlusCircle className="w-4 h-4 mr-2" /> Add Filter Logic
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* 5. Sort and Grouping - All Available Columns */}
            {selectedTableName && (
              <div className="space-y-4 p-6 border-2 border-primary/10 rounded-2xl bg-secondary/20">
                <h4 className="text-xl font-bold flex items-center text-foreground">
                  <ListOrdered className="w-6 h-6 mr-2 text-primary" /> Ordering & Aggregation
                </h4>
                <SortAndGroupBuilder
                  allColumnNames={allAvailableColumnNames}
                  orderBy={orderBy}
                  groupBy={groupBy}
                  onAddOrderBy={handleAddOrderBy}
                  onRemoveOrderBy={handleRemoveOrderBy}
                  onUpdateOrderBy={handleUpdateOrderBy}
                  onAddGroupBy={handleAddGroupBy}
                  onRemoveGroupBy={handleRemoveGroupBy}
                  onUpdateGroupBy={handleUpdateGroupBy}
                />
              </div>
            )}

            {/* 6. Execution Call to Action */}
            <div className="pt-6">
              <Button 
                onClick={handleExecuteQuery} 
                disabled={!selectedTableName || isExecutingQuery}
                className="w-full rounded-2xl py-8 text-xl font-black bg-primary hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/20 group"
              >
                {isExecutingQuery ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Crunching Data...
                  </>
                ) : (
                  <>
                    <Play className="mr-3 h-6 w-6 group-hover:scale-125 transition-transform" /> RUN QUERY
                  </>
                )}
              </Button>
            </div>

            {/* 7. Results Display */}
            {queryResult && (
              <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
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