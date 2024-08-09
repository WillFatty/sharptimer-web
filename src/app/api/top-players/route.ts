import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const map = searchParams.get('map');

  if (!map) {
    return NextResponse.json({ error: 'Map parameter is required' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM PlayerRecords WHERE MapName = ? ORDER BY TimerTicks ASC LIMIT 10',
      [map]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}