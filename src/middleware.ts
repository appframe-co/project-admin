import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from '@/lib/token'

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}

export async function middleware(request: NextRequest) {
    const cipherTokenCookie = request.cookies.get(process.env.SESSION_COOKIE_NAME as string);
    if (!cipherTokenCookie) {
        return NextResponse.redirect(new URL(process.env.URL_ACCOUNT as string, request.url));
    }

    const accessToken = getToken(cipherTokenCookie.value);
    if (!accessToken) {
        return NextResponse.redirect(new URL(process.env.URL_ACCOUNT as string, request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('authorization', accessToken);

    return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
    });
}
