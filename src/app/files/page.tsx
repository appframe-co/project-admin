import type { Metadata } from 'next'
import styles from '@/styles/files.module.css';
import { Topbar } from '@/components/topbar';
import { TFile } from '@/types';
import { getFiles } from '@/services/files';
import { resizeImg } from '@/utils/resize-img';
import { DeleteFile } from '@/components/delete-file';

export const metadata: Metadata = {
  title: 'Files | AppFrame'
}

export default async function Files() {
    const {files=[]}:{files: TFile[]} = await getFiles();

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
        </div>
    )
}
