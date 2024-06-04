import type { Metadata } from 'next'
import { TCurrency, TCurrencyPreview, TFile, TProject, TSection, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { Topbar } from '@/components/topbar';
import { getCurrencies } from '@/services/system';
import { getProject } from '@/services/project';
import Link from 'next/link';
import Image from 'next/image';
import { Toolbar } from '@/components/toolbar';
import { getSection } from '@/services/sections';
import { FormEditSection } from '@/components/forms/form-edit-section';

export const metadata: Metadata = {
    title: 'Edit section | AppFrame'
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

export default async function EditSection({ params }: {params: {id: string, sectionId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const structurePromise = getStructure(params.id);
    const sectionPromise = getSection(params.sectionId, params.id);
    const currenciesPromise: Promise<TErrorResponse|{currencies: TCurrency[]}> = getCurrencies();

    const [projectData, structureData, sectionData, currenciesData] = await Promise.all([projectPromise, structurePromise, sectionPromise, currenciesPromise]);

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
    if (structure.translations && structure.translations.enabled) {
        tools.push(<>
            <Link href={section.id+'/translations'}>
                <Image width={20} height={20} src='/icons/language.svg' alt='' />
                <span>Translations</span>
            </Link>
        </>);
    }

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit section of ' + structure.name} back={`/structures/${structure.id}/sections`} />
            <Toolbar tools={tools} />
            <FormEditSection structure={structure} section={section} files={files} currencies={currencies} />
        </div>
    )
}