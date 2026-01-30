import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, X, ArrowUp, ArrowDown, ListOrdered, Group } from 'lucide-react';
import { OrderByClause, GroupByClause, SortOrder } from '@/types/database';
import { cn } from '@/lib/utils';

interface SortAndGroupBuilderProps {
  allColumnNames: string[];
  orderBy: OrderByClause[];
  groupBy: GroupByClause[];
  onAddOrderBy: () => void;
  onRemoveOrderBy: (id: string) => void;
  onUpdateOrderBy: (clause: OrderByClause) => void;
  onAddGroupBy: () => void;
  onRemoveGroupBy: (id: string) => void;
  onUpdateGroupBy: (clause: GroupByClause) => void;
}

const SortAndGroupBuilder: React.FC<SortAndGroupBuilderProps> = ({
  allColumnNames,
  orderBy,
  groupBy,
  onAddOrderBy,
  onRemoveOrderBy,
  onUpdateOrderBy,
  onAddGroupBy,
  onRemoveGroupBy,
  onUpdateGroupBy,
}) => {

  // --- Order By Renderer ---
  const renderOrderBy = () => (
    <div className="space-y-3">
      {orderBy.map((clause, index) => (
        <div key={clause.id} className="flex items-center gap-3 p-3 border rounded-xl bg-background shadow-sm">
          <span className="text-sm font-medium text-muted-foreground w-6 text-center">{index + 1}.</span>
          
          {/* Column Selector */}
          <div className="flex-1 min-w-[150px]">
            <Select
              value={clause.column}
              onValueChange={(val) => onUpdateOrderBy({ ...clause, column: val })}
            >
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Select Column" />
              </SelectTrigger>
              <SelectContent>
                {allColumnNames.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Selector */}
          <div className="w-28">
            <Select
              value={clause.order}
              onValueChange={(val) => onUpdateOrderBy({ ...clause, order: val as SortOrder })}
            >
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">
                  <div className="flex items-center"><ArrowUp className="w-4 h-4 mr-2" /> ASC</div>
                </SelectItem>
                <SelectItem value="DESC">
                  <div className="flex items-center"><ArrowDown className="w-4 h-4 mr-2" /> DESC</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Remove Button */}
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={() => onRemoveOrderBy(clause.id)}
            className="rounded-full flex-shrink-0"
            title="Remove Sort"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button onClick={onAddOrderBy} variant="outline" className="rounded-xl border-dashed border-primary/50 text-primary hover:bg-primary/10">
        <PlusCircle className="w-4 h-4 mr-2" /> Add Sort Column
      </Button>
    </div>
  );

  // --- Group By Renderer ---
  const renderGroupBy = () => (
    <div className="space-y-3">
      {groupBy.map((clause) => (
        <div key={clause.id} className="flex items-center gap-3 p-3 border rounded-xl bg-background shadow-sm">
          
          {/* Column Selector */}
          <div className="flex-1 min-w-[150px]">
            <Select
              value={clause.column}
              onValueChange={(val) => onUpdateGroupBy({ ...clause, column: val })}
            >
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Select Column to Group By" />
              </SelectTrigger>
              <SelectContent>
                {allColumnNames.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remove Button */}
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={() => onRemoveGroupBy(clause.id)}
            className="rounded-full flex-shrink-0"
            title="Remove Group"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button onClick={onAddGroupBy} variant="outline" className="rounded-xl border-dashed border-primary/50 text-primary hover:bg-primary/10">
        <PlusCircle className="w-4 h-4 mr-2" /> Add Group By Column
      </Button>
      
      {groupBy.length > 0 && (
        <p className="text-sm text-yellow-700 bg-yellow-100 p-3 rounded-lg border border-yellow-300">
          Note: When using GROUP BY, you typically need to select aggregate functions (e.g., COUNT, SUM) in the 'Choose Columns' section.
        </p>
      )}
    </div>
  );

  return (
    <Tabs defaultValue="sort" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-secondary/50 p-1">
        <TabsTrigger value="sort" className="rounded-lg text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors">
          <ListOrdered className="w-4 h-4 mr-2" /> Sort (ORDER BY)
        </TabsTrigger>
        <TabsTrigger value="group" className="rounded-lg text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors">
          <Group className="w-4 h-4 mr-2" /> Group (GROUP BY)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sort" className="mt-4">
        {renderOrderBy()}
      </TabsContent>
      <TabsContent value="group" className="mt-4">
        {renderGroupBy()}
      </TabsContent>
    </Tabs>
  );
};

export default SortAndGroupBuilder;