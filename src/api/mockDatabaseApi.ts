import { DatabaseMetadata, QueryDefinition, QueryResult, ColumnMetadata } from "@/types/database";

// --- Mock Data ---

const MOCK_USERS_COLUMNS: ColumnMetadata[] = [
  { name: "id", dataType: "INT", isNullable: false },
  { name: "username", dataType: "VARCHAR", isNullable: false },
  { name: "email", dataType: "VARCHAR", isNullable: false },
  { name: "created_at", dataType: "TIMESTAMP", isNullable: false },
  { name: "is_active", dataType: "BOOLEAN", isNullable: true },
];

const MOCK_PRODUCTS_COLUMNS: ColumnMetadata[] = [
  { name: "product_id", dataType: "INT", isNullable: false },
  { name: "name", dataType: "VARCHAR", isNullable: false },
  { name: "price", dataType: "DECIMAL", isNullable: false },
  { name: "stock", dataType: "INT", isNullable: false },
];

const MOCK_METADATA: DatabaseMetadata = {
  tables: [
    { name: "users", columns: MOCK_USERS_COLUMNS },
    { name: "products", columns: MOCK_PRODUCTS_COLUMNS },
    { name: "orders", columns: [{ name: "order_id", dataType: "INT", isNullable: false }, { name: "user_id", dataType: "INT", isNullable: false }] },
  ],
};

const MOCK_USER_DATA = [
  { id: 1, username: "alice", email: "alice@example.com", created_at: "2023-01-15", is_active: true },
  { id: 2, username: "bob", email: "bob@example.com", created_at: "2023-02-20", is_active: true },
  { id: 3, username: "charlie", email: "charlie@example.com", created_at: "2023-03-10", is_active: false },
  { id: 4, username: "david", email: "david@example.com", created_at: "2023-04-01", is_active: true },
  { id: 5, username: "eve", email: "eve@example.com", created_at: "2023-05-05", is_active: false },
  { id: 6, username: "frank", email: "frank@example.com", created_at: "2023-06-10", is_active: true },
  { id: 7, username: "grace", email: "grace@example.com", created_at: "2023-07-15", is_active: true },
  { id: 8, username: "heidi", email: "heidi@example.com", created_at: "2023-08-20", is_active: false },
  { id: 9, username: "ivan", email: "ivan@example.com", created_at: "2023-09-01", is_active: true },
  { id: 10, username: "judy", email: "judy@example.com", created_at: "2023-10-05", is_active: true },
  { id: 11, username: "kyle", email: "kyle@example.com", created_at: "2023-11-10", is_active: false },
  { id: 12, username: "lisa", email: "lisa@example.com", created_at: "2023-12-15", is_active: true },
];

// --- API Functions ---

/**
 * Simulates fetching database metadata (tables and columns) for a given connection.
 * @param connectionId The ID of the active connection.
 */
export const fetchDatabaseMetadata = (connectionId: string): Promise<DatabaseMetadata> => {
  console.log(`[Mock API] Fetching metadata for connection: ${connectionId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_METADATA);
    }, 800);
  });
};

/**
 * Simulates executing a query defined by the user.
 * @param query The structured query definition.
 */
export const executeQuery = (query: QueryDefinition): Promise<QueryResult> => {
  console.log(`[Mock API] Executing query on table: ${query.tableName}`);
  
  if (query.joins && query.joins.length > 0) {
    console.warn(`[Mock API] Joins detected (${query.joins.length}). Mock API currently ignores join logic and returns only primary table data.`);
  }
  if (query.groupBy && query.groupBy.length > 0) {
    console.warn(`[Mock API] GROUP BY detected (${query.groupBy.length}). Mock API currently ignores grouping logic.`);
  }
  if (query.orderBy && query.orderBy.length > 0) {
    console.warn(`[Mock API] ORDER BY detected (${query.orderBy.length}). Mock API currently ignores ordering logic.`);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      let data = MOCK_USER_DATA;
      
      // Simple mock filtering logic (only supports '=' operator on 'id' for demonstration)
      if (query.tableName === 'users' && query.filters.length > 0) {
        query.filters.forEach(filter => {
          if (filter.column === 'id' && filter.operator === '=') {
            const targetId = parseInt(filter.value);
            data = data.filter(row => row.id === targetId);
          }
        });
      }

      // Pagination
      const totalRows = data.length;
      const paginatedData = data.slice(query.offset, query.offset + query.limit);

      // Column selection
      const selectedColumns = query.columns.includes('*') 
        ? Object.keys(MOCK_USER_DATA[0] || {}) 
        : query.columns;

      const filteredData = paginatedData.map(row => {
        const newRow: Record<string, any> = {};
        selectedColumns.forEach(col => {
          if (row.hasOwnProperty(col)) {
            newRow[col] = row[col];
          }
        });
        return newRow;
      });

      const result: QueryResult = {
        columns: selectedColumns,
        data: filteredData,
        totalRows: totalRows,
      };
      
      resolve(result);
    }, 1500);
  });
};