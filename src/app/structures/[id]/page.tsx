import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Structure | AppFrame'
}

async function getStructure(id: string) {
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

export default async function Structures({ params }: { params: { id: string } }) {
  const {structure}:{structure:Structure} = await getStructure(params.id);

  return (
      <>
          <main>
              <p>Structure</p>
              <p>
                  <Link href={'/structures'}>Back</Link>
              </p>
              <div>
                <h2>{structure.name}</h2>
              </div>
          </main>
      </>
  )
}
