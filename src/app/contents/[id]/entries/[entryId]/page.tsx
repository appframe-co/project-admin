import type { Metadata } from 'next'
import { FormEditEntry } from '@/components/forms/form-edit-entry';
import { TCurrency, TCurrencyPreview, TEntry, TFile, TProject, TSection, TContent, TSchemaField } from '@/types';
import { getContent } from '@/services/contents';
import { getEntry } from '@/services/entries';
import { Topbar } from '@/components/topbar';
import { getCurrencies } from '@/services/system';
import { getProject } from '@/services/project';
import Link from 'next/link';
import Image from 'next/image';
import { Toolbar } from '@/components/toolbar';
import { LinkEntrySection } from '@/components/link-entry-section';
import { getSections } from '@/services/sections';
import { getSchemaFields } from '@/services/schema-fields';

export const metadata: Metadata = {
    title: 'Edit entry | AppFrame'
}

function isErrorProject(data: TErrorResponse|{project: TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorContent(data: TErrorResponse|{content: TContent}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorCurrencies(data: TErrorResponse|{currencies: TCurrency[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorSections(data: TErrorResponse|{sections: TSection[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorSchemaFields(data: TErrorResponse|{schemaFields: TSchemaField[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function EditEntry({ params }: {params: {id: string, entryId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const contentPromise = getContent(params.id);
    const entryPromise = getEntry(params.entryId, params.id);
    const currenciesPromise: Promise<TErrorResponse|{currencies: TCurrency[]}> = getCurrencies();
    const sectionsPromise = getSections(params.id, {page: 1, limit: 10});
    const schemaFieldsPromise: Promise<TErrorResponse|{schemaFields: TSchemaField[]}> = getSchemaFields();

    const [projectData, contentData, entryData, currenciesData, sectionsData, schemaFieldsData] = await Promise.all([projectPromise, contentPromise, entryPromise, currenciesPromise, sectionsPromise, schemaFieldsPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorContent(contentData)) {
        return <></>;
    }
    if (isErrorCurrencies(currenciesData)) {
        return <></>;
    }
    if (isErrorSections(sectionsData)) {
        return <></>;
    }
    if (isErrorSchemaFields(schemaFieldsData)) {
        return <></>;
    }

    const {content}: {content: TContent} = contentData;
    const {entry, files}: {entry: TEntry, files: TFile[]} = entryData;
    const {sections}: {sections: TSection[]} = sectionsData;

    const currencies:TCurrencyPreview[] = [];
    for (const currency of currenciesData.currencies) {
        const currencyProject = projectData.project.currencies.find(c => c.code === currency.code);
        if (!currencyProject) {
            continue;
        }

        currencies.push({
            symbol: currency.symbol, 
            code: currency.code, 
            name: currency.name,
            primary: currencyProject.primary
        });
    }

    const tools = [];
    if (content.translations && content.translations.enabled) {
        tools.push(<>
            <Link href={entry.id+'/translations'}>
                <Image width={20} height={20} src='/icons/language.svg' alt='' />
                <span>Translations</span>
            </Link>
        </>);
    }
    if (content.sections && content.sections.enabled) {
        tools.push(<>
            <LinkEntrySection contentId={content.id} sections={sections} id={entry.id} _sectionIds={entry.sectionIds}>
                <Image width={20} height={20} src='/icons/link.svg' alt='' />
                <span>sections</span>
            </LinkEntrySection>
        </>);
    }

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit entry of ' + content.name} back={`/contents/${content.id}/entries`} />
            <Toolbar tools={tools} />
            <FormEditEntry content={content} entry={entry} files={files} currencies={currencies} schemaFields={schemaFieldsData.schemaFields} />
        </div>
    )
}