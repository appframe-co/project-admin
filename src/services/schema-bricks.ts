import { headers } from 'next/headers'

export async function getSchemaBricks() {
    try {
      const headersInstance = headers();
      const authorization = headersInstance.get('authorization') as string;
  
      const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/schema_bricks`, {
        method: 'GET',
          headers: { authorization}
        }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
  
      return res.json();
    } catch (e) {
      return [];
    }
  }