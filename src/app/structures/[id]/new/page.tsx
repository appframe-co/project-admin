import type { Metadata } from 'next'
import Link from 'next/link'
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { FormNewData } from '@/components/form-new-data';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'New Data | AppFrame'
}

export default async function NewData({ params }: {params: {id: string}}) {
    const {structure}: {structure: TStructure} = await getStructure(params.id);

    return (
        <div>
            <Topbar title='New Data' />
            <FormNewData structure={structure} />
        </div>
    )
}