export type DatabaseType = "PostgreSQL" | "MySQL" | "SQL Server" | "SQLite";

export interface ConnectionDetails {
  id: string;
  name: string;
  type: DatabaseType;
  database: string;
}

export interface ColumnMetadata {
  name: string;
  dataType: string;
  isNullable: boolean;
}

export interface TableMetadata {
  name: string;
  columns: ColumnMetadata[];
}

export interface DatabaseMetadata {
  tables: TableMetadata[];
}

export type Operator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IN" | "NOT IN";
export type LogicalOperator = "AND" | "OR";

export interface SubqueryDefinition {
  tableName: string;
  column: string;
  filters: FilterCondition[]; // NEW: Added WHERE clause support for subqueries
}

export interface FilterCondition {
  id: string;
  column: string;
  operator: Operator;
  value: string;
  valueType: 'literal' | 'subquery';
  subquery?: SubqueryDefinition;
  logicalOperator: LogicalOperator;
}

export type JoinType = "INNER JOIN" | "LEFT JOIN" | "RIGHT JOIN" | "FULL OUTER JOIN";

export interface JoinClause {
  id: string;
  joinType: JoinType;
  sourceTable: string;
  targetTable: string;
  sourceColumn: string;
  targetColumn: string;
}

export type SortOrder = "ASC" | "DESC";

export interface OrderByClause {
  id: string;
  column: string;
  order: SortOrder;
}

export interface GroupByClause {
  id: string;
  column: string;
}

export interface QueryDefinition {
  connectionId: string;
  tableName: string;
  joins: JoinClause[];
  columns: string[];
  filters: FilterCondition[];
  orderBy: OrderByClause[];
  groupBy: GroupByClause[];
  limit: number;
  offset: number;
}

export interface QueryResult {
  columns: string[];
  data: Record<string, any>[];
  totalRows: number;
}