export type DatabaseType = "PostgreSQL" | "MySQL" | "SQL Server" | "SQLite";

export interface ConnectionDetails {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  // Note: Password is not stored/passed on the frontend state for security reasons, 
  // but is required for the initial connection attempt.
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

export interface FilterCondition {
  id: string;
  column: string;
  operator: Operator;
  value: string;
  logicalOperator: LogicalOperator; // Used for connecting this condition to the next one
}

export interface QueryDefinition {
  connectionId: string;
  tableName: string;
  columns: string[]; // '*' for all
  filters: FilterCondition[];
  limit: number;
  offset: number;
}

export interface QueryResult {
  columns: string[];
  data: Record<string, any>[];
  totalRows: number;
}