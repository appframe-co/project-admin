'use client'

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styles from '@/styles/header.module.css'
import Image from "next/image"
import Link from "next/link"

export function Account() {
    const divAccountRef = useRef<null|HTMLDivElement>(null);
    const divAccountMenuRef = useRef<null|HTMLDivElement>(null);
    const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);

    useEffect(() => {
        const closeDropDown = (event: Event) => {
            if (!divAccountRef.current) {
                return;
            }

            if (!event.composedPath().includes(divAccountRef.current as HTMLDivElement) && 
                !event.composedPath().includes(divAccountMenuRef.current as HTMLDivElement)) {
                setShowAccountMenu(false);
            }
        };

        window.addEventListener('click', closeDropDown);

        return () => window.removeEventListener('click', closeDropDown);
    }, []);

    return (
        <>
            <div ref={divAccountRef} className={styles.account} onClick={() => setShowAccountMenu((prevState: any) => !prevState)}>
                <Image width={18} height={18} src='/icons/account.svg' alt='' />
            </div>

            {showAccountMenu && createPortal(
                <div ref={divAccountMenuRef} className={styles.accountMenu}>
                     <ul>
                        <li><Link href={`${process.env.NEXT_PUBLIC_URL_ACCOUNT as string}/logout`}>Log out</Link></li>
                    </ul>
                </div>,
                document.body
            )}
        </>
    )
}