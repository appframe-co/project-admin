import { headers } from 'next/headers'

export async function getEntries(contentId: string, {page=1, limit=20, sectionId}: {page:number, limit:number, sectionId?:string|null}) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    let q = `contentId=${contentId}&page=${page}&limit=${limit}`;
    if (sectionId) {
      q += `&sectionId=${sectionId}`;
    }

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries?${q}`, {
      method: 'GET',
      headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch entries');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getEntriesCount(contentId: string) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries/count?contentId=${contentId}`, {
      method: 'GET',
      headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch entries');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getEntry(id: string, contentId: string) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/entries/${id}?contentId=${contentId}`, {
    method: 'GET',
    headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch entries');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}