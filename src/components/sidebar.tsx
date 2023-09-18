import Link from "next/link"
import Image from 'next/image';
import styles from '@/styles/sidebar.module.css'

export function Sidebar() {
    return (
        <div>
            <ul className={styles.links}>
                <li>
                    <div className={styles.container}>
                        <Link href='/'>
                            <Image width={20} height={20} src='/icons/home.svg' alt='' />
                            <span>Home</span>
                        </Link>
                    </div>
                </li>
                <li>
                   <div className={styles.container}>
                        <Link href='/structures'>
                            <Image width={20} height={20} src='/icons/building.svg' alt='' />
                            <span>Structures</span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className={styles.container}>
                        <Link href='/files'>
                            <Image width={20} height={20} src='/icons/files.svg' alt='' />
                            <span>Files</span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className={styles.container}>
                        <Link href='/settings'>
                            <Image width={20} height={20} src='/icons/settings.svg' alt='' />
                            <span>Settings</span>
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    )
}