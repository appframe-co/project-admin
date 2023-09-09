import { headers } from 'next/headers'

export async function getEntries(structureId: string) {
  try {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries?structureId=${structureId}`, {
    method: 'GET',
      headers: { authorization}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch entries');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getEntry(id: string, structureId: string) {
  try {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries/${id}?structureId=${structureId}`, {
    method: 'GET',
      headers: { authorization}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch entries');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}