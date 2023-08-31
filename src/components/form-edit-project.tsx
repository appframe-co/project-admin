'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { FormValuesEditStructure, TProject } from '@/types'

function isProject(data: TErrorResponse | {project: TProject}): data is {project: TProject} {
    return (data as {project: TProject}).project.id !== undefined;
}

export function FormEditProject({project} : {project: TProject}) {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValuesEditStructure>({defaultValues: project});

    const onSubmit: SubmitHandler<FormValuesEditStructure> = async (data) => {
        try {
            const res = await fetch('/internal/api/project', {
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
            if (!isProject(dataJson)) {
                throw new Error('Fetch error');
            }

            const { project } = dataJson;

            router.refresh();
            router.push(`/settings`);
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

                <input type="submit" value="Update" />
            </form>
        </>
    )
}