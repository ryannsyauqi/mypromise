import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const validUser = process.env.ADMIN_USERNAME || 'adminhq';
    const validPwd = process.env.ADMIN_PASSWORD || 'mypromise2024';

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
