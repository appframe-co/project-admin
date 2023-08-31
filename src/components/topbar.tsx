import styles from '@/styles/topbar.module.css'

export function Topbar({title, children}: {title: string, children?: React.ReactNode}) {
    return (
        <div className={styles.topbar}>
            <div className={styles.heading}>
                <h2>{title}</h2>
            </div>
            <div className={styles.controls}>
                {children}
            </div>
        </div>
    )
}