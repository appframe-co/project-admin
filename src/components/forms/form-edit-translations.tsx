'use client'

import { useState } from 'react';

import { TEntry, TStructure, TLanguageOption, TFile } from '@/types'

import { Select } from '@/ui/select';
import { TranslationEntry } from '../translations-entry';
import { TranslationFiles } from '../translations-files';

type TProps = {
    structure: TStructure;
    entry: TEntry;
    languages: TLanguageOption[];
    fields: {key: string, name: string, type: string}[];
    fieldsFiles: {key: string, name: string, type: string}[];
    files: TFile[];
}

export function FormEditTranslations({structure, entry, languages, fields, fieldsFiles, files} : TProps) {
    const [resource, setResource] = useState<string|null>();
    const [lang, setLang] = useState<string|null>();

    const handleLanguage = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        setLang(target.value);
        setResource(resource || 'entry');
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
                    options={[{value: '', label: 'Select a resource'}, {value: 'entry', label: 'Entry'}, {value: 'files', label: 'Files'}]}
                />
            </div>
            {resource === 'entry' && <TranslationEntry lang={lang} structureId={structure.id} entry={entry} fields={fields}  />}
            {resource === 'files' && <TranslationFiles lang={lang} structureId={structure.id} entry={entry} fieldsFiles={fieldsFiles} files={files} />}
        </>
    )
}