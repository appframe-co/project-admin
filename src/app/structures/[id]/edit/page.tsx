import type { Metadata } from 'next'
import Link from 'next/link'
import { FormEditStructure } from '@/components/form-edit-structure';
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'Edit structure | AppFrame'
}

export default async function EditStructure({ params }: {params: {id: string}}) {
    const {structure}: {structure: TStructure} = await getStructure(params.id);

    return (
        <div>
            <Topbar title={'Edit schema of ' + structure.name}>
                <Link href={`/structures/${params.id}/edit/bricks`}>Manage bricks</Link>
            </Topbar>
            <FormEditStructure structure={structure} />
        </div>
    )
}