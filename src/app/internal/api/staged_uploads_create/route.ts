import { NextResponse } from 'next/server'
import { getToken } from '@/lib/token'

export async function POST(req: Request) {
    try {
        const token = getToken();
        if (!token) {
            return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
        }

        const body = await req.json();
        const res = await fetch(process.env.URL_PROJECT_ADMIN_API + '/api/staged_uploads_create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AppFrame-Access-Token': token
            }, 
            body: JSON.stringify(body)
        });
        const data = await res.json();

        return NextResponse.json(data);
    } catch (e) {
        NextResponse.json({ error: 'failed to fetch data' }, { status: 500 });
    }
}