'use client'

import { useState } from 'react';

import { TEntry, TContent, TLanguageOption, TFile, TSection } from '@/types'

import { Select } from '@/ui/select';
import { TranslationDoc } from '@/components/translations-doc';
import { TranslationFiles } from '@/components/translations-files';

type TProps = {
    content: TContent;
    languages: TLanguageOption[];
    fields: {key: string, name: string, type: string}[];
    fieldsFiles: {key: string, name: string, type: string}[];
    files: TFile[];
    subject: string;
    subjectData: TEntry|TSection;
}

export function FormEditTranslations({content, subject, subjectData, languages, fields, fieldsFiles, files} : TProps) {
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
            {resource === 'doc' && <TranslationDoc lang={lang} contentId={content.id} 
                subject={subject} subjectData={subjectData} fields={fields}  />}
            {resource === 'files' && <TranslationFiles lang={lang} contentId={content.id} subjectData={subjectData} 
                fieldsFiles={fieldsFiles} files={files} />}
        </>
    )
}