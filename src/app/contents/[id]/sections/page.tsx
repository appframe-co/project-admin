import type { Metadata } from 'next'
import Link from 'next/link';
import { TContent, TField, TSection } from '@/types';
import { getContent } from '@/services/contents';
import styles from '@/styles/content.module.css'
import { Topbar } from '@/components/topbar';
import { Button } from '@/ui/button';
import { getSections, getSectionsCount } from '@/services/sections';
import { DeleteSection } from '@/components/delete-section';

export const metadata: Metadata = {
  title: 'Sections | AppFrame'
}

type TPageProps = { 
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ContentSections({ params, searchParams }: TPageProps) {
  const page = searchParams.page ? +searchParams.page : 1;
  const limit = 10;
  const parentId = searchParams.parent_id?.toString();

  const contentPromise = getContent(params.id);
  const sectionsPromise = getSections(params.id, {page, limit, parentId});
  const sectionsCountPromise = getSectionsCount(params.id);

  const [contentData, sectionsData, sectionsCountData] = await Promise.all([contentPromise, sectionsPromise, sectionsCountPromise]);

  const {content}: {content: TContent} = contentData;
  const {sections, fields, parent}: {sections: TSection[], fields: TField[], parent: TSection|null} = sectionsData;

  const hiddenTypes:string[] = ['rich_text'];

  const types = content.sections.fields.reduce((acc:{[key:string]:string}, field) => {
    acc[field.key] = field.type;
    return acc;
  }, {});

  const rows = sections.map(section => 
    fields
      .filter(f => !hiddenTypes.includes(f.type))
      .map(f => ({value: section.doc[f.key], type: types[f.key]}))
  );

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
          <Link href={`/contents/${content.id}/entries/?section_id=${sections[i]['id']}`}><Button>Entries</Button></Link>
          <Link href={`/contents/${content.id}/sections/?parent_id=${sections[i]['id']}`}><Button>View</Button></Link>
          <Link href={`/contents/${content.id}/sections/${sections[i]['id']}`}><Button>Edit</Button></Link>
          <DeleteSection contentId={content.id} id={sections[i]['id']} />
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
      <Topbar title={`${content.name} - sections ${parent ? `(${parent.doc.name})` : ''}`}>
        {content.sections.enabled && <Link href={`/contents/${params.id}/sections/new${qs}`}>Add section</Link>}
        <Link href={`/contents/${params.id}/entries/new${qe}`}>Add entry</Link>
      </Topbar>

      <div className={styles.contentParts}>
        <Link href={{pathname: `/contents/${content.id}/entries`}}><Button>Entries</Button></Link>
        <Link href={{pathname: `/contents/${content.id}/sections`}}><Button>Sections</Button></Link>
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              {fields.filter(f => !hiddenTypes.includes(f.type)).map((f: TField, i: number) => (
                <th key={i}>{f.name}</th>
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
          <Link href={{pathname: `/contents/${content.id}/sections`, query: { page: page-1 }}}><Button>Previous</Button></Link>
        ) : <Button disabled>Previous</Button>}

        {page*limit < sectionsCountData.count ? (
          <Link href={{pathname: `/contents/${content.id}/sections`, query: { page: page+1 }}}><Button>Next</Button></Link>
        ) : <Button disabled>Next</Button>}
      </nav>
    </div>
  )
}