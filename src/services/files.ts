import { headers } from 'next/headers'

export async function getFiles({page=1, limit=10}: {page:number, limit:10}) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/files?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getFilesCount() {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/files/count`, {
      method: 'GET',
      headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch files');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}