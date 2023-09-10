import { cookies } from 'next/headers'

export function getToken(): string|undefined {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get(process.env.SESSION_COOKIE_NAME as string);
    if (!tokenCookie) {
        return;
    }

    return tokenCookie.value;
}