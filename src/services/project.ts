import { headers } from 'next/headers'

export async function getProject() {
  try {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/project/`, {
    method: 'GET',
        headers: { authorization}
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getAccessTokenProject() {
  try {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/access-token/`, {
    method: 'GET',
        headers: { authorization}
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}