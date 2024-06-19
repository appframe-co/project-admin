import type { Metadata } from 'next'
import { TEntry, TFile, TProject, TContent } from '@/types';
import { getContent } from '@/services/contents';
import { getEntry } from '@/services/entries';
import { Topbar } from '@/components/topbar';
import { getProject } from '@/services/project';
import { FormEditTranslations } from '@/components/forms/form-edit-translations';

export const metadata: Metadata = {
    title: 'Edit translations | AppFrame'
}

function isErrorProject(data: TErrorResponse|{project: TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorContent(data: TErrorResponse|{content: TContent}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorEntry(data: TErrorResponse|{entry: TEntry}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function EditTranslations({ params }: {params: {id: string, entryId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const contentPromise: Promise<TErrorResponse|{content: TContent}>  = getContent(params.id);
    const entryPromise: Promise<TErrorResponse|{entry:TEntry, files: TFile[]}> = getEntry(params.entryId, params.id);

    const [projectData, contentData, entryData] = await Promise.all([projectPromise, contentPromise, entryPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorContent(contentData)) {
        return <></>;
    }
    if (isErrorEntry(entryData)) {
        return <></>;
    }

    const {content} = contentData;
    const {entry, files} = entryData;

    const languages = projectData.project.languages.map(c => ({value: c.code, label: c.name}));

    const types = ['single_line_text', 'list.single_line_text', 'multi_line_text'];
    const keys = content.entries.fields.filter(b => types.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    const typesFiles = ['file_reference', 'list.file_reference'];
    const keysFiles = content.entries.fields.filter(b => typesFiles.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    return (
        <div className='page'>
            <Topbar title={'Edit translations'} back={`/contents/${content.id}/entries/${entry.id}`} />
            <FormEditTranslations content={content} languages={languages} 
                subject='entry' subjectData={entry}
                fields={keys} fieldsFiles={keysFiles} files={files} />
        </div>
    )
}