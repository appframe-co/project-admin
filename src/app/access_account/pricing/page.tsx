import type { Metadata } from 'next';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'Select a plan | AppFrame'
}

export default async function Pricing() {
    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Select a plan'} />
        </div>
    )
}
