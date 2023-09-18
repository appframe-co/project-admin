import Link from "next/link"
import styles from '@/styles/header.module.css'
import Image from "next/image"

export function Header() {
    return (
        <div className={styles.logo}>
            <Link href='/'>
                <Image width={26} height={26} src='/logo.svg' alt='' />
                <span className={styles.projectName}>AppFrame</span>
            </Link>
        </div>
    )
}