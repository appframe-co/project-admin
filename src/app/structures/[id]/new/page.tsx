import type { Metadata } from 'next'
import Link from 'next/link'
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { FormNewData } from '@/components/form-new-data';

export const metadata: Metadata = {
    title: 'New Data | AppFrame'
}

export default async function NewData({ params }: {params: {id: string}}) {
    const {structure}: {structure: TStructure} = await getStructure(params.id);

    return (
        <>
            <main>
                <p>New Data</p>
                <Link href={`/structures/${params.id}`}>Back</Link>
                <FormNewData structure={structure} />
            </main>
        </>
    )
}