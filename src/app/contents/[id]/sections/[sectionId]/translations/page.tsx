import type { Metadata } from 'next'
import { TFile, TProject, TSection, TContent } from '@/types';
import { getContent } from '@/services/contents';
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
function isErrorContent(data: TErrorResponse|{content: TContent}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorSection(data: TErrorResponse|{section: TSection}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function EditTranslations({ params }: {params: {id: string, sectionId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const contentPromise: Promise<TErrorResponse|{content: TContent}>  = getContent(params.id);
    const sectionPromise: Promise<TErrorResponse|{section: TSection, files: TFile[]}> = getSection(params.sectionId, params.id);

    const [projectData, contentData, sectionData] = await Promise.all([projectPromise, contentPromise, sectionPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorContent(contentData)) {
        return <></>;
    }
    if (isErrorSection(sectionData)) {
        return <></>;
    }

    const {content} = contentData;
    const {section, files} = sectionData;

    const languages = projectData.project.languages.map(c => ({value: c.code, label: c.name}));

    const types = ['single_line_text', 'list.single_line_text', 'multi_line_text', 'rich_text'];
    const keys = content.sections.fields.filter(b => types.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    const typesFiles = ['file_reference', 'list.file_reference'];
    const keysFiles = content.sections.fields.filter(b => typesFiles.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    return (
        <div className='page'>
            <Topbar title={'Edit translations'} back={`/contents/${content.id}/sections/${section.id}`} />
            <FormEditTranslations content={content} languages={languages} 
                subject='section' subjectData={section}
                fields={keys} fieldsFiles={keysFiles} files={files} />
        </div>
    )
}