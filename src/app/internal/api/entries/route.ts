import { NextResponse } from 'next/server'
import { getToken } from '@/lib/token'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const cookieStore = cookies()

        const cipherToken = cookieStore.get(process.env.SESSION_COOKIE_NAME as string);
        if (!cipherToken) {
            throw new Error();
        }
        const token = getToken(cipherToken.value);

        const body = await req.json();
        const res = await fetch(process.env.URL_PROJECT_ADMIN_API + '/api/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: token || ''
            }, 
            body: JSON.stringify(body)
        });
        const data = await res.json();

        return NextResponse.json(data);
    } catch (e) {
        NextResponse.json({ error: 'failed to fetch entries' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const cookieStore = cookies();

        const cipherToken = cookieStore.get(process.env.SESSION_COOKIE_NAME as string);
        if (!cipherToken) {
            throw new Error();
        }
        const token = getToken(cipherToken.value);

        const body = await req.json();

        const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries/${body.id}`, {
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
        NextResponse.json({ error: 'failed to fetch entries' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const cookieStore = cookies();

        const cipherToken = cookieStore.get(process.env.SESSION_COOKIE_NAME as string);
        if (!cipherToken) {
            throw new Error();
        }
        const token = getToken(cipherToken.value);

        const {id} = await req.json();
        const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: token || ''
            }
        });
        const data = await res.json();

        return NextResponse.json(data);
    } catch (e) {
        NextResponse.json({ error: 'failed to fetch entries' }, { status: 500 });
    }
}
