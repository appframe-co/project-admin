import type { Metadata } from 'next'
import { FormNewStructure } from '@/components/forms/form-new-structure'
import { Topbar } from '@/components/topbar'

export const metadata: Metadata = {
    title: 'New structure | AppFrame'
}

export default async function NewStructure() {
    return (
        <div>
            <Topbar title='New structure' />
            <FormNewStructure />
        </div>
    )
}