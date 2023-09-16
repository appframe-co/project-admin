import styles from '@/styles/ui/card.module.css'
import { CSSProperties } from 'react';

export function Card({title, padding, children}: {title?: string, padding?: number, children: React.ReactNode}) {
    const style = {} as CSSProperties;

    if (padding !== undefined && padding !== null) {
        style.padding = padding+'px';
    }

    return (
        <div className={styles.card} style={style}>
            {title && <div className={styles.heading}><h3>{title}</h3></div>}
            {children}
        </div>
    )
}