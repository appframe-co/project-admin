import type { Metadata } from 'next'
import { FormEditMenu } from '@/components/forms/form-edit-menu';
import { TMenu, TSchemaField } from '@/types';
import { getMenu } from '@/services/menus';
import { Topbar } from '@/components/topbar';
import { getSchemaFields } from '@/services/schema-fields';

export const metadata: Metadata = {
    title: 'Edit menu | AppFrame'
}

export default async function EditMenu({ params }: {params: {id: string}}) {
    const {menu}: {menu: TMenu} = await getMenu(params.id);

    const {schemaFields}: {schemaFields: TSchemaField[]} = await getSchemaFields();

    const groupOfFields = schemaFields.reduce((acc: {[key: string]: TSchemaField[]}, field) => {
        if (!acc.hasOwnProperty(field.groupCode)) {
            acc[field.groupCode] = [];
        }

        acc[field.groupCode].push(field);
        return acc;
    }, {});

    const names: {[key: string]: string} = {text: 'Text', date_time: 'Date and Time', number: 'Number', reference: 'Reference', other: 'Other'};

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit ' + menu.name} />
            <FormEditMenu menu={menu} groupOfFields={groupOfFields} names={names} />
        </div>
    )
}