import type { Metadata } from 'next';
import Link from 'next/link';
import { FormManageBricks } from '@/components/form-manage-bricks';
import { TSchemaBricks, TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { getSchemaBricks } from '@/services/schema-bricks';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
  title: 'Manage bricks | AppFrame'
}

export default async function Bricks({ params }: { params: { id: string } }) {
  const schemaBricksPromise = getSchemaBricks();
  const structurePromise = getStructure(params.id);

  const [schemaBricksData, structureData] = await Promise.all([schemaBricksPromise, structurePromise]);
  
  const {schemaBricks}: {schemaBricks: TSchemaBricks[]} = schemaBricksData;
  const {structure}: {structure: TStructure} = structureData;

  return (
    <div>
      <Topbar title={'Manage bricks of ' + structure.name} />
      <FormManageBricks schemaBricks={schemaBricks} structure={structure} structureId={params.id} />
    </div>
  )
}
