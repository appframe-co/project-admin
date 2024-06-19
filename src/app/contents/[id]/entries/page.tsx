import type { Metadata } from 'next'
import Link from 'next/link';
import { TContent, TEntry, TSection } from '@/types';
import { getContent } from '@/services/contents';
import { getEntries, getEntriesCount } from '@/services/entries';
import styles from '@/styles/content.module.css'
import { DeleteEntry } from '@/components/delete-entry';
import { Topbar } from '@/components/topbar';
import { Button } from '@/ui/button';
import { LinkEntrySection } from '@/components/link-entry-section';
import { getSections, getSection } from '@/services/sections';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Content | AppFrame'
}

type TPageProps = { 
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Entries({ params, searchParams }: TPageProps) {
  const page = searchParams.page ? +searchParams.page : 1;
  const limit = 10; 

  const sectionId = searchParams.section_id ? searchParams.section_id.toString() : null;

  const contentPromise = getContent(params.id);
  const entriesPromise = getEntries(params.id, {page, limit, sectionId: searchParams.section_id?.toString()});
  const entriesCountPromise = getEntriesCount(params.id);
  const sectionsPromise = getSections(params.id, {page, limit});
  const sectionPromise = sectionId ? getSection(sectionId, params.id) : null;

  const [contentData, entriesData, entriesCountData, sectionsData, sectionData] = await Promise.all([contentPromise, entriesPromise, entriesCountPromise, sectionsPromise, sectionPromise]);

  const {content}: {content: TContent} = contentData;
  const {entries, names, keys}: {entries: TEntry[], names: string[], keys: string[]} = entriesData;
  const {sections}: {sections: TSection[]} = sectionsData;

  // const section: {section: TSection} = sectionData;

  const types = content.entries.fields.reduce((acc:{[key:string]:string}, field) => {
    acc[field.key] = field.type;
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
          <div className={styles.action}>
            <LinkEntrySection contentId={content.id} sections={sections} id={entries[i]['id']} _sectionIds={entries[i]['sectionIds']}>
              <Image width={20} height={20} src='/icons/link.svg' alt='' />
            </LinkEntrySection>
          </div>
          <Link href={`/contents/${content.id}/entries/${entries[i]['id']}`}><Button>Edit</Button></Link>
          <DeleteEntry contentId={content.id} id={entries[i]['id']} />
        </td>
      </tr>
    );
  });

  let filter = [];
  if (sectionData) {
    filter.push({
      type: 'section',
      name: 'Section: ' + sectionData.section.doc.name,
    });
  }

  return (
    <div className='page'>
      <Topbar title={content.name + ' - entries'}>
        {content.sections.enabled && <Link href={`/contents/${params.id}/sections/new`}>Add section</Link>}
        <Link href={`/contents/${params.id}/entries/new`}>Add entry</Link>
      </Topbar>

      <div className={styles.contentParts}>
        <Link href={{pathname: `/contents/${content.id}/entries`}}><Button>Entries</Button></Link>
        <Link href={{pathname: `/contents/${content.id}/sections`}}><Button>Sections</Button></Link>
      </div>

      {filter.length > 0 && (
        <div className={styles.filter}>
          <div className={styles.filterParams}>
            {filter.map(f => (
              <div><span>{f.name}</span></div>
            ))}
          </div>
        </div>
      )}
      

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
          <Link href={{pathname: `/contents/${content.id}/entries`, query: { page: page-1 }}}><Button>Previous</Button></Link>
        ) : <Button disabled>Previous</Button>}

        {page*limit < entriesCountData.count ? (
          <Link href={{pathname: `/contents/${content.id}/entries`, query: { page: page+1 }}}><Button>Next</Button></Link>
        ) : <Button disabled>Next</Button>}
      </nav>
    </div>
  )
}