import type { Metadata } from 'next'
import { FormEditMenu } from '@/components/forms/form-edit-menu';
import { TMenu, TStructure } from '@/types';
import { getMenu } from '@/services/menus';
import { Topbar } from '@/components/topbar';
import { getStructures } from '@/services/structures';

export const metadata: Metadata = {
    title: 'Edit menu | AppFrame'
}

export default async function EditStructure({ params }: {params: {id: string}}) {
    const {menu}: {menu: TMenu} = await getMenu(params.id);
    
    const {structures=[]}:{structures: (TStructure & {entriesCount: number})[]} = await getStructures();

    const options = structures.map(s => ({value:s.id, label:s.name}));

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit ' + menu.title} />
            <FormEditMenu menu={menu} structures={options} />
        </div>
    )
}