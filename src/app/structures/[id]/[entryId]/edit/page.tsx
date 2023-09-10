import type { Metadata } from 'next'
import { FormEditEntry } from '@/components/forms/form-edit-entry';
import { TEntry, TFile, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { getEntry } from '@/services/entries';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'Edit entry | AppFrame'
}

export default async function EditEntry({ params }: {params: {id: string, entryId: string}}) {
    const structurePromise = getStructure(params.id);
    const entryPromise = getEntry(params.entryId, params.id);

    const [structureData, entryData] = await Promise.all([structurePromise, entryPromise]);

    const {structure}: {structure: TStructure} = structureData;
    const {entry, files}: {entry: TEntry, files: TFile[]} = entryData;

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit entry of ' + structure.name} />
            <FormEditEntry structure={structure} entry={entry} files={files} />
        </div>
    )
}