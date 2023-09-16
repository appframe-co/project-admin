import styles from '@/styles/ui/box.module.css'
import { CSSProperties } from 'react';

export function Box({padding, children}: {padding?: number, children: React.ReactNode}) {
    const style = {} as CSSProperties;
    if (padding !== undefined && padding !== null) {
        style.padding = padding+'px';
    }

    return (
        <div className={styles.box} style={style}>
            {children}
        </div>
    )
}