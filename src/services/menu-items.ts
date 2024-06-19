import { headers } from 'next/headers'

export async function getMenuItems(menuId: string, {page=1, limit=10, parentId}: {page:number, limit:number, parentId?:string|undefined}) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    let q = `menuId=${menuId}&page=${page}&limit=${limit}`;
    if (parentId) {
      q += `&parentId=${parentId}`;
    }

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/menu_items?${q}`, {
      method: 'GET',
      headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch items');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getMenuItemsCount(menuId: string) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/menu_items/count?menuId=${menuId}`, {
      method: 'GET',
      headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch items');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getMenuItem(id: string, menuId: string) {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/menu_items/${id}?menuId=${menuId}`, {
    method: 'GET',
    headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
      throw new Error('Failed to fetch items');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}