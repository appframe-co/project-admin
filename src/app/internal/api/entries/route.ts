import { NextResponse } from 'next/server'
import { getToken } from '@/lib/token'

export async function POST(req: Request) {
    try {
        const token = getToken();
        if (!token) {
            return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
        }

        const body = await req.json();
        const res = await fetch(process.env.URL_PROJECT_ADMIN_API + '/api/entries', {
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
        NextResponse.json({ error: 'failed to fetch entries' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const token = getToken();
        if (!token) {
            return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
        }

        const body = await req.json();

        const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries/${body.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-AppFrame-Access-Token': token
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
        const token = getToken();
        if (!token) {
            return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
        }

        const {id} = await req.json();
        const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-AppFrame-Access-Token': token
            }
        });
        const data = await res.json();

        return NextResponse.json(data);
    } catch (e) {
        NextResponse.json({ error: 'failed to fetch entries' }, { status: 500 });
    }
}
