import type { Metadata } from 'next'
import styles from '@/styles/files.module.css';
import { Topbar } from '@/components/topbar';
import { TFile } from '@/types';
import { getFiles } from '@/services/files';

export const metadata: Metadata = {
  title: 'Files | AppFrame'
}

export default async function Files() {
    const {files=[]}:{files: TFile[]} = await getFiles();

    return (
    <div>
        <Topbar title='Files'></Topbar>

        <div className={styles.container}>
            {files.map(file => (
                <div key={file.id}>{file.filename}</div>
            ))}
        </div>              
    </div>
    )
}
