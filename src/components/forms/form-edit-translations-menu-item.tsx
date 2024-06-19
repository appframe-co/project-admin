'use client'

import { useState } from 'react';

import { TLanguageOption, TFile, TMenu, TItem } from '@/types'

import { Select } from '@/ui/select';
import { TranslationDocMenuItem } from '../translations-doc-menu-item';
import { TranslationFilesMenuItem } from '../translations-files-menu-item';

type TProps = {
    menu: TMenu;
    item: TItem;
    languages: TLanguageOption[];
    fields: {key: string, name: string, type: string}[];
    fieldsFiles: {key: string, name: string, type: string}[];
    files: TFile[];
}

export function FormEditTranslationsMenuItem({menu, item, languages, fields, fieldsFiles, files} : TProps) {
    const [resource, setResource] = useState<string|null>('doc');
    const [lang, setLang] = useState<string|null>();

    const handleLanguage = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        setLang(target.value);
        setResource(resource);
    };
    const handleResource = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        setResource(target.value);
    };

    if (!lang) {
        return (
            <>
                <div>
                    <Select 
                        onChange={handleLanguage}
                        options={[{value: '', label: 'Select a language'}, ...languages]}
                    />
                </div>
            </>
        )
    }

    return (
        <>
            <div>
                <Select 
                    onChange={handleLanguage}
                    options={[{value: '', label: 'Select a language'}, ...languages]}
                />
                <Select 
                    onChange={handleResource}
                    value={resource}
                    options={[{value: '', label: 'Select a resource'}, {value: 'doc', label: 'Data'}, {value: 'files', label: 'Files'}]}
                />
            </div>
            {resource === 'doc' && <TranslationDocMenuItem lang={lang} menuId={menu.id} item={item} fields={fields}  />}
            {resource === 'files' && <TranslationFilesMenuItem lang={lang} menuId={menu.id} item={item} 
                fieldsFiles={fieldsFiles} files={files} />}
        </>
    )
}