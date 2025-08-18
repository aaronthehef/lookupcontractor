// TypeScript declarations for database module

export interface QueryResult {
  rows: any[]
  rowCount?: number
  insertId?: number
}

export interface Pool {
  query: (sql: string, params?: any[]) => Promise<QueryResult>
}

export declare const executeQuery: (sql: string, params?: any[], retries?: number) => Promise<QueryResult>
export declare const pool: Pool