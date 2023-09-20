import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getProject } from './services/project';
import { TProject } from './types';

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|icons).*)'
    ]
}

function isErrorProject(data: TErrorResponse|{project:TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export async function middleware(request: NextRequest) {
    const tokenCookie = request.cookies.get(process.env.SESSION_COOKIE_NAME as string);
    if (!tokenCookie) {
        return NextResponse.redirect(new URL(process.env.URL_ACCOUNT as string, request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-AppFrame-Access-Token', tokenCookie.value);

    const dataProject = await getProject(requestHeaders);
    if (isErrorProject(dataProject)) {
        return NextResponse.redirect(new URL(process.env.URL_ACCOUNT as string, request.url));
    }
    const {trialFinishedAt, planFinishedAt} = dataProject.project;

    const trialFinishedAtTimestamp = new Date(trialFinishedAt).getTime();
    const planFinishedAtTimestamp = new Date(planFinishedAt).getTime();

    const now = Date.now();
    if (now > trialFinishedAtTimestamp) {
        if (now > planFinishedAtTimestamp) {
            const pathPricing = '/access_account/pricing';
            if (request.nextUrl.pathname !== pathPricing) {
                return NextResponse.redirect(new URL(pathPricing, request.url));
            }
        }
    }

    return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
    });
}
