import type { Metadata } from 'next'
import { FormEditStructure } from '@/components/forms/form-edit-structure';
import { TSchemaBrick, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { Topbar } from '@/components/topbar';
import { getSchemaBricks } from '@/services/schema-bricks';

export const metadata: Metadata = {
    title: 'Edit structure | AppFrame'
}

export default async function EditStructure({ params }: {params: {id: string}}) {
    const {structure}: {structure: TStructure} = await getStructure(params.id);
    const {schemaBricks}: {schemaBricks: TSchemaBrick[]} = await getSchemaBricks();

    const groupOfBricks = schemaBricks.reduce((acc: {[key: string]: TSchemaBrick[]}, brick) => {
        if (!acc.hasOwnProperty(brick.groupCode)) {
            acc[brick.groupCode] = [];
        }

        acc[brick.groupCode].push(brick);
        return acc;
    }, {});

    const names: {[key: string]: string} = {text: 'Text', date_time: 'Date and Time', number: 'Number', reference: 'Reference', other: 'Other'};

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit ' + structure.name} />
            <FormEditStructure structure={structure} groupOfBricks={groupOfBricks} names={names} />
        </div>
    )
}