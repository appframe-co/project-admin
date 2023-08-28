'use client'

import styles from '@/styles/bricks-editor.module.css'
import { TBrick } from '@/types'

export function Bricks({bricks, selectBrick, setLayer}: {bricks: TBrick[], selectBrick: (i: number) => void, setLayer: (layer: string) => void}) {
    return (
        <div className={styles.bricks}>
            <div>
                {bricks?.map((b, i) => {
                    return (
                        <div key={i}>
                            <div onClick={() => selectBrick(i)}>{b.name}</div>
                        </div>
                    );
                })}
            </div>
            <div>
                <div onClick={() => setLayer('schemaBricks')}>+ New Brick</div>
            </div>
        </div>
    )
}