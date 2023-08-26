import { headers } from 'next/headers'

export async function getStructures() {
  try {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization') as string;

    const res = await fetch(process.env.URL_PROJECT_ADMIN_API+'/api/structures', {
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

export async function getStructure(id: string) {
    try {
      const headersInstance = headers();
      const authorization = headersInstance.get('authorization') as string;
  
      const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/structures/${id}`, {
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