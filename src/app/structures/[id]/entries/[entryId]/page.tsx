import type { Metadata } from 'next'
import { FormEditEntry } from '@/components/forms/form-edit-entry';
import { TCurrency, TCurrencyPreview, TEntry, TFile, TProject, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { getEntry } from '@/services/entries';
import { Topbar } from '@/components/topbar';
import { getCurrencies } from '@/services/system';
import { getProject } from '@/services/project';
import Link from 'next/link';
import Image from 'next/image';
import { Toolbar } from '@/components/toolbar';

export const metadata: Metadata = {
    title: 'Edit entry | AppFrame'
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

export default async function EditEntry({ params }: {params: {id: string, entryId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const structurePromise = getStructure(params.id);
    const entryPromise = getEntry(params.entryId, params.id);
    const currenciesPromise: Promise<TErrorResponse|{currencies: TCurrency[]}> = getCurrencies();

    const [projectData, structureData, entryData, currenciesData] = await Promise.all([projectPromise, structurePromise, entryPromise, currenciesPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorStructure(structureData)) {
        return <></>;
    }
    if (isErrorCurrencies(currenciesData)) {
        return <></>;
    }    

    const {structure}: {structure: TStructure} = structureData;
    const {entry, files}: {entry: TEntry, files: TFile[]} = entryData;

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
    if (structure.translations.enabled) {
        tools.push(<>
            <Link href={entry.id+'/translations'}>
                <Image width={20} height={20} src='/icons/language.svg' alt='' />
                <span>Translations</span>
            </Link>
        </>);
    }

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit entry of ' + structure.name} back={`/structures/${structure.id}/entries`} />
            <Toolbar tools={tools} />
            <FormEditEntry structure={structure} entry={entry} files={files} currencies={currencies} />
        </div>
    )
}