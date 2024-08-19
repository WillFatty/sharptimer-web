import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const VALID_TYPES = new Set(['surf', 'bhop']);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT MapName FROM PlayerRecords WHERE MapName LIKE ? ORDER BY MapName LIMIT 1000',
      [`${type}%`]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
