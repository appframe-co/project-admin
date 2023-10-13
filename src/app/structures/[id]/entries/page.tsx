import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure, TEntry, TCurrencyOption } from '@/types';
import { getStructure } from '@/services/structures';
import { getEntries, getEntriesCount } from '@/services/entries';
import styles from '@/styles/structure.module.css'
import { DeleteEntry } from '@/components/delete-entry';
import { Topbar } from '@/components/topbar';
import { Button } from '@/ui/button';

export const metadata: Metadata = {
  title: 'Structure | AppFrame'
}

type TPageProps = { 
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Structures({ params, searchParams }: TPageProps) {
  const page = searchParams.page ? +searchParams.page : 1;
  const limit = 10;

  const structurePromise = getStructure(params.id);
  const entriesPromise = getEntries(params.id, {page, limit});
  const entriesCountPromise = getEntriesCount(params.id);

  const [structureData, entriesData, entriesCountData] = await Promise.all([structurePromise, entriesPromise, entriesCountPromise]);

  const {structure}: {structure: TStructure} = structureData;
  const {entries, names, keys}: {entries: TEntry[], names: string[], keys: string[]} = entriesData;

  const types = structure.bricks.reduce((acc:{[key:string]:string}, brick) => {
    acc[brick.key] = brick.type;
    return acc;
  }, {});

  const rows = entries.map(entry => keys.map(k => ({value: entry.doc[k], type: types[k]})));

  const rowsJSX = rows.map((col, i: number) => {
    const colsJSX = col.map((data, k: number) => {
      if (data.value === null || data.value === undefined) {
        return (
          <td key={k}>
            <div className={styles.docContainer}></div>
          </td>
        ); 
      }
  
      let dataJSX: JSX.Element|null = <div>{data.value}</div>;

      if (data.type === 'file_reference') {
        dataJSX = data.value ? <div className={styles.img}><img src={data.value.src} /></div> : null;
      }
      if (data.type.startsWith('list.')) {
        if (data.type === 'list.file_reference') {
          dataJSX = data.value.length ? <div className={styles.img}><img src={data.value[0].src} /></div> : null;
        } else {
          dataJSX = <div>{data.value.join(' • ')}</div>;
        }
      }
      if (data.type === 'money') {
        const money = data.value.map((v: {amount:string,currencyCode:string}, k: number) => {
          return `${k ? ' • ' : ''} ${v.amount} ${v.currencyCode}`;
        })
        dataJSX = <div>{money}</div>;
      }

      return (
        <td key={k}>
          <div className={styles.docContainer}>{dataJSX}</div>
        </td>
      );
    })

    return (
      <tr key={i} className={styles.doc}>
        {colsJSX}
        <td className={styles.actions}>
          <Link href={`/structures/${structure.id}/entries/${entries[i]['id']}`}><Button>Edit</Button></Link>
          <DeleteEntry structureId={structure.id} id={entries[i]['id']} />
        </td>
      </tr>
    );
  });

  return (
    <div className='page'>
      <Topbar title={structure.name}>
        <Link href={`/structures/${params.id}/entries/new`}>Add entry</Link>
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
            {rowsJSX}
          </tbody>
        </table>
      </div>

      <nav className={styles.pagination}>
        {page > 1 ? (
          <Link href={{pathname: `/structures/${structure.id}/entries`, query: { page: page-1 }}}><Button>Previous</Button></Link>
        ) : <Button disabled>Previous</Button>}

        {page*limit < entriesCountData.count ? (
          <Link href={{pathname: `/structures/${structure.id}/entries`, query: { page: page+1 }}}><Button>Next</Button></Link>
        ) : <Button disabled>Next</Button>}
      </nav>
    </div>
  )
}