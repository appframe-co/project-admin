import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';

export const metadata: Metadata = {
  title: 'Structure | AppFrame'
}

export default async function Structures({ params }: { params: { id: string } }) {
  const {structure}: {structure: TStructure} = await getStructure(params.id);

  return (
      <>
          <main>
              <p>Structure</p>
              <p>
                  <Link href={'/structures'}>Back</Link>
              </p>
              <p>
                  <Link href={`/structures/${params.id}/edit`}>Edit schema layer</Link>
              </p>
              <div>
                <h2>{structure.name}</h2>

                <p>DATA LAYER</p>
              </div>
          </main>
      </>
  )
}
