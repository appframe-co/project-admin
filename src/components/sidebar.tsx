'use client'

import { usePathname } from 'next/navigation'
import Link from "next/link"
import Image from 'next/image';
import styles from '@/styles/sidebar.module.css'

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div>
            <ul className={styles.links}>
                <li>
                    <div className={styles.container}>
                        <Link href='/' className={pathname === '/' ? styles.active : ''}>
                            <Image width={18} height={18} src='/icons/home.svg' alt='' />
                            <span>Home</span>
                        </Link>
                    </div>
                </li>
                <li>
                   <div className={styles.container}>
                        <Link href='/structures' className={pathname.startsWith('/structures') ? styles.active : ''}>
                            <Image width={18} height={18} src='/icons/square-stack.svg' alt='' />
                            <span>Structures</span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className={styles.container}>
                        <Link href='/files' className={pathname === '/files' ? styles.active : ''}>
                            <Image width={18} height={18} src='/icons/files.svg' alt='' />
                            <span>Files</span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className={styles.container}>
                        <Link href='/menus' className={pathname === '/menus' ? styles.active : ''}>
                            <Image width={18} height={18} src='/icons/link.svg' alt='' />
                            <span>Menus</span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className={styles.container}>
                        <Link href='/settings' className={pathname === '/settings' ? styles.active : ''}>
                            <Image width={18} height={18} src='/icons/settings.svg' alt='' />
                            <span>Settings</span>
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    )
}