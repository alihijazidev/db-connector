// --- Mock Data ---

const MOCK_USERS_COLUMNS = [
  { name: "id", dataType: "INT", isNullable: false },
  { name: "username", dataType: "VARCHAR", isNullable: false },
  { name: "email", dataType: "VARCHAR", isNullable: false },
  { name: "created_at", dataType: "TIMESTAMP", isNullable: false },
  { name: "is_active", dataType: "BOOLEAN", isNullable: true },
];

const MOCK_PRODUCTS_COLUMNS = [
  { name: "product_id", dataType: "INT", isNullable: false },
  { name: "name", dataType: "VARCHAR", isNullable: false },
  { name: "price", dataType: "DECIMAL", isNullable: false },
  { name: "stock", dataType: "INT", isNullable: false },
];

const MOCK_ORDERS_COLUMNS = [
  { name: "order_id", dataType: "INT", isNullable: false },
  { name: "user_id", dataType: "INT", isNullable: false },
  { name: "product_id", dataType: "INT", isNullable: false },
  { name: "quantity", dataType: "INT", isNullable: false },
  { name: "order_date", dataType: "TIMESTAMP", isNullable: false },
];

const MOCK_METADATA = {
  tables: [
    { name: "users", columns: MOCK_USERS_COLUMNS },
    { name: "products", columns: MOCK_PRODUCTS_COLUMNS },
    { name: "orders", columns: MOCK_ORDERS_COLUMNS },
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
];

const MOCK_PRODUCT_DATA = [
  { product_id: 101, name: "Laptop Pro", price: 1200, stock: 15 },
  { product_id: 102, name: "Smartphone X", price: 800, stock: 30 },
  { product_id: 103, name: "Wireless Buds", price: 150, stock: 100 },
];

const MOCK_ORDER_DATA = [
  { order_id: 1, user_id: 1, product_id: 101, quantity: 1, order_date: "2023-10-01" },
  { order_id: 2, user_id: 1, product_id: 103, quantity: 2, order_date: "2023-10-05" },
  { order_id: 3, user_id: 2, product_id: 102, quantity: 1, order_date: "2023-10-10" },
  { order_id: 4, user_id: 4, product_id: 101, quantity: 1, order_date: "2023-11-12" },
  { order_id: 5, user_id: 6, product_id: 102, quantity: 3, order_date: "2023-11-20" },
];

export const fetchDatabaseMetadata = (connectionId) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_METADATA), 600);
  });
};

export const executeQuery = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let sourceData = [];
      if (query.tableName === 'users') sourceData = MOCK_USER_DATA;
      else if (query.tableName === 'products') sourceData = MOCK_PRODUCT_DATA;
      else if (query.tableName === 'orders') sourceData = MOCK_ORDER_DATA;

      let filteredData = [...sourceData];

      if (query.filters && query.filters.length > 0) {
        query.filters.forEach(filter => {
          if (filter.valueType === 'subquery' && filter.column === 'id' && filter.subquery?.tableName === 'orders') {
            const userIdsWithOrders = Array.from(new Set(MOCK_ORDER_DATA.map(o => o.user_id)));
            filteredData = filteredData.filter(row => userIdsWithOrders.includes(row.id));
          } 
          else if (filter.valueType === 'literal' && filter.value) {
            const val = filter.value.toLowerCase();
            filteredData = filteredData.filter(row => {
              const rowVal = String(row[filter.column] || '').toLowerCase();
              if (filter.operator === '=') return rowVal === val;
              if (filter.operator === 'LIKE') return rowVal.includes(val);
              return true;
            });
          }
        });
      }

      const columnsToReturn = query.columns.includes('*') 
        ? (filteredData.length > 0 ? Object.keys(filteredData[0]) : [])
        : query.columns.map(c => c.includes('.') ? c.split('.')[1] : c);

      const finalData = filteredData.slice(query.offset, query.offset + query.limit).map(row => {
        const newRow = {};
        columnsToReturn.forEach(col => {
          newRow[col] = row[col];
        });
        return newRow;
      });

      resolve({
        columns: columnsToReturn,
        data: finalData,
        totalRows: filteredData.length,
      });
    }, 1000);
  });
};