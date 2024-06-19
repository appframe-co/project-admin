import { headers } from 'next/headers'

export async function getContents() {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(process.env.URL_PROJECT_ADMIN_API+'/api/contents', {
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

export async function getContent(id: string) {
    try {
      const accessToken = headers().get('X-AppFrame-Access-Token') as string;
  
      const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/contents/${id}`, {
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