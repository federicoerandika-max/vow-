export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getWeddingConfig } from '@/config/loader';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId') || 'default';
    const config = await getWeddingConfig(coupleId);
    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error loading config:', error);
    return NextResponse.json(
      { error: error.message || 'Configuration not found' },
      { status: 404 }
    );
  }
}
