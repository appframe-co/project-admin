import type { Metadata } from 'next'
import Link from 'next/link';
import { TContent } from '@/types';
import { getContents } from '@/services/contents';
import styles from '@/styles/contents.module.css';
import { Topbar } from '@/components/topbar';
import { Button } from '@/ui/button';

export const metadata: Metadata = {
  title: 'Contents | AppFrame'
}

export default async function Contents() {
  const {contents=[]}:{contents: (TContent & {entriesCount: number})[]} = await getContents();

  return (
    <div className='page'>
        <Topbar title='Contents'>
            <Link href={'/contents/new'}>New content</Link>
        </Topbar>

        <div className={styles.table}>
          <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Entries</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
              {contents.map(content => (
                <tr key={content.id} className={styles.doc}>
                  <td>{content.name}</td>
                  <td>{content.entriesCount}</td>
                  <td className={styles.actions}>
                    <Link href={`contents/${content.id}/entries`}><Button>View</Button></Link>
                    <Link href={`contents/${content.id}`}><Button>Edit</Button></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}
