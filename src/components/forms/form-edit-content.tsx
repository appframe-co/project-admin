'use client'

import { useState } from 'react'
import { TContent, TSchemaField } from '@/types'
import styles from '@/styles/form-content.module.css'
import { ContentCommon } from '@/components/content/content-common'
import { ContentEntries } from '@/components/content/content-entries'
import { ContentTranslations } from '@/components/content/content-translations'
import { ContentNotifications } from '@/components/content/content-notifications'
import { ContentSections } from '@/components/content/content-sections'

type TProps = {
    content: TContent;
    contents: TContent[];
    groupOfFields: {[key: string]: TSchemaField[]}; 
    names:{[key: string]: string};
}

export function FormEditContent({content, contents, groupOfFields, names} : TProps) {
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
                {link === 'common' && <ContentCommon defaultValues={{id: content.id, name: content.name, code: content.code}} />}
                {link === 'entries' && <ContentEntries defaultValues={{id: content.id, entries: content.entries}} 
                    groupOfFields={groupOfFields} names={names} 
                    contents={contents.filter(c => c.code !== content.code)} />}
                {link === 'sections' && <ContentSections defaultValues={{id: content.id, sections: content.sections}} groupOfFields={groupOfFields} names={names} />}
                {link === 'translations' && <ContentTranslations defaultValues={{id: content.id, translations: content.translations}} />}
                {link === 'notifications' && <ContentNotifications defaultValues={{id: content.id, notifications: content.notifications}} />}
            </div>
        </>
    )
}