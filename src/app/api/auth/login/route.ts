export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Read plain-text admin password from env, or default to 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }

    // Verifica password con confronto diretto
    const isValid = password === ADMIN_PASSWORD;
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Genera token JWT
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
