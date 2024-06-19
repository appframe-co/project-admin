import { headers } from 'next/headers'

export async function getSections(contentId: string, {page=1, limit=10, parentId}: {page:number, limit:number, parentId?:string|undefined}) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    let q = `contentId=${contentId}&page=${page}&limit=${limit}`;
    if (parentId) {
      q += `&parentId=${parentId}`;
    }

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/sections?${q}`, {
      method: 'GET',
      headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch sections');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getSectionsCount(contentId: string) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/sections/count?contentId=${contentId}`, {
      method: 'GET',
      headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch sections');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getSection(id: string, contentId: string) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/sections/${id}?contentId=${contentId}`, {
    method: 'GET',
    headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch sections');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}