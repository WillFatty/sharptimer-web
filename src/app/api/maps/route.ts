import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type || (type !== 'surf' && type !== 'bhop')) {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT MapName FROM PlayerRecords WHERE MapName LIKE ? ORDER BY MapName',
      [`${type}%`]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}