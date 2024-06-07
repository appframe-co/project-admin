import type { Metadata } from 'next'
import { FormNewMenu } from '@/components/forms/form-new-menu'
import { Topbar } from '@/components/topbar'

export const metadata: Metadata = {
    title: 'New menu | AppFrame'
}

export default async function NewMenu() {
    return (
        <div className='page pageAlignCenter'>
            <Topbar title='New menu' />
            <FormNewMenu />
        </div>
    )
}