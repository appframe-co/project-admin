import type { Metadata } from 'next'
import { FormNewMenu } from '@/components/forms/form-new-menu'
import { Topbar } from '@/components/topbar'
import { TStructure } from '@/types';
import { getStructures } from '@/services/structures';

export const metadata: Metadata = {
    title: 'New menu | AppFrame'
}

export default async function NewMenu() {
    const {structures=[]}:{structures: (TStructure & {entriesCount: number})[]} = await getStructures();

    const options = structures.map(s => ({value:s.id, label:s.name}));

    return (
        <div className='page pageAlignCenter'>
            <Topbar title='New menu' />
            <FormNewMenu structures={options} />
        </div>
    )
}