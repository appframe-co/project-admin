import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure, TEntry } from '@/types';
import { getStructure } from '@/services/structures';
import { getEntries } from '@/services/entries';
import styles from '@/styles/structure.module.css'
import { DeleteEntry } from '@/components/delete-entry';
import { Topbar } from '@/components/topbar';
import { resizeImg } from '@/utils/resize-img';
import { Button } from '@/ui/button';

export const metadata: Metadata = {
  title: 'Structure | AppFrame'
}


export default async function Structures({ params }: { params: { id: string } }) {
  const structurePromise = getStructure(params.id);
  const entriesPromise = getEntries(params.id);

  const [structureData, entriesData] = await Promise.all([structurePromise, entriesPromise]);

  const {structure}: {structure: TStructure} = structureData;
  const {entries, names, keys}: {entries: TEntry[], names: string[], keys: string[]} = entriesData;

  const values = entries.map(e => keys.map(k => e.doc[k]));

  return (
    <div className='page'>
      <Topbar title={structure.name}>
        <Link href={`/structures/${params.id}/new`}>Add entry</Link>
      </Topbar>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              {names.map((name: string, i: number) => (
                <th key={i}>{name}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {values.map((value: any, i: number) => (
              <tr key={i} className={styles.doc}>
                {value.map((v: any) => (
                  <td>
                    {v && !Array.isArray(v) && !v.src && v }
                    {v && !Array.isArray(v) && v.src && <div className={styles.img}><img src={v.src} /></div>}
                    {v && Array.isArray(v) && v.length > 0 && v[0].src && <div className={styles.img}><img src={v[0].src} /></div>}
                    {v && Array.isArray(v) && v.length > 0 && !v[0].src && v.join(' • ')}
                  </td>
                ))}
                <td className={styles.actions}>
                  <Link href={`/structures/${structure.id}/${entries[i]['id']}/edit`}><Button>Edit</Button></Link>
                  <DeleteEntry structureId={structure.id} id={entries[i]['id']} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
