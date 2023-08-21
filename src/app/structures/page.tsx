import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Structures | AppFrame'
}

async function getStructures() {
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

    const {data} = await res.json();
    return data;
  } catch (e) {
    return [];
  }
}

type Structure = {
  id: string;
  name: string;
}

export default async function Structures() {
  const {structures=[]}:{structures:Structure[]} = await getStructures();

  return (
      <>
          <main>
              <p>Structures</p>
              <p>
                  <Link href={'new'}>New structure</Link>
              </p>
              {structures.map(structure => (
                  <div key={structure.id}><Link href={'structures/'+structure.id}>{structure.name}</Link></div>
              ))}
          </main>
      </>
  )
}
