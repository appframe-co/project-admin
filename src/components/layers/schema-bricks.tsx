'use client'

import styles from '@/styles/bricks-editor.module.css'
import { TSchemaBricks } from '@/types'

export function SchemaBricks({schemaBricks, selectSchemaBrick}: {schemaBricks: TSchemaBricks[], selectSchemaBrick: (id: string) => void}) {
    return (
        <div className={styles.schemaBricks}>
            {schemaBricks.map(schemaBrick => (
                <div key={schemaBrick.id}>
                    <div onClick={() => selectSchemaBrick(schemaBrick.id)}>{schemaBrick.name}</div>
                </div>
            ))}
        </div>
    )
}