import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection } from '@/context/ConnectionContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Search, Table as TableIcon, Columns, Filter, Play, PlusCircle, Link } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDatabaseMetadata, executeQuery } from '@/api/mockDatabaseApi';
import { ColumnMetadata, FilterCondition, QueryDefinition, QueryResult, TableMetadata, JoinClause } from '@/types/database';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterConditionRow } from '@/components/query/FilterConditionRow';
import { DataTable } from '@/components/query/DataTable';
import { toast } from 'sonner';
import { JoinClauseRow } from '@/components/query/JoinClauseRow';

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
  const [offset, setOffset] = useState(0);

  // --- Data Fetching (Metadata) ---
  const { data: metadata, isLoading: isLoadingMetadata, error: metadataError } = useQuery({
    queryKey: ['dbMetadata', connectionId],
    queryFn: () => fetchDatabaseMetadata(connectionId!),
    enabled: !!connectionId,
  });

  // --- Derived State ---
  const currentTable: TableMetadata | undefined = useMemo(() => {
    return metadata?.tables.find(t => t.name === selectedTableName);
  }, [metadata, selectedTableName]);

  const allColumnNames: string[] = useMemo(() => {
    return currentTable?.columns.map(c => c.name) || [];
  }, [currentTable]);

  const allColumnMetadata: ColumnMetadata[] = useMemo(() => {
    return currentTable?.columns || [];
  }, [currentTable]);

  // Initialize table selection once metadata loads and reset state when table changes
  React.useEffect(() => {
    if (metadata && metadata.tables.length > 0) {
      if (!selectedTableName || !metadata.tables.some(t => t.name === selectedTableName)) {
        setSelectedTableName(metadata.tables[0].name);
      }
      // Reset filters, columns, and joins when table changes
      setFilters([{ id: crypto.randomUUID(), column: '', operator: '=', value: '', logicalOperator: 'AND' }]);
      setSelectedColumns(['*']);
      setJoins([]);
      setOffset(0);
    }
  }, [metadata, selectedTableName]);

  // --- Query Execution Definition ---
  const queryDefinition: QueryDefinition = useMemo(() => ({
    connectionId: connectionId!,
    tableName: selectedTableName,
    joins: joins.filter(j => j.targetTable && j.sourceColumn && j.targetColumn), // Only send valid joins
    columns: selectedColumns,
    filters: filters.filter(f => f.column && f.operator && f.value), // Only send valid filters
    limit: DEFAULT_LIMIT,
    offset: offset,
  }), [connectionId, selectedTableName, joins, selectedColumns, filters, offset]);

  const { data: queryResult, isLoading: isExecutingQuery, refetch: executeQueryRefetch } = useQuery<QueryResult>({
    queryKey: ['queryResults', queryDefinition],
    queryFn: () => executeQuery(queryDefinition),
    enabled: !!selectedTableName && !!connectionId,
    staleTime: 0, // Always refetch when definition changes
  });

  // --- Handlers ---

  const handleToggleColumn = (columnName: string, isChecked: boolean) => {
    setOffset(0);
    setSelectedColumns(prev => {
      if (columnName === '*') {
        // If toggling 'Select All'
        return isChecked ? ['*'] : [];
      }
      
      // If toggling an individual column
      let current = prev.includes('*') ? [] : prev;

      if (isChecked) {
        // Add column
        return [...current, columnName];
      } else {
        // Remove column
        const newCols = current.filter(c => c !== columnName);
        // If removing the last selected column, default back to '*'
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

  const handleExecuteQuery = () => {
    if (!selectedTableName) {
      toast.warning("Please select a table first.");
      return;
    }
    setOffset(0); // Reset offset on manual execution
    executeQueryRefetch();
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    executeQueryRefetch();
  };

  // --- Error/Loading States ---

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

  // --- Render UI ---

  return (
    <Layout>
      <div className="space-y-8">
        <Card className="shadow-xl rounded-2xl border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-2xl border-b p-4">
            <CardTitle className="text-3xl font-extrabold text-primary flex items-center">
              <Search className="w-6 h-6 mr-3" /> Query Builder: {connection.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* 1. Table Selection */}
            <div className="space-y-3">
              <h4 className="text-xl font-semibold flex items-center text-foreground">
                <TableIcon className="w-5 h-5 mr-2 text-accent-foreground" /> Select Primary Table
              </h4>
              <Select
                value={selectedTableName}
                onValueChange={(val) => setSelectedTableName(val)}
              >
                <SelectTrigger className="w-full md:w-1/2 rounded-xl py-6 text-base border-2 focus:ring-primary transition-colors">
                  <SelectValue placeholder="Choose a table..." />
                </SelectTrigger>
                <SelectContent>
                  {metadata?.tables.map(table => (
                    <SelectItem key={table.name} value={table.name}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Join Conditions */}
            {currentTable && (
              <div className="space-y-4 p-4 border rounded-xl bg-secondary/30">
                <h4 className="text-xl font-semibold flex items-center text-foreground">
                  <Link className="w-5 h-5 mr-2 text-accent-foreground" /> Join Tables
                </h4>
                
                {joins.length === 0 ? (
                  <Button onClick={handleAddJoin} variant="outline" className="rounded-xl border-dashed border-primary/50 text-primary hover:bg-primary/10">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Join Clause
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {joins.map((join) => (
                      <JoinClauseRow
                        key={join.id}
                        join={join}
                        allTables={metadata?.tables || []}
                        primaryTableColumns={allColumnNames}
                        onChange={handleJoinChange}
                        onRemove={handleRemoveJoin}
                      />
                    ))}
                    <Button onClick={handleAddJoin} variant="outline" size="sm" className="rounded-xl border-dashed border-primary/50 text-primary hover:bg-primary/10">
                        <PlusCircle className="w-4 h-4 mr-2" /> Add Another Join
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* 3. Column Selection */}
            {currentTable && (
              <div className="space-y-3 p-4 border rounded-xl bg-secondary/30">
                <h4 className="text-xl font-semibold flex items-center text-foreground">
                  <Columns className="w-5 h-5 mr-2 text-accent-foreground" /> Choose Columns
                </h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedColumns.includes('*')}
                      onCheckedChange={(checked) => handleToggleColumn('*', !!checked)}
                      className="rounded-md data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <Label htmlFor="select-all" className="font-medium text-base">
                      Select All (*)
                    </Label>
                  </div>
                  
                  {allColumnNames.map(col => (
                    <div key={col} className="flex items-center space-x-2" title={`Type: ${allColumnMetadata.find(c => c.name === col)?.dataType}`}>
                      <Checkbox
                        id={`col-${col}`}
                        checked={selectedColumns.includes(col) && !selectedColumns.includes('*')}
                        onCheckedChange={(checked) => handleToggleColumn(col, !!checked)}
                        className="rounded-md data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <Label htmlFor={`col-${col}`} className="text-sm">
                        {col}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Filter Conditions */}
            {currentTable && (
              <div className="space-y-4 p-4 border rounded-xl bg-secondary/30">
                <h4 className="text-xl font-semibold flex items-center text-foreground">
                  <Filter className="w-5 h-5 mr-2 text-accent-foreground" /> Filter Conditions
                </h4>
                
                {filters.length === 0 ? (
                  <Button onClick={handleAddFilter} variant="outline" className="rounded-xl border-dashed border-primary/50 text-primary hover:bg-primary/10">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add First Condition
                  </Button>
                ) : (
                  <div className="space-y-2">
                    {filters.map((condition, index) => (
                      <FilterConditionRow
                        key={condition.id}
                        condition={condition}
                        columns={allColumnMetadata}
                        index={index}
                        totalConditions={filters.length}
                        onChange={handleFilterChange}
                        onRemove={handleRemoveFilter}
                        onAdd={handleAddFilter}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Execute Button */}
            <Button 
              onClick={handleExecuteQuery} 
              disabled={!selectedTableName || isExecutingQuery}
              className="w-full rounded-xl py-6 text-lg font-bold bg-destructive hover:bg-destructive/90 transition-all shadow-lg"
            >
              {isExecutingQuery ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Executing Query...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" /> Execute Query
                </>
              )}
            </Button>

            {/* 6. Results Display */}
            {queryResult && (
              <div className="mt-8">
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