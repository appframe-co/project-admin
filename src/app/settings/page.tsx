import type { Metadata } from 'next';
import { FormEditProject } from "@/components/forms/form-edit-project";
import { getProject, getAccessTokenProject } from "@/services/project"
import { TCurrency, TProject } from "@/types";
import { Topbar } from '@/components/topbar';
import { getCurrencies } from '@/services/system';

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

export default async function Settings() {
    const projectPromise = getProject();
    const accessTokenPromise = getAccessTokenProject();
    const currenciesPromise:Promise<TErrorResponse|{currencies:TCurrency[]}> = getCurrencies();

    const [projectData, accessTokenProjectData, currenciesData] = await Promise.all([projectPromise, accessTokenPromise, currenciesPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorProjectAccessToken(accessTokenProjectData)) {
        return <></>;
    }
    if (isErrorCurrencies(currenciesData)) {
        return <></>;
    }

    
    const currencies = currenciesData.currencies.map(c => ({value: c.code, label: c.name}));

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Settings'} />
            <FormEditProject project={projectData.project} accessToken={accessTokenProjectData.accessToken} currencies={currencies} />
        </div>
    )
}
