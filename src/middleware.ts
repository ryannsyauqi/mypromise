import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Izinkan akses ke API auth
  if (path.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // Jika mencoba akses halaman admin
  if (path.startsWith('/admin')) {
    // Abaikan rute login itu sendiri agar tidak terjadi infinite loop
    if (path === '/admin/login') {
      return NextResponse.next();
    }

    const token = req.cookies.get('admin_token');

    // Jika tidak ada token (belum login), arahkan ke halaman login kustom
    if (!token || token.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika mencoba akses halaman login tapi sudah punya token, redirect ke dashboard
  if (path === '/admin/login') {
    const token = req.cookies.get('admin_token');
    if (token && token.value === 'authenticated') {
      const dashboardUrl = new URL('/admin', req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
