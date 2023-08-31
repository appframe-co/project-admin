import type { Metadata } from 'next'
import Link from 'next/link'
import { FormEditData } from '@/components/form-edit-data';
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { getData } from '@/services/data';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'Edit data | AppFrame'
}

export default async function EditData({ params }: {params: {id: string, dataId: string}}) {
    const structurePromise = getStructure(params.id);
    const dataPromise = getData(params.dataId);

    const [structureData, dataData] = await Promise.all([structurePromise, dataPromise]);

    const {structure}: {structure: TStructure} = structureData;
    const {data}: {data: any} = dataData;

    return (
        <div>
            <Topbar title={'Edit data of ' + structure.name} />
            <FormEditData structure={structure} data={data} />
        </div>
    )
}