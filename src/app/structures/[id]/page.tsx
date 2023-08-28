import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { getDataList } from '@/services/data';
import styles from '@/styles/structure.module.css'
import { DeleteData } from '@/components/delete-data';

export const metadata: Metadata = {
  title: 'Structure | AppFrame'
}

export default async function Structures({ params }: { params: { id: string } }) {
  const structurePromise = getStructure(params.id);
  const dataPromise = getDataList(params.id);

  const [structureData, dataData] = await Promise.all([structurePromise, dataPromise]);

  const {structure}: {structure: TStructure} = structureData;
  const {data}: any = dataData;

  const names = structure.bricks.map(b => b.name);
  const codes = structure.bricks.map(b => b.code);
  const values = data.map((d: any) => codes.map(c => d[c]));

  return (
    <main>
      <p>Structure</p>
      <p>
          <Link href={'/structures'}>Back</Link>
      </p>
      <p>
          <Link href={`/structures/${params.id}/edit`}>Edit schema layer</Link>
      </p>
      <div>
        <h2>{structure.name}</h2>

        <div>
          <Link href={`/structures/${params.id}/new`}>Add data</Link>
          <table className={styles.structure}>
            <thead>
              <tr>
                {names.map(name => (
                  <th>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.map((value: any, i: number) => (
                <tr>
                  {value.map((v:any) => (
                    <td>{v}</td>
                  ))}
                  <td><Link href={`/structures/${structure.id}/${data[i]['id']}/edit`}>Edit</Link></td>
                  <td><DeleteData structureId={structure.id} id={data[i]['id']} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  </main>
  )
}
