import type { Metadata } from 'next'
import { FormNewStructure } from '@/components/forms/form-new-structure'
import { Topbar } from '@/components/topbar'
import { getSchemaBricks } from '@/services/schema-bricks';
import { TSchemaBrick } from '@/types';

export const metadata: Metadata = {
    title: 'New structure | AppFrame'
}

export default async function NewStructure() {
    const {schemaBricks=[]}: {schemaBricks: TSchemaBrick[]} = await getSchemaBricks();

    const groupOfBricks = schemaBricks.reduce((acc: {[key: string]: TSchemaBrick[]}, brick) => {
        if (!acc.hasOwnProperty(brick.groupCode)) {
            acc[brick.groupCode] = [];
        }

        acc[brick.groupCode].push(brick);
        return acc;
    }, {});

    const names: {[key: string]: string} = {text: 'Text', number: 'Number', reference: 'Reference'};

    return (
        <div className='page pageAlignCenter'>
            <Topbar title='New structure' />
            <FormNewStructure groupOfBricks={groupOfBricks} names={names} />
        </div>
    )
}