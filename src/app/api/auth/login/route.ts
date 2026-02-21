import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Hash pre-generato per password "admin" (usare npm run generate-password per generarne uno nuovo)
const DEFAULT_ADMIN_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_HASH;

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

    // Verifica password
    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      // Fallback: se bcrypt fallisce, prova con password semplice per sviluppo
      if (process.env.NODE_ENV === 'development' && password === 'admin') {
        isValid = true;
      }
    }
    
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
