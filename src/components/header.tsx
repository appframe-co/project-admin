import Link from "next/link"
import styles from '@/styles/header.module.css'

export function Header() {
    return (
        <div className={styles.logo}>
            <Link href='/'>AppFrame</Link>
        </div>
    )
}