import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}

export async function middleware(request: NextRequest) {
    const tokenCookie = request.cookies.get(process.env.SESSION_COOKIE_NAME as string);
    if (!tokenCookie) {
        return NextResponse.redirect(new URL(process.env.URL_ACCOUNT as string, request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-AppFrame-Access-Token', tokenCookie.value);

    return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
    });
}
