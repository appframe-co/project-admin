'use client'

import styles from '@/styles/bricks-editor.module.css'
import { TSchemaBricks } from '@/types'

export function SchemaBricks(
    {schemaBricks, selectSchemaBrick, setLayer}:
    {schemaBricks: TSchemaBricks[], selectSchemaBrick: (id: string) => void, setLayer: (layer: string) => void}) {
    return (
        <div className={styles.schemaBricks}>
            <div onClick={() => setLayer('bricks')}>Back</div>
            <p>
                ___
            </p>
            {schemaBricks.map(schemaBrick => (
                <div key={schemaBrick.id}>
                    <div onClick={() => selectSchemaBrick(schemaBrick.id)}>{schemaBrick.name}</div>
                </div>
            ))}
        </div>
    )
}