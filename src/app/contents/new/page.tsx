import type { Metadata } from 'next'
import { FormNewContent } from '@/components/forms/form-new-content'
import { Topbar } from '@/components/topbar'
import { getSchemaFields } from '@/services/schema-fields';
import { TSchemaField } from '@/types';

export const metadata: Metadata = {
    title: 'New content | AppFrame'
}

export default async function NewContent() {
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
            <Topbar title='New content' />
            <FormNewContent groupOfFields={groupOfFields} names={names} />
        </div>
    )
}