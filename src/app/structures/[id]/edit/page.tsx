import type { Metadata } from 'next'
import Link from 'next/link'
import { FormEditStructure } from '@/components/form-edit-structure';
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';

export const metadata: Metadata = {
    title: 'Edit structure | AppFrame'
}

export default async function EditStructure({ params }: {params: {id: string}}) {
    const {structure}: {structure: TStructure} = await getStructure(params.id);

    return (
        <>
            <main>
                <p>Edit Schema structure</p>
                <Link href={`/structures/${params.id}`}>Back</Link>
                <p>
                    <Link href={`/structures/${params.id}/edit/bricks`}>Manage bricks</Link>
                </p>
                <FormEditStructure structure={structure} />
            </main>
        </>
    )
}