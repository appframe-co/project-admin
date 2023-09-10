import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure, TEntry } from '@/types';
import { getStructure } from '@/services/structures';
import { getEntries } from '@/services/entries';
import styles from '@/styles/structure.module.css'
import { DeleteEntry } from '@/components/delete-entry';
import { Topbar } from '@/components/topbar';
import { resizeImg } from '@/utils/resize-img';

export const metadata: Metadata = {
  title: 'Structure | AppFrame'
}


export default async function Structures({ params }: { params: { id: string } }) {
  const structurePromise = getStructure(params.id);
  const entriesPromise = getEntries(params.id);

  const [structureData, entriesData] = await Promise.all([structurePromise, entriesPromise]);

  const {structure}: {structure: TStructure} = structureData;
  const {entries, names, codes}: {entries: TEntry[], names: string[], codes: string[]} = entriesData;

  const values = entries.map(e => codes.map(c => e.doc[c]));

  return (
    <div className='page'>
      <Topbar title={structure.name}>
        <Link href={`/structures/${params.id}/edit`}>Edit structure</Link>
        <Link href={`/structures/${params.id}/new`}>Add entry</Link>
      </Topbar>

      <div>
        <table className={styles.structure}>
          <thead>
            <tr>
              {names.map((name: string, i: number) => (
                <th key={i}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map((value: any, i: number) => (
              <tr key={i}>
                {value.map((v: any) => (
                  <td>
                    {Array.isArray(v) && v.length > 0 && <img src={resizeImg(v[0].src, {w: 65, h: 65})} />}

                    {!Array.isArray(v) && v}
                  </td>
                ))}
                <td><Link href={`/structures/${structure.id}/${entries[i]['id']}/edit`}>Edit</Link></td>
                <td><DeleteEntry structureId={structure.id} id={entries[i]['id']} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
