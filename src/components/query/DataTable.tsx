import React from 'react';
import { QueryResult } from '@/types/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DataTableProps {
  result: QueryResult;
  limit: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ result, limit, offset, onPageChange }) => {
  const { columns, data, totalRows } = result;
  
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalRows / limit);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(offset - limit);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(offset + limit);
    }
  };

  if (data.length === 0) {
    return (
      <Alert className="rounded-xl border-yellow-500/50 bg-yellow-500/10">
        <Info className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-700">No Results Found</AlertTitle>
        <AlertDescription>
          The query returned an empty dataset. Try adjusting your filters or selecting a different table.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden">
      <CardHeader className="p-4 border-b bg-secondary/50">
        <CardTitle className="text-lg font-semibold">
          Query Results ({data.length} rows displayed / {totalRows} total)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10 sticky top-0">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col} className="font-bold text-primary whitespace-nowrap">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-secondary/30 transition-colors">
                {columns.map((col) => (
                  <TableCell key={col} className="text-sm">
                    {String(row[col] ?? 'NULL')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      {totalRows > limit && (
        <div className="p-4 border-t flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePrevious} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2 text-sm font-medium text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNext} 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};