import type { Metadata } from 'next'
import { FormNewStructure } from '@/components/form-new-structure'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'New structure | AppFrame'
}

export default async function NewStructure() {
    return (
        <>
            <main>
                <p>New structure</p>
                <div><Link href='/structures'>Back</Link></div>
                <FormNewStructure />
            </main>
        </>
    )
}