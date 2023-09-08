import type { Metadata } from 'next'
import { FormEditData } from '@/components/form-edit-data';
import { TData, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { getData } from '@/services/data';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
    title: 'Edit data | AppFrame'
}

export default async function EditData({ params }: {params: {id: string, dataId: string}}) {
    const structurePromise = getStructure(params.id);
    const dataPromise = getData(params.dataId, params.id);

    const [structureData, dataData] = await Promise.all([structurePromise, dataPromise]);

    const {structure}: {structure: TStructure} = structureData;
    const {data}: {data: TData} = dataData;

    return (
        <div>
            <Topbar title={'Edit data of ' + structure.name} />
            <FormEditData structure={structure} data={data} />
        </div>
    )
}