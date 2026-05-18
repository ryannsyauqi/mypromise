import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSystemSettings } from '@/lib/settings';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const settings = getSystemSettings();

    const validUser = settings.adminUsername || process.env.ADMIN_USERNAME || 'admin';
    const validPwd = settings.adminPassword || process.env.ADMIN_PASSWORD || 'password123';

    if (username === validUser && password === validPwd) {
      // Set secure HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Username atau password salah' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
