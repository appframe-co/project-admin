import type { Metadata } from 'next'
import { TCurrency, TCurrencyPreview, TProject, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { Topbar } from '@/components/topbar';
import { FormNewEntry } from '@/components/forms/form-new-entry';
import { getCurrencies } from '@/services/system';
import { getProject } from '@/services/project';

export const metadata: Metadata = {
    title: 'New Entry | AppFrame'
}

function isErrorProject(data: TErrorResponse|{project: TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorStructure(data: TErrorResponse|{structure: TStructure}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorCurrencies(data: TErrorResponse|{currencies: TCurrency[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function NewEntry({ params }: {params: {id: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const structurePromise: Promise<TErrorResponse|{structure: TStructure}> = getStructure(params.id);
    const currenciesPromise: Promise<TErrorResponse|{currencies: TCurrency[]}> = getCurrencies();

    const [projectData, structureData, currenciesData] = await Promise.all([projectPromise, structurePromise, currenciesPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorStructure(structureData)) {
        return <></>;
    }
    if (isErrorCurrencies(currenciesData)) {
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
            <Topbar title='New Entry' back={`/structures/${structureData.structure.id}/entries`} />
            <FormNewEntry structure={structureData.structure} currencies={currencies} />
        </div>
    )
}