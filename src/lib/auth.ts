import type { NextRequest } from 'next/server'
import { getToken } from '@/lib/token'

export function isAuthenticated(req: NextRequest): string|null {
    const cipherToken = req.cookies.get(process.env.SESSION_COOKIE_NAME as string);
    if (!cipherToken) {
        return null;
    }
    return getToken(cipherToken.value);
}

export async function getUser(accessToken: string) {
    try {
        const res = await fetch(process.env.URL_USER_SERVICE+'/api/user', {
            headers: {
                authorization: accessToken
            }
        });
        return await res.json();
    } catch (e) {
        return null;
    }
}