'use client'

import { useState } from 'react'
import { TMenu, TSchemaField } from '@/types'
import styles from '@/styles/form-menu.module.css'
import { MenuCommon } from '@/components/menu-common'
import { MenuTranslations } from '@/components/menu-translations'
import { MenuItems } from '@/components/menu-items'

type TProps = {
    menu: TMenu;
    groupOfFields: {[key: string]: TSchemaField[]};
    names:{[key: string]: string};
}

export function FormEditMenu({menu, groupOfFields, names}: TProps) {
    const [link, setLink] = useState<string>('common');

    return (
        <>
            <div className={styles.links}>
                <ul>
                    <li className={link === 'common' ? styles.active : ''} onClick={() => setLink('common')}>Common</li>
                    <li className={link === 'items' ? styles.active : ''} onClick={() => setLink('items')}>Items</li>
                    <li className={link === 'translations' ? styles.active : ''} onClick={() => setLink('translations')}>Translations</li>
                </ul>
            </div>

            <div>
                {link === 'common' && <MenuCommon defaultValues={{id: menu.id, name: menu.name, code: menu.code}} />}
                {link === 'items' && <MenuItems defaultValues={{id: menu.id, items: menu.items}} groupOfFields={groupOfFields} names={names} />}
                {link === 'translations' && <MenuTranslations defaultValues={{id: menu.id, translations: menu.translations}} />}
            </div>
        </>
    )
}