import Link from "next/link"
import styles from '@/styles/header.module.css'
import { Account } from "./account";
import { Alerts } from "./alerts";
import LogoSVG from '@public/logo';

export function Header({name}:{name:string}) {
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.logo}>
                    <Link href='/'>
                        <LogoSVG width={26} height={26} />
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