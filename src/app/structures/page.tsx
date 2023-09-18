import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure } from '@/types';
import { getStructures } from '@/services/structures';
import styles from '@/styles/structures.module.css';
import { Topbar } from '@/components/topbar';
import { Button } from '@/ui/button';

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

        <div className={styles.table}>
          <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Entries</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
              {structures.map(structure => (
                <tr key={structure.id} className={styles.doc}>
                  <td>{structure.name}</td>
                  <td>10</td>
                  <td className={styles.actions}>
                    <Link href={'structures/'+structure.id}><Button>View</Button></Link>
                    <Link href={`structures/${structure.id}/edit`}><Button>Edit</Button></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>              
    </div>
  )
}
