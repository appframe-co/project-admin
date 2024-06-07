import type { Metadata } from 'next'
import styles from '@/styles/files.module.css';
import { Topbar } from '@/components/topbar';
import { TMenu } from '@/types';
import { getMenus, getMenusCount } from '@/services/menus';
import Link from 'next/link';
import { Button } from '@/ui/button';
import { DeleteMenu } from '@/components/delete-menu';

export const metadata: Metadata = {
  title: 'Menus | AppFrame'
}

type TPageProps = {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Links({ searchParams }: TPageProps) {
    const page = searchParams.page ? +searchParams.page : 1;
    const limit = 10;

    const menusPromise = getMenus({page, limit});
    const menusCountPromise = getMenusCount();

    const [menusData, menusCountData] = await Promise.all([menusPromise, menusCountPromise]);

    const {menus=[]}:{menus: TMenu[]} = menusData;
    const {count} = menusCountData;

    return (
        <div className='page'>
            <Topbar title='Menus'>
                <Link href={'/menus/new'}>New menu</Link>
            </Topbar>

            <div className={styles.table}>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Handle</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {menus.map(menu => (
                            <tr key={menu.id} className={styles.doc}>
                                <td>{menu.title}</td>
                                <td>{menu.handle}</td>
                                <td className={styles.actions}>
                                    <Link href={`menus/${menu.id}`}><Button>Edit</Button></Link>
                                    <DeleteMenu menuId={menu.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <nav className={styles.pagination}>
                {page > 1 ? (
                    <Link href={{pathname: `/menus`, query: { page: page-1 }}}><Button>Previous</Button></Link>
                ) : <Button disabled>Previous</Button>}

                {page*limit < count ? (
                    <Link href={{pathname: `/menus`, query: { page: page+1 }}}><Button>Next</Button></Link>
                ) : <Button disabled>Next</Button>}
            </nav>
        </div>
    )
}
