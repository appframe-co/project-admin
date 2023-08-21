'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'

type Inputs = {
    name: string;
    code: string
}

export function FormNewStructure() {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await fetch('/structures/api', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson = await res.json();
            if (dataJson.error) {
                throw new Error('Fetch error');
            }

            router.refresh();
            router.push('/structures');
        } catch (e) {
            console.log(e)
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

                <input type="submit" value="Create" />
            </form>
        </>
    )
}