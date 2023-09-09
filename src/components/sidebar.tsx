import Link from "next/link"
import styles from '@/styles/sidebar.module.css'

export function Sidebar() {
    return (
        <div>
            <ul className={styles.links}>
                <li><Link href='/'>Home</Link></li>
                <li><Link href='/structures'>Structures</Link></li>
                <li><Link href='/files'>Files</Link></li>
                <li><Link href='/users'>Users</Link></li>
                <li><Link href='/settings'>Settings</Link></li>
            </ul>
        </div>
    )
}