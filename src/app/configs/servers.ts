export interface ServerConfig {
    name: string;
    host: string;
    port: number;
    type: 'surf' | 'bhop';
  }
  
  export const servers: ServerConfig[] = [
    {
      name: 'Affinity CS2 BHop #1',
      host: '104.230.100.178',
      port: 27025,
      type: 'bhop'
    },
    {
        name: 'Affinity CS2 BHop #2',
      host: '104.230.100.178',
      port: 27026,
      type: 'bhop'
    },
    {
      name: 'Dead Example',
      host: 'bhop1.example.com',
      port: 27017,
      type: 'surf'
    },
  ];