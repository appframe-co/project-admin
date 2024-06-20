import type { Metadata } from 'next';
import { Topbar } from '@/components/topbar';
import styles from '@/styles/pricing.module.css';

export const metadata: Metadata = {
    title: 'Select a plan | AppFrame'
}

export default async function Pricing() {
    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Select a plan'} />

            <div className={styles.table}>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Basic</th>
                            <th>Standard</th>
                            <th>Advanced</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={styles.doc}>
                            <td></td>
                            <td>? / month</td>
                            <td>? / month</td>
                            <td>soon</td>
                        </tr>

                        <tr className={styles.doc}>
                            <td className={styles.docName}>Contents</td>
                            <td>2</td>
                            <td>5</td>
                            <td></td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>Files</td>
                            <td>5 MB</td>
                            <td>15 MB</td>
                            <td></td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Menus</span>
                            </td>
                            <td>2</td>
                            <td>4</td>
                            <td></td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>WebP format</span>
                            </td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                            <td></td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Dynamic resize images</span>
                            </td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                            <td></td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Translations</span>
                            </td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
