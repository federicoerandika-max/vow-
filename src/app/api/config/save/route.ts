export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { saveWeddingConfig } from '@/config/loader';
import { WeddingConfig } from '@/types/wedding';
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

export async function POST(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { coupleId, config } = body as { coupleId: string; config: WeddingConfig };

    if (!coupleId || !config) {
      return NextResponse.json(
        { error: 'Missing coupleId or config' },
        { status: 400 }
      );
    }

    await saveWeddingConfig(coupleId, config);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving config:', error);
    const message = error.message || 'Failed to save configuration';
    const status = message.includes('not supported') ? 403 : 500;
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
