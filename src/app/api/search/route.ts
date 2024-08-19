import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 3) {
    return NextResponse.json({ error: 'Search query must be at least 3 characters long' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      `SELECT PR.SteamID, PR.PlayerName, PR.FormattedTime, PR.MapName,
      (SELECT COUNT(*) + 1 FROM PlayerRecords PR2 WHERE PR2.MapName = PR.MapName AND PR2.TimerTicks < PR.TimerTicks) AS \`Rank\`
      FROM PlayerRecords PR
      WHERE PR.PlayerName LIKE ? OR PR.SteamID LIKE ?
      ORDER BY PR.MapName, PR.TimerTicks
      LIMIT 100`,
      [`%${query}%`, `%${query}%`]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
