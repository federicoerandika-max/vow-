export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getWeddingConfig } from '@/config/loader';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId') || 'default';
    
    const config = getWeddingConfig(coupleId);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading config:', error);
    return NextResponse.json(
      { error: 'Configuration not found' },
      { status: 404 }
    );
  }
}
