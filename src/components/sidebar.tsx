import Link from "next/link"
import styles from '@/styles/sidebar.module.css'

export function Sidebar() {
    return (
        <div>
            <ul className={styles.links}>
                <li>
                    <div className={styles.container}><Link href='/'>Home</Link></div>
                </li>
                <li>
                   <div className={styles.container}><Link href='/structures'>Structures</Link></div>
                </li>
                <li>
                    <div className={styles.container}><Link href='/files'>Files</Link></div>
                </li>
                <li>
                    <div className={styles.container}><Link href='/users'>Users</Link></div>
                </li>
                <li>
                    <div className={styles.container}><Link href='/settings'>Settings</Link></div>
                </li>
            </ul>
        </div>
    )
}