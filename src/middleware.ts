import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated, getUser } from '@/lib/auth'

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}

export async function middleware(request: NextRequest) {
    const accessToken = isAuthenticated(request);
    if (!accessToken) {
        return NextResponse.redirect(new URL(process.env.URL_ACCOUNT as string, request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('authorization', accessToken);

    const {data} = await getUser(accessToken);
    if (data.error) {
        return NextResponse.redirect(new URL(process.env.URL_ACCOUNT as string, request.url));
    }

    return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
    });
}
