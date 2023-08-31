import { FormEditProject } from "@/components/form-edit-project";
import { getProject, getAccessTokenProject } from "@/services/project"
import { TProject } from "@/types";

export default async function Settings() {
    const projectPromise = getProject();
    const accessTokenPromise = getAccessTokenProject();

    const [projectData, accessTokenProjectData] = await Promise.all([projectPromise, accessTokenPromise]);
    const { project }: {project: TProject} = projectData;
    const { accessToken }: {projectId: string, accessToken: string} = accessTokenProjectData;

    return (
        <div>
            <h2>Settings</h2>

            <p>Project name: {project.name}</p>
            <p>Project number: {project.projectNumber}</p>

            <div>
                <p>Token: <strong>{accessToken}</strong></p>
                <p>Use this token for Project API</p>
            </div>
            <hr />
            <div>
                <FormEditProject project={project} />
            </div>
        </div>
    )
}
