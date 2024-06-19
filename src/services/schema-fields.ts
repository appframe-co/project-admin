import { headers } from 'next/headers'

export async function getSchemaFields() {
    try {
      const accessToken = headers().get('X-AppFrame-Access-Token') as string;
  
      const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/schema_fields`, {
        method: 'GET',
        headers: { 'X-AppFrame-Access-Token': accessToken}
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