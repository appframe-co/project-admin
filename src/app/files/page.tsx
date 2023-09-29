import type { Metadata } from 'next'
import styles from '@/styles/files.module.css';
import { Topbar } from '@/components/topbar';
import { TFile } from '@/types';
import { getFiles, getFilesCount } from '@/services/files';
import { DeleteFile } from '@/components/delete-file';
import Link from 'next/link';
import { Button } from '@/ui/button';

export const metadata: Metadata = {
  title: 'Files | AppFrame'
}

type TPageProps = {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Files({ searchParams }: TPageProps) {
    const page = searchParams.page ? +searchParams.page : 1;
    const limit = 10;

    const filesPromise = getFiles({page, limit});
    const filesCountPromise = getFilesCount();

    const [filesData, filesCountData] = await Promise.all([filesPromise, filesCountPromise]);

    const {files=[]}:{files: TFile[]} = filesData;
    const {count} = filesCountData;

    return (
        <div className='page'>
            <Topbar title='Files'></Topbar>

            <div className={styles.table}>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>File name</th>
                            <th>Size</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map(file => (
                            <tr key={file.id} className={styles.doc}>
                                <td><div className={styles.img}><img src={file.src} /></div></td>
                                <td>{file.filename}</td>
                                <td>{file.size} B</td>
                                <td><DeleteFile fileId={file.id} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <nav className={styles.pagination}>
                {page > 1 ? (
                    <Link href={{pathname: `/files`, query: { page: page-1 }}}><Button>Previous</Button></Link>
                ) : <Button disabled>Previous</Button>}

                {page*limit < count ? (
                    <Link href={{pathname: `/files`, query: { page: page+1 }}}><Button>Next</Button></Link>
                ) : <Button disabled>Next</Button>}
            </nav>
        </div>
    )
}
