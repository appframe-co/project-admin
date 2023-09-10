import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure } from '@/types';
import { getStructures } from '@/services/structures';
import styles from '@/styles/structures.module.css';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
  title: 'Structures | AppFrame'
}

export default async function Structures() {
  const {structures=[]}:{structures: TStructure[]} = await getStructures();

  return (
    <div className='page'>
        <Topbar title='Structures'>
            <Link href={'/structures/new'}>New structure</Link>
        </Topbar>

        <div className={styles.containers}>
            {structures.map(structure => (
                <div key={structure.id}><Link href={'structures/'+structure.id}>{structure.name}</Link></div>
            ))}
        </div>              
    </div>
  )
}
