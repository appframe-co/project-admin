import type { Metadata } from 'next'
import { TEntry, TFile, TProject, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
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
function isErrorStructure(data: TErrorResponse|{structure: TStructure}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorEntry(data: TErrorResponse|{entry: TEntry}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function EditTranslations({ params }: {params: {id: string, entryId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const structurePromise: Promise<TErrorResponse|{structure: TStructure}>  = getStructure(params.id);
    const entryPromise: Promise<TErrorResponse|{entry:TEntry, files: TFile[]}> = getEntry(params.entryId, params.id);

    const [projectData, structureData, entryData] = await Promise.all([projectPromise, structurePromise, entryPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorStructure(structureData)) {
        return <></>;
    }
    if (isErrorEntry(entryData)) {
        return <></>;
    }

    const {structure} = structureData;
    const {entry, files} = entryData;

    const languages = projectData.project.languages.map(c => ({value: c.code, label: c.name}));

    const types = ['single_line_text', 'list.single_line_text', 'multi_line_text'];
    const keys = structure.bricks.filter(b => types.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    const typesFiles = ['file_reference', 'list.file_reference'];
    const keysFiles = structure.bricks.filter(b => typesFiles.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    return (
        <div className='page'>
            <Topbar title={'Edit translations'} back={`/structures/${structure.id}/entries/${entry.id}`} />
            <FormEditTranslations structure={structure} entry={entry} languages={languages} fields={keys} fieldsFiles={keysFiles} files={files} />
        </div>
    )
}