import { NextResponse } from 'next/server';

// Simple in-memory cache
const avatarCache: Record<string, { url: string; timestamp: number }> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function convertSteamIDToSteamID64(steamID: string): string {
  // Trim whitespace and remove any non-alphanumeric characters
  const cleanedID = steamID.trim().replace(/[^a-zA-Z0-9:_\[\]]/g, '');

  // Check if it's already a SteamID64
  if (/^[0-9]{17}$/.test(cleanedID)) {
    return cleanedID;
  }

  // Handle SteamID format (STEAM_X:Y:Z)
  if (cleanedID.startsWith('STEAM_')) {
    const parts = cleanedID.split(':');
    if (parts.length === 3) {
      const accountID = BigInt(parts[2]) * BigInt(2) + BigInt(parts[1]);
      const steamID64 = accountID + BigInt(76561197960265728);
      return steamID64.toString();
    }
  }

  // Handle [U:1:X] format
  if (cleanedID.startsWith('[U:1:')) {
    const accountID = BigInt(cleanedID.slice(5, -1));
    const steamID64 = accountID + BigInt(76561197960265728);
    return steamID64.toString();
  }

  // If it's a number but not 17 digits, assume it's an account ID
  if (/^\d+$/.test(cleanedID)) {
    const accountID = BigInt(cleanedID);
    const steamID64 = accountID + BigInt(76561197960265728);
    return steamID64.toString();
  }

  // If we can't convert it, return the original ID
  console.warn(`Unable to convert Steam ID: ${steamID}`);
  return steamID;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamids = searchParams.get('steamids');

  if (!steamids) {
    return NextResponse.json({ error: 'Steam IDs are required' }, { status: 400 });
  }

  const STEAM_API_KEY = process.env.STEAM_API_KEY;
  if (!STEAM_API_KEY) {
    return NextResponse.json({ error: 'Steam API key is not configured' }, { status: 500 });
  }

  const steamIDList = steamids.split(',').map(id => id.trim()).filter(id => id !== '');
  const result: Record<string, string> = {};
  const uncachedIDs: string[] = [];

  // Check cache first
  for (const steamID of steamIDList) {
    const cachedAvatar = avatarCache[steamID];
    if (cachedAvatar && Date.now() - cachedAvatar.timestamp < CACHE_DURATION) {
      result[steamID] = cachedAvatar.url;
    } else {
      uncachedIDs.push(steamID);
    }
  }

  if (uncachedIDs.length > 0) {
    try {
      const steamID64s = uncachedIDs.map(id => {
        try {
          return convertSteamIDToSteamID64(id);
        } catch (error) {
          console.error(`Error converting Steam ID: ${id}`, error);
          return id; // Return the original ID if conversion fails
        }
      });

      const apiUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamID64s.join(',')}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const players = data.response.players;
      
      for (const player of players) {
        const originalID = uncachedIDs[steamID64s.indexOf(player.steamid)] || player.steamid;
        result[originalID] = player.avatarmedium;
        avatarCache[originalID] = { url: player.avatarmedium, timestamp: Date.now() };
      }
    } catch (error) {
      console.error('Error fetching Steam avatars:', error);
      return NextResponse.json({ error: 'Failed to fetch Steam avatars' }, { status: 500 });
    }
  }

  return NextResponse.json(result);
}