import Link from "next/link"
import styles from '@/styles/header.module.css'
import Image from "next/image"
import { Account } from "./account";
import { Alerts } from "./alerts";

export function Header({name}:{name:string}) {
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.logo}>
                    <Link href='/'>
                        <Image width={26} height={26} src='/logo.svg' alt='' />
                        <span className={styles.projectName}>{name}</span>
                    </Link>
                </div>
                <div className={styles.actions}>
                    <Alerts />
                    <Account />
                </div>
            </div>
        </>  
    )
}