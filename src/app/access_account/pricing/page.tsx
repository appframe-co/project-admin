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
                            <th>Site</th>
                            <th>Village</th>
                            <th>Town</th>
                            <th>City</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={styles.doc}>
                            <td></td>
                            <td>? / month</td>
                            <td>? / month</td>
                            <td>soon</td>
                            <td>soon</td>
                        </tr>

                        <tr className={styles.doc}>
                            <td className={styles.docName}>Structures</td>
                            <td>1</td>
                            <td>2</td>
                            <td>4</td>
                            <td>6</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>Files</td>
                            <td>5 MB</td>
                            <td>15 MB</td>
                            <td>35 MB</td>
                            <td>55 MB</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Managers</span>
                                <span className={styles.docNameInfo}>Stuff members</span>
                            </td>
                            <td></td>
                            <td>1</td>
                            <td>2</td>
                            <td>4</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>Dictionary (definitions)</td>
                            <td></td>
                            <td>10</td>
                            <td>20</td>
                            <td>30</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>Pages</td>
                            <td></td>
                            <td>2</td>
                            <td>4</td>
                            <td>6</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Menus</span>
                            </td>
                            <td></td>
                            <td>2</td>
                            <td>4</td>
                            <td>6</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>WebP format</span>
                            </td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Dynamic resize images</span>
                            </td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Translations</span>
                            </td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>Backups</td>
                            <td></td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>Custom domain</td>
                            <td></td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>Webhooks</td>
                            <td></td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>Sitemap.xml</td>
                            <td></td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Export Data</span>
                                <span className={styles.docNameInfo}>Entries</span>
                            </td>
                            <td></td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr className={styles.doc}>
                            <td className={styles.docName}>
                                <span>Marketing</span>
                            </td>
                            <td></td>
                            <td></td>
                            <td>&#10003;</td>
                            <td>&#10003;</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
