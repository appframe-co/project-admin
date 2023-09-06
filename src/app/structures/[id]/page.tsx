import type { Metadata } from 'next'
import Link from 'next/link';
import { TStructure } from '@/types';
import { getStructure } from '@/services/structures';
import { getDataList } from '@/services/data';
import styles from '@/styles/structure.module.css'
import { DeleteData } from '@/components/delete-data';
import { Topbar } from '@/components/topbar';
import { resizeImg } from '@/utils/resize-img';

export const metadata: Metadata = {
  title: 'Structure | AppFrame'
}

export default async function Structures({ params }: { params: { id: string } }) {
  const structurePromise = getStructure(params.id);
  const dataPromise = getDataList(params.id);

  const [structureData, dataData] = await Promise.all([structurePromise, dataPromise]);

  const {structure}: {structure: TStructure} = structureData;
  const {data, names, codes}: any = dataData;

  const values = data.map((d: any) => codes.map((c: string) => d[c]));

  return (
    <div>
      <Topbar title={structure.name}>
        <Link href={`/structures/${params.id}/edit`}>Edit schema</Link>
        <Link href={`/structures/${params.id}/new`}>Add data</Link>
      </Topbar>

      <div>
        <table className={styles.structure}>
          <thead>
            <tr>
              {names.map((name: string) => (
                <th>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map((value: any, i: number) => (
              <tr>
                {value.map((v: any) => (
                  <td>
                    {Array.isArray(v) && <img src={resizeImg(v[0].src, {w: 65, h: 65})} />}

                    {!Array.isArray(v) && v}
                  </td>
                ))}
                <td><Link href={`/structures/${structure.id}/${data[i]['id']}/edit`}>Edit</Link></td>
                <td><DeleteData structureId={structure.id} id={data[i]['id']} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
