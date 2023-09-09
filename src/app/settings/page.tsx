import type { Metadata } from 'next';
import { FormEditProject } from "@/components/forms/form-edit-project";
import { getProject, getAccessTokenProject } from "@/services/project"
import { TProject } from "@/types";
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'Settings | AppFrame'
  }

export default async function Settings() {
    const projectPromise = getProject();
    const accessTokenPromise = getAccessTokenProject();

    const [projectData, accessTokenProjectData] = await Promise.all([projectPromise, accessTokenPromise]);
    const { project }: {project: TProject} = projectData;
    const { accessToken }: {projectId: string, accessToken: string} = accessTokenProjectData;

    return (
        <div>
            <Topbar title={'Settings'} />
            <FormEditProject project={project} accessToken={accessToken} />
        </div>
    )
}
