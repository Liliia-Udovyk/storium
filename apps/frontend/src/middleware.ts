import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/folders'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublic = request.nextUrl.pathname.startsWith('/auth');

  if (isProtected && !token) {
    const authUrl = new URL('/auth', request.url);
    authUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(authUrl);
  }

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
