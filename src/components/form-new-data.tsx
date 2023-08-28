'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TStructure } from '@/types';

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export function FormNewData({structure}: {structure: TStructure}) {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<any>();

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const res = await fetch('/data/api', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, structureId: structure.id})
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: TErrorResponse | any  = await res.json();

            if (isError(dataJson)) {
                throw new Error('Fetch error');
            }

            const { structureId } = dataJson.data;

            router.refresh();
            router.push(`/structures/${structureId}`);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {structure.bricks.map((brick, i) => (
                    <div key={i}>
                        <label>{brick.name}</label>
                        <input {...register(brick.code, {required: true})} />
                        {errors.name && <span>This field is required</span>}
                    </div>
                ))}

                <input type="submit" value="Create" />
            </form>
        </>
    )
}