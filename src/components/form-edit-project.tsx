'use client'

import { useController, useForm, SubmitHandler, UseControllerProps} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { FormValuesEditStructure, TProject } from '@/types'
import { Button } from '@/ui/button';
import { TextField } from '@/ui/text-field';

function isProject(data: TErrorResponse | {project: TProject}): data is {project: TProject} {
    return (data as {project: TProject}).project.id !== undefined;
}

function Input(props: UseControllerProps<FormValuesEditStructure> & {label?: string, helpText?: string, multiline?: boolean}) {
    const { field, fieldState } = useController(props);

    return (
        <TextField 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            error={fieldState.error}
            label={props.label}
            helpText={props.helpText}
            multiline={props.multiline}
        />
    )
}

export function FormEditProject({project, accessToken} : {project: TProject, accessToken: string}) {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors, isDirty } } = useForm<FormValuesEditStructure>({defaultValues: project});

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
                <Input control={control} name='name' label='Name' rules={{ required: {message: 'is required', value: true} }} />
                <TextField value={project.projectNumber} label='Project Number' ronChange={() => {}} disabled />
                <TextField value={accessToken} label='Token' ronChange={() => {}} disabled helpText='Use this token for Project API' />

                <Button disabled={!isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}