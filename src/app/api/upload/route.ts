export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { put } from '@vercel/blob';

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

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN is not set. Video upload requires Vercel Blob storage.' },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    const coupleId = formData.get('coupleId') as string || 'default';
    const lang = formData.get('lang') as string || 'it';

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: mp4, webm, mov` },
        { status: 400 }
      );
    }

    // Max 100MB
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB.' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const ext = file.name.split('.').pop() || 'mp4';
    const blobKey = `wedding-uploads/${coupleId}/video-${lang}.${ext}`;

    const blob = await put(blobKey, file, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      path: blob.url,       // Full public URL from Vercel Blob
      filename: `video-${lang}.${ext}`,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
