export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getWeddingConfig, getWeddingConfigBySlug } from '@/config/loader';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const coupleId = searchParams.get('coupleId') || 'default';

    let config;
    if (slug) {
      // Look up by couple slug (e.g. "erandika&federico")
      config = await getWeddingConfigBySlug(slug);
      if (!config) {
        return NextResponse.json(
          { error: `No wedding found for "${slug}"` },
          { status: 404 }
        );
      }
    } else {
      config = await getWeddingConfig(coupleId);
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error loading config:', error);
    return NextResponse.json(
      { error: error.message || 'Configuration not found' },
      { status: 404 }
    );
  }
}
