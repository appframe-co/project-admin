import type { Metadata } from 'next'
import { TCurrency, TCurrencyPreview, TProject, TContent, TSchemaField } from '@/types';
import { getContent } from '@/services/contents';
import { Topbar } from '@/components/topbar';
import { FormNewEntry } from '@/components/forms/form-new-entry';
import { getCurrencies } from '@/services/system';
import { getProject } from '@/services/project';
import { getSchemaFields } from '@/services/schema-fields';

export const metadata: Metadata = {
    title: 'New Entry | AppFrame'
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

type TPageProps = { 
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function NewEntry({ params, searchParams }: TPageProps) {    
    const sectionIds = searchParams.section_ids?.toString();

    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const contentPromise: Promise<TErrorResponse|{content: TContent}> = getContent(params.id);
    const currenciesPromise: Promise<TErrorResponse|{currencies: TCurrency[]}> = getCurrencies();
    const schemaFieldsPromise: Promise<TErrorResponse|{schemaFields: TSchemaField[]}> = getSchemaFields();

    const [projectData, contentData, currenciesData, schemaFieldsData] = await Promise.all([projectPromise, contentPromise, currenciesPromise, schemaFieldsPromise]);

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

    return (
        <div className='page pageAlignCenter'>
            <Topbar title='New Entry' back={`/contents/${contentData.content.id}/entries`} />
            <FormNewEntry content={contentData.content} currencies={currencies} sectionIds={sectionIds} schemaFields={schemaFieldsData.schemaFields} />
        </div>
    )
}