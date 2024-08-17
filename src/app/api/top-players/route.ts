import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import axios from 'axios';
import { RowDataPacket } from 'mysql2';

async function fetchSteamAvatars(steamIds: string[]) {
  const steamApiKey = process.env.STEAM_API_KEY;
  if (!steamApiKey) {
    console.error('Steam API key is not set');
    return {};
  }

  try {
    const response = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamIds.join(',')}`);
    const players = response.data.response.players;
    return players.reduce((acc: { [key: string]: string }, player: { steamid: string; avatarmedium: string }) => {
      acc[player.steamid] = player.avatarmedium;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching Steam avatars:', error);
    return {};
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const map = searchParams.get('map');

  if (!map) {
    return NextResponse.json({ error: 'Map parameter is required' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM PlayerRecords WHERE MapName = ? ORDER BY TimerTicks ASC LIMIT 10',
      [map]
    );

    const steamIds = rows.map((row) => row.SteamID);
    const avatars = await fetchSteamAvatars(steamIds);

    const playersWithAvatars = rows.map((player: any) => ({
      ...player,
      SteamAvatar: avatars[player.SteamID] || ''
    }));

    return NextResponse.json(playersWithAvatars);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}