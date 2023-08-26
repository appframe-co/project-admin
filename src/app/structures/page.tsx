import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure } from '@/types';
import { getStructures } from '@/services/structures';

export const metadata: Metadata = {
  title: 'Structures | AppFrame'
}

export default async function Structures() {
  const {structures=[]}:{structures: TStructure[]} = await getStructures();

  return (
      <>
          <main>
              <p>Structures</p>
              <p>
                  <Link href={'/structures/new'}>New structure</Link>
              </p>
              {structures.map(structure => (
                  <div key={structure.id}><Link href={'structures/'+structure.id}>{structure.name}</Link></div>
              ))}
          </main>
      </>
  )
}
