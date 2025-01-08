import type { Metadata } from 'next'
import { TCurrency, TCurrencyPreview, TFile, TProject, TSection, TContent, TSchemaField } from '@/types';
import { getContent } from '@/services/contents';
import { Topbar } from '@/components/topbar';
import { getCurrencies } from '@/services/system';
import { getProject } from '@/services/project';
import Link from 'next/link';
import Image from 'next/image';
import { Toolbar } from '@/components/toolbar';
import { getSection } from '@/services/sections';
import { FormEditSection } from '@/components/forms/form-edit-section';
import { getSchemaFields } from '@/services/schema-fields';
import TranslationsSVG from '@public/icons/translations';

export const metadata: Metadata = {
    title: 'Edit section | AppFrame'
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
function isErrorSchemaFields(data: TErrorResponse|{schemaFields: TSchemaField[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function EditSection({ params }: {params: {id: string, sectionId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const contentPromise = getContent(params.id);
    const sectionPromise = getSection(params.sectionId, params.id);
    const currenciesPromise: Promise<TErrorResponse|{currencies: TCurrency[]}> = getCurrencies();
    const schemaFieldsPromise: Promise<TErrorResponse|{schemaFields: TSchemaField[]}> = getSchemaFields();

    const [projectData, contentData, sectionData, currenciesData, schemaFieldsData] = await Promise.all([projectPromise, contentPromise, sectionPromise, currenciesPromise, schemaFieldsPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorContent(contentData)) {
        return <></>;
    }
    if (isErrorCurrencies(currenciesData)) {
        return <></>;
    }
    if (isErrorSchemaFields(schemaFieldsData)) {
        return <></>;
    }

    const {content}: {content: TContent} = contentData;
    const {section, files}: {section: TSection, files: TFile[]} = sectionData;

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
            <Link href={section.id+'/translations'}>
                <TranslationsSVG width={20} height={20} />
                <span>Translations</span>
            </Link>
        </>);
    }

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit section of ' + content.name} back={`/contents/${content.id}/sections`} />
            <Toolbar tools={tools} />
            <FormEditSection content={content} section={section} files={files} currencies={currencies} schemaFields={schemaFieldsData.schemaFields} />
        </div>
    )
}