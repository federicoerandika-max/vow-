export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getAllWeddingConfigs } from '@/config/loader';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  try {
    const token = authHeader.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const configs = getAllWeddingConfigs();
    return NextResponse.json({ configs });
  } catch (error) {
    console.error('Error listing configs:', error);
    return NextResponse.json(
      { error: 'Failed to list configurations' },
      { status: 500 }
    );
  }
}
