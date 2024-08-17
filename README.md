[sharptimer-web-panel](https://github.com/Letaryat/sharptimer-web-panel) by [Letaryat](https://github.com/Letaryat) remade in [Next.js](https://nextjs.org/)

[DEMO!!](https://affinitycs2.com/sharptimer) The demo doesnt represent this repository, its for my own server/website.

- Without Server Info Enabled ![preview](https://i.imgur.com/HYoNVq8.png)

- With Server Info Enabled ![preview](https://i.imgur.com/ozHcIXF.png)


## Installation
- Rename .env.template to .env and input your database credentials,
```
APP_TITLE=SharpTimer

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
DB_PORT=3306

STEAM_API_KEY=

NEXT_PUBLIC_ENABLE_SERVER_INFO=true

DEFAULT_SURF_MAP=beginner
DEFAULT_BHOP_MAP=arcane
```

- Navagate to /app/configs/servers.ts and input your server info

```
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
```


- Run ``` npm install --force```
- Run ``` npm run build ```
- Run ``` npm run start ```

## Alternative
- Just fork the repository and use vercel and import the environment variables.