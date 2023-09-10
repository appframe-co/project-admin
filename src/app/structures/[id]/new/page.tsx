import type { Metadata } from 'next'
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { Topbar } from '@/components/topbar';
import { FormNewEntry } from '@/components/forms/form-new-entry';

export const metadata: Metadata = {
    title: 'New Entry | AppFrame'
}

export default async function NewEntry({ params }: {params: {id: string}}) {
    const {structure}: {structure: TStructure} = await getStructure(params.id);

    return (
        <div className='page pageAlignCenter'>
            <Topbar title='New Entry' />
            <FormNewEntry structure={structure} />
        </div>
    )
}