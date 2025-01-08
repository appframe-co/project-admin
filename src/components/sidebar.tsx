'use client'

import { usePathname } from 'next/navigation'
import Link from "next/link"
import Image from 'next/image';
import styles from '@/styles/sidebar.module.css'
import HomeSVG from '@public/icons/home';
import ContentsSVG from '@public/icons/contents';
import MenusSVG from '@public/icons/menus';
import FilesSVG from '@public/icons/files';
import SettingsSVG from '@public/icons/settings';

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div>
            <ul className={styles.links}>
                <li>
                    <div className={styles.container}>
                        <Link href='/' className={pathname === '/' ? styles.active : ''}>
                            <HomeSVG width={18} height={18} />
                            <span>Home</span>
                        </Link>
                    </div>
                </li>
                <li>
                   <div className={styles.container}>
                        <Link href='/contents' className={pathname.startsWith('/contents') ? styles.active : ''}>
                            <ContentsSVG width={18} height={18} />
                            <span>Contents</span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className={styles.container}>
                        <Link href='/menus' className={pathname === '/menus' ? styles.active : ''}>
                            <MenusSVG width={18} height={18} />
                            <span>Menus</span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className={styles.container}>
                        <Link href='/files' className={pathname === '/files' ? styles.active : ''}>
                            <FilesSVG width={18} height={18} />
                            <span>Files</span>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className={styles.container}>
                        <Link href='/settings' className={pathname === '/settings' ? styles.active : ''}>
                            <SettingsSVG width={18} height={18} />
                            <span>Settings</span>
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    )
}