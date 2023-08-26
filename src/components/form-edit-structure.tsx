'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TStructure, FormValuesEditStructure } from '@/types'

function isStructure(data: TErrorResponse | {structure: TStructure}): data is {structure: TStructure} {
    return (data as {structure: TStructure}).structure.id !== undefined;
}

export function FormEditStructure({structure} : {structure: TStructure}) {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValuesEditStructure>({defaultValues: structure});

    const onSubmit: SubmitHandler<FormValuesEditStructure> = async (data) => {
        try {
            const res = await fetch('/structures/api', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson = await res.json();
            if (!isStructure(dataJson)) {
                throw new Error('Fetch error');
            }

            const { structure } = dataJson;

            router.refresh();
            router.push(`/structures/${structure.id}`);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name</label>
                    <input {...register("name", {required: true})} />
                    {errors.name && <span>This field is required</span>}
                </div>
                <div>
                    <label>Code</label>
                    <input {...register("code", {required: true})} />
                    {errors.code && <span>This field is required</span>}
                </div>

                <input type="submit" value="Update" />
            </form>
        </>
    )
}