import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure, TSection } from '@/types';
import { getStructure } from '@/services/structures';
import styles from '@/styles/structure.module.css'
import { Topbar } from '@/components/topbar';
import { Button } from '@/ui/button';
import { getSections, getSectionsCount } from '@/services/sections';
import { DeleteSection } from '@/components/delete-section';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Structure | AppFrame'
}

type TPageProps = { 
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function StructureSections({ params, searchParams }: TPageProps) {
  const page = searchParams.page ? +searchParams.page : 1;
  const limit = 10;
  const parentId = searchParams.parent_id?.toString();

  const structurePromise = getStructure(params.id);
  const sectionsPromise = getSections(params.id, {page, limit, parentId});
  const sectionsCountPromise = getSectionsCount(params.id);

  const [structureData, sectionsData, sectionsCountData] = await Promise.all([structurePromise, sectionsPromise, sectionsCountPromise]);

  const {structure}: {structure: TStructure} = structureData;
  const {sections, names, keys, parent}: {sections: TSection[], names: string[], keys: string[], parent: TSection|null} = sectionsData;

  const types = structure.sections.bricks.reduce((acc:{[key:string]:string}, brick) => {
    acc[brick.key] = brick.type;
    return acc;
  }, {});

  const rows = sections.map(section => keys.map(k => ({value: section.doc[k], type: types[k]})));

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
          <Link href={`/structures/${structure.id}/entries/?section_id=${sections[i]['id']}`}><Button>Entries</Button></Link>
          <Link href={`/structures/${structure.id}/sections/?parent_id=${sections[i]['id']}`}><Button>View</Button></Link>
          <Link href={`/structures/${structure.id}/sections/${sections[i]['id']}`}><Button>Edit</Button></Link>
          <DeleteSection structureId={structure.id} id={sections[i]['id']} />
        </td>
      </tr>
    );
  });

  let qs = '?', qe = '?';
  if (parentId) {
    qs += `parent_id=${parentId}`;
    qe += `section_ids=${parentId}`;
  }

  return (
    <div className='page'>
      <Topbar title={`${structure.name} - sections ${parent ? `(${parent.doc.name})` : ''}`}>
        {structure.sections.enabled && <Link href={`/structures/${params.id}/sections/new${qs}`}>Add section</Link>}
        <Link href={`/structures/${params.id}/entries/new${qe}`}>Add entry</Link>
      </Topbar>

      <div className={styles.structureParts}>
        <Link href={{pathname: `/structures/${structure.id}/entries`}}><Button>Entries</Button></Link>
        <Link href={{pathname: `/structures/${structure.id}/sections`}}><Button>Sections</Button></Link>
      </div>

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
          <Link href={{pathname: `/structures/${structure.id}/sections`, query: { page: page-1 }}}><Button>Previous</Button></Link>
        ) : <Button disabled>Previous</Button>}

        {page*limit < sectionsCountData.count ? (
          <Link href={{pathname: `/structures/${structure.id}/sections`, query: { page: page+1 }}}><Button>Next</Button></Link>
        ) : <Button disabled>Next</Button>}
      </nav>
    </div>
  )
}