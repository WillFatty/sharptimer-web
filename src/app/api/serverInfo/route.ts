import { NextRequest, NextResponse } from 'next/server';
import { servers } from '@/app/configs/servers';

const CS2_BOT_NAMES = [
  "Vitaliy", "Minh", "Yoshiro", "Zach", "Cory", "Nate", "Quinn", "Wade", "Vinny", "Chet",
  "Ringo", "Quade", "Zane", "Xander", "Yahn", "Xiao", "Yanni", "Zim", "Yogi", "Zach",
  "Albert", "Bert", "Charlie", "Dave", "Eric", "Frank", "Gary", "Henry", "Ian", "Jim",
  "Kevin", "Leon", "Martin", "Noel", "Opie", "Paul", "Quentin", "Richard", "Steve", "Ted",
  "Ulric", "Victor", "Wesley", "Xavier", "Yanni", "Zack", "Arnold", "Boris", "Cliffe", "Dustin",
  "Eaton", "Forest", "Gabe", "Hank", "Ivan", "Jeff", "Kyle", "Lenny", "Moe", "Norm",
  "Orion", "Pat", "Quintin", "Rick", "Saul", "Tyler", "Uwe", "Vern", "Waldo", "Xander",
  "Yanni", "Zeke", "Sox", "Kask", "Maximus"
];

interface ServerInfo {
  map: string;
  playerCount: number;
  botCount: number;
  players: string[];
}

interface ServerInfoMap {
  [serverName: string]: ServerInfo;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('Received request for /api/serverInfo');
  const serverInfo: ServerInfoMap = {};

  try {
    console.log('Importing GameDig...');
    const { GameDig } = await import('gamedig');
    console.log('GameDig imported successfully');

    for (const server of servers) {
      try {
        const state = await GameDig.query({
          type: 'csgo',
          host: server.host,
          port: server.port,
          maxRetries: 1,
          socketTimeout: 100 // 0.5 second timeout
        });

        const humanPlayers = state.players.filter(player => 
          player.name && 
          !CS2_BOT_NAMES.includes(player.name) && 
          !player.name.startsWith('BOT') && 
          player.name.trim() !== ''
        );

        const botCount = state.players.length - humanPlayers.length;

        serverInfo[server.name] = {
          map: state.map || 'Unknown',
          playerCount: humanPlayers.length,
          botCount: botCount,
          players: humanPlayers.map(player => player.name || '')
        };
      } catch (error) {
        console.error(`Error fetching info for ${server.name}:`, error);
        serverInfo[server.name] = {
          map: 'Error',
          playerCount: 0,
          botCount: 0,
          players: []
        };
      }
    }
  } catch (error) {
    console.error('Error importing Gamedig:', error);
  }

  return NextResponse.json(serverInfo);
}