import type { Metadata } from 'next'
import { FormEditContent } from '@/components/forms/form-edit-content';
import { TSchemaField, TContent } from '@/types';
import { getContent } from '@/services/contents';
import { Topbar } from '@/components/topbar';
import { getSchemaFields } from '@/services/schema-fields';

export const metadata: Metadata = {
    title: 'Edit content | AppFrame'
}

export default async function EditContent({ params }: {params: {id: string}}) {
    const {content}: {content: TContent} = await getContent(params.id);
    const {schemaFields}: {schemaFields: TSchemaField[]} = await getSchemaFields();

    const groupOfFields = schemaFields.reduce((acc: {[key: string]: TSchemaField[]}, field) => {
        if (!acc.hasOwnProperty(field.groupCode)) {
            acc[field.groupCode] = [];
        }

        acc[field.groupCode].push(field);
        return acc;
    }, {});

    const names: {[key: string]: string} = {text: 'Text', date_time: 'Date and Time', measurement: 'Measurement', number: 'Number', reference: 'Reference', other: 'Other'};

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit ' + content.name} />
            <FormEditContent content={content} groupOfFields={groupOfFields} names={names} />
        </div>
    )
}