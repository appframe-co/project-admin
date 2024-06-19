import type { Metadata } from 'next'
import Link from 'next/link';
import { TMenu, TItem } from '@/types';
import styles from '@/styles/content.module.css'
import { Topbar } from '@/components/topbar';
import { Button } from '@/ui/button';
import { getMenu } from '@/services/menus';
import { getMenuItems, getMenuItemsCount } from '@/services/menu-items';
import { DeleteMenuItem } from '@/components/delete-menu-item';

export const metadata: Metadata = {
  title: 'Items | AppFrame'
}

type TPageProps = { 
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function MenuItems({ params, searchParams }: TPageProps) {
  const page = searchParams.page ? +searchParams.page : 1;
  const limit = 10;
  const parentId = searchParams.parent_id?.toString();

  const menuPromise = getMenu(params.id);
  const itemsPromise = getMenuItems(params.id, {page, limit, parentId});
  const itemsCountPromise = getMenuItemsCount(params.id);

  const [menuData, itemsData, itemsCountData] = await Promise.all([menuPromise, itemsPromise, itemsCountPromise]);

  const {menu}: {menu: TMenu} = menuData;
  const {items, names, keys, parent}: {items: TItem[], names: string[], keys: string[], parent: TItem|null} = itemsData;

  const types = menu.items.fields.reduce((acc:{[key:string]:string}, field) => {
    acc[field.key] = field.type;
    return acc;
  }, {});

  const rows = items.map(item => keys.map(k => ({value: item.doc[k], type: types[k]})));

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
          {!items[i]['subjectId'] && <Link href={`/menus/${menu.id}/items/?parent_id=${items[i]['id']}`}><Button>View</Button></Link>}
          <Link href={`/menus/${menu.id}/items/${items[i]['id']}`}><Button>Edit</Button></Link>
          <DeleteMenuItem menuId={menu.id} id={items[i]['id']} />
        </td>
      </tr>
    );
  });

  let qs = '?', qe = '?';
  if (parentId) {
    qs += `parent_id=${parentId}`;
    qe += `item_ids=${parentId}`;
  }

  return (
    <div className='page'>
      <Topbar title={`${menu.name} - items ${parent ? `(${parent.doc.name})` : ''}`}>
        <Link href={`/menus/${params.id}/items/new${qs}`}>Add item</Link>
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
          <Link href={{pathname: `/menus/${menu.id}/items`, query: { page: page-1 }}}><Button>Previous</Button></Link>
        ) : <Button disabled>Previous</Button>}

        {page*limit < itemsCountData.count ? (
          <Link href={{pathname: `/menus/${menu.id}/items`, query: { page: page+1 }}}><Button>Next</Button></Link>
        ) : <Button disabled>Next</Button>}
      </nav>
    </div>
  )
}