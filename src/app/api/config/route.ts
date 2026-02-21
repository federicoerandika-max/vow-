import { NextResponse } from 'next/server';
import { getWeddingConfig } from '@/config/loader';

export async function GET() {
  try {
    const config = getWeddingConfig('default');
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading config:', error);
    return NextResponse.json(
      { error: 'Configuration not found' },
      { status: 404 }
    );
  }
}
