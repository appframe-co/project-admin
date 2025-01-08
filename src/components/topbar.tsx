import styles from '@/styles/topbar.module.css'
import BackSVG from '@public/icons/back'
import Link from 'next/link'

export function Topbar({title, back, children}: {title: string, back?: string, children?: React.ReactNode}) {
    return (
        <div className={styles.topbar}>
            {back && <div className={styles.back}><Link href={back}><BackSVG width={18} height={18} /></Link></div>}
            <div className={styles.heading}>
                <h2>{title}</h2>
            </div>
            <div className={styles.controls}>
                {children}
            </div>
        </div>
    )
}