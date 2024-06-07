import type { Metadata } from 'next'
import { FormEditMenu } from '@/components/forms/form-edit-menu';
import { TMenu } from '@/types';
import { getMenu } from '@/services/menus';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'Edit menu | AppFrame'
}

export default async function EditStructure({ params }: {params: {id: string}}) {
    const {menu}: {menu: TMenu} = await getMenu(params.id);

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit ' + menu.title} />
            <FormEditMenu menu={menu} />
        </div>
    )
}