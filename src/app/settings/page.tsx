import type { Metadata } from 'next';
import { FormEditProject } from "@/components/forms/form-edit-project";
import { getProject, getAccessTokenProject } from "@/services/project"
import { TCurrency, TLanguage, TProject } from "@/types";
import { Topbar } from '@/components/topbar';
import { getCurrencies, getLanguages } from '@/services/system';

export const metadata: Metadata = {
    title: 'Settings | AppFrame'
}

function isErrorProject(data: TErrorResponse|{project:TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorProjectAccessToken(data: TErrorResponse|{projectId: string, accessToken: string}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorCurrencies(data: TErrorResponse|{currencies: TCurrency[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorLanguages(data: TErrorResponse|{languages: TLanguage[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function Settings() {
    const projectPromise = getProject();
    const accessTokenPromise = getAccessTokenProject();
    const currenciesPromise:Promise<TErrorResponse|{currencies:TCurrency[]}> = getCurrencies();
    const languagesPromise:Promise<TErrorResponse|{languages:TLanguage[]}> = getLanguages();

    const [projectData, accessTokenProjectData, currenciesData, languagesData] = await Promise.all([projectPromise, accessTokenPromise, currenciesPromise, languagesPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorProjectAccessToken(accessTokenProjectData)) {
        return <></>;
    }
    if (isErrorCurrencies(currenciesData)) {
        return <></>;
    }
    if (isErrorLanguages(languagesData)) {
        return <></>;
    }

    const currencies = currenciesData.currencies.map(c => ({value: c.code, label: c.name}));
    const languages = languagesData.languages.map(c => ({value: c.code, label: c.name}));

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Settings'} />
            <FormEditProject project={projectData.project} accessToken={accessTokenProjectData.accessToken} currencies={currencies} languages={languages} />
        </div>
    )
}
