'use client'

import { useState } from 'react'
import { TStructure, TSchemaBrick } from '@/types'
import styles from '@/styles/form-structure.module.css'
import { StructureCommon } from '@/components/structure-common'
import { StructureEntries } from '@/components/structure-entries'
import { StructureTranslations } from '@/components/structure-translations'
import { StructureNotifications } from '@/components/structure-notifications'
import { StructureSections } from '@/components/structure-sections'

type TProps = {
    structure: TStructure, 
    groupOfBricks: {[key: string]: TSchemaBrick[]}, 
    names:{[key: string]: string}
}

export function FormEditStructure({structure, groupOfBricks, names} : TProps) {
    const [link, setLink] = useState<string>('common');

    return (
        <>
            <div className={styles.links}>
                <ul>
                    <li className={link === 'common' ? styles.active : ''} onClick={() => setLink('common')}>Common</li>
                    <li className={link === 'entries' ? styles.active : ''} onClick={() => setLink('entries')}>Entries</li>
                    <li className={link === 'sections' ? styles.active : ''} onClick={() => setLink('sections')}>Sections</li>
                    <li className={link === 'translations' ? styles.active : ''} onClick={() => setLink('translations')}>Translations</li>
                    <li className={link === 'notifications' ? styles.active : ''} onClick={() => setLink('notifications')}>Notifications</li>
                </ul>
            </div>

            <div>
                {link === 'common' && <StructureCommon defaultValues={{id: structure.id, name: structure.name, code: structure.code}} />}
                {link === 'entries' && <StructureEntries defaultValues={{id: structure.id, bricks: structure.bricks}} groupOfBricks={groupOfBricks} names={names} />}
                {link === 'sections' && <StructureSections defaultValues={{id: structure.id, sections: structure.sections}} groupOfBricks={groupOfBricks} names={names} />}
                {link === 'translations' && <StructureTranslations defaultValues={{id: structure.id, translations: structure.translations}} />}
                {link === 'notifications' && <StructureNotifications defaultValues={{id: structure.id, notifications: structure.notifications}} />}
            </div>
        </>
    )
}