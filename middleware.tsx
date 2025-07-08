import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/home', '/calculator','/profile'];
export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        if (!session) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    return NextResponse.next();
}
export const config = {
    matcher: ['/home/:path*', '/calculator/:path*','/profile/:path*'],
};
