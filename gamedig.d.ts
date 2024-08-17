declare module 'gamedig' {
    export interface QueryOptions {
      type: string;
      host: string;
      port: number;
      maxRetries: number;
      socketTimeout: number;
    }
  
    export interface QueryResult {
      name: string;
      map: string;
      players: Array<{ name: string }>;
      // Add other properties as needed
    }
  
    export class GameDig {
      static query(options: QueryOptions): Promise<QueryResult>;
    }
  }