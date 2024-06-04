import type { Metadata } from 'next'
import { TFile, TProject, TSection, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { Topbar } from '@/components/topbar';
import { getProject } from '@/services/project';
import { FormEditTranslations } from '@/components/forms/form-edit-translations';
import { getSection } from '@/services/sections';

export const metadata: Metadata = {
    title: 'Edit translations | AppFrame'
}

function isErrorProject(data: TErrorResponse|{project: TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorStructure(data: TErrorResponse|{structure: TStructure}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorSection(data: TErrorResponse|{section: TSection}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function EditTranslations({ params }: {params: {id: string, sectionId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const structurePromise: Promise<TErrorResponse|{structure: TStructure}>  = getStructure(params.id);
    const sectionPromise: Promise<TErrorResponse|{section: TSection, files: TFile[]}> = getSection(params.sectionId, params.id);

    const [projectData, structureData, sectionData] = await Promise.all([projectPromise, structurePromise, sectionPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorStructure(structureData)) {
        return <></>;
    }
    if (isErrorSection(sectionData)) {
        return <></>;
    }

    const {structure} = structureData;
    const {section, files} = sectionData;

    const languages = projectData.project.languages.map(c => ({value: c.code, label: c.name}));

    const types = ['single_line_text', 'list.single_line_text', 'multi_line_text'];
    const keys = structure.sections.bricks.filter(b => types.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    const typesFiles = ['file_reference', 'list.file_reference'];
    const keysFiles = structure.sections.bricks.filter(b => typesFiles.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    return (
        <div className='page'>
            <Topbar title={'Edit translations'} back={`/structures/${structure.id}/sections/${section.id}`} />
            <FormEditTranslations structure={structure} languages={languages} 
                subject='section' subjectData={section}
                fields={keys} fieldsFiles={keysFiles} files={files} />
        </div>
    )
}