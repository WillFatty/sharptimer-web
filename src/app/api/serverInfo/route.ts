import { NextResponse } from 'next/server';
import { servers } from '@/app/configs/servers';
import { GameDig } from 'gamedig';
;
interface ServerInfo {
  map: string;
  playerCount: number;
  players: string[];
}

interface ServerInfoMap {
  [serverName: string]: ServerInfo;
}

const cache: { [key: string]: { data: ServerInfo; timestamp: number } } = {};
const CACHE_DURATION = 30 * 1000; // 30 seconds

export const dynamic = 'force-dynamic';

export async function GET() {
  const serverInfo: ServerInfoMap = {};

  const fetchServerInfo = async (server: typeof servers[0]) => {
    const cachedData = cache[server.name];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return { [server.name]: cachedData.data };
    }

    try {
      const state = await GameDig.query({
        type: 'csgo',
        host: server.host,
        port: server.port,
        maxRetries: 1,
        socketTimeout: 100
      });

      const humanPlayers = state.players.filter(player =>
        player.name &&
        !player.name.startsWith('BOT') &&
        player.name.trim() !== ''
      );

      const info: ServerInfo = {
        map: state.map || 'Unknown',
        playerCount: humanPlayers.length,
        players: humanPlayers.map(player => player.name || '')
      };

      cache[server.name] = { data: info, timestamp: Date.now() };
      return { [server.name]: info };
    } catch (error) {
      console.error(`Error fetching info for ${server.name}:`, error);
      return {
        [server.name]: {
          map: 'Error',
          playerCount: 0,
          botCount: 0,
          players: []
        }
      };
    }
  };

  try {
    const results = await Promise.all(servers.map(fetchServerInfo));
    results.forEach(result => Object.assign(serverInfo, result));
  } catch (error) {
    console.error('Error fetching server info:', error);
  }

  return NextResponse.json(serverInfo);
}
