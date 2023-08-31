import { NextResponse } from 'next/server'
import { getToken } from '@/lib/token'
import { cookies } from 'next/headers'

export async function PUT(req: Request) {
    try {
        const cookieStore = cookies();

        const cipherToken = cookieStore.get(process.env.SESSION_COOKIE_NAME as string);
        if (!cipherToken) {
            throw new Error();
        }
        const token = getToken(cipherToken.value);

        const body = await req.json();
        const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/project/${body.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: token || ''
            }, 
            body: JSON.stringify(body)
        });
        const data = await res.json();

        return NextResponse.json(data);
    } catch (e) {
        NextResponse.json({ error: 'failed to fetch data' }, { status: 500 });
    }
}