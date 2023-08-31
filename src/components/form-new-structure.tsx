'use client'

import { useController, useForm, SubmitHandler, UseControllerProps} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TStructure, FormValuesNewStructure } from '@/types'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field';

function isStructure(data: TErrorResponse | {structure: TStructure}): data is {structure: TStructure} {
    return (data as {structure: TStructure}).structure.id !== undefined;
}

function Input(props: UseControllerProps<FormValuesNewStructure> & {label?: string, helpText?: string, multiline?: boolean}) {
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

export function FormNewStructure() {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors, isDirty } } = useForm<FormValuesNewStructure>({
        defaultValues: {
            name: '',
            code: ''
        }
    });

    const onSubmit: SubmitHandler<FormValuesNewStructure> = async (data) => {
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
            const dataJson: TErrorResponse | {structure: TStructure}  = await res.json();
            if (!isStructure(dataJson)) {
                throw new Error('Fetch error');
            }

            const { structure } = dataJson;

            router.refresh();
            router.push(`/structures/${structure.id}/edit/bricks`);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input control={control} name='name' label='Name' rules={{ required: {message: 'is required', value: true} }} />
                <Input control={control} name='code' label='Code' helpText='Code will be used in API, e.g. /api/structures/[code]' rules={{ required: {message: 'is required', value: true} }}/>

                <Button disabled={!isDirty} submit={true} primary>Create</Button>
            </form>
        </>
    )
}