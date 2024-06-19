import type { Metadata } from 'next'
import { FormNewMenu } from '@/components/forms/form-new-menu'
import { Topbar } from '@/components/topbar'
import { TSchemaField } from '@/types';
import { getSchemaFields } from '@/services/schema-fields';

export const metadata: Metadata = {
    title: 'New menu | AppFrame'
}

export default async function NewMenu() {
    const {schemaFields=[]}: {schemaFields: TSchemaField[]} = await getSchemaFields();

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
            <Topbar title='New menu' />
            <FormNewMenu groupOfFields={groupOfFields} names={names} />
        </div>
    )
}