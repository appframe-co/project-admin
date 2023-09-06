import { headers } from 'next/headers'

export async function getDataList(structureId: string) {
  try {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/data?structureId=${structureId}`, {
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

export async function getData(id: string, structureId: string) {
  try {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/data/${id}?structureId=${structureId}`, {
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