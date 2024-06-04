import { NextResponse } from 'next/server'
import { getToken } from '@/lib/token'

export async function GET(req: Request) {
    try {
        const token = getToken();
        if (!token) {
            return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const structureId = searchParams.get('structureId');
        const parentId = searchParams.get('parentId');
        const page = searchParams.get('page') ?? 1;
        const limit = searchParams.get('limit') ?? 10;

        let url = `${process.env.URL_PROJECT_ADMIN_API}/api/sections?structureId=${structureId}&page=${page}&limit=${limit}`;
        if (parentId) {
            url += `&parentId=${parentId}`;
        }
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AppFrame-Access-Token': token
            }
        });
        const data = await res.json();

        return NextResponse.json(data);
    } catch (e) {
        NextResponse.json({ error: 'failed to fetch data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = getToken();
        if (!token) {
            return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
        }

        const body = await req.json();
        const res = await fetch(process.env.URL_PROJECT_ADMIN_API + '/api/sections', {
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

        const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/sections/${body.id}`, {
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
        const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/sections/${id}`, {
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
