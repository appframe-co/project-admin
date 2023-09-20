import type { Metadata } from 'next';
import { FormEditProject } from "@/components/forms/form-edit-project";
import { getProject, getAccessTokenProject } from "@/services/project"
import { TProject } from "@/types";
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'Settings | AppFrame'
}

function isErrorProject(data: TErrorResponse|{project:TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorProjectAccessToken(data: TErrorResponse|{projectId: string, accessToken: string}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function Settings() {
    const projectPromise = getProject();
    const accessTokenPromise = getAccessTokenProject();

    const [projectData, accessTokenProjectData] = await Promise.all([projectPromise, accessTokenPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorProjectAccessToken(accessTokenProjectData)) {
        return <></>;
    }

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Settings'} />
            <FormEditProject project={projectData.project} accessToken={accessTokenProjectData.accessToken} />
        </div>
    )
}
