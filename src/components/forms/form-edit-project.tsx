'use client'

import { useController, useForm, SubmitHandler, UseControllerProps, useFieldArray, UseFieldArrayReturn} from 'react-hook-form'
import { FormValuesEditProject, TProject, TCurrencyOption, TLanguageOption } from '@/types'
import { useEffect } from 'react';
import { Button } from '@/ui/button';
import { TextField } from '@/ui/text-field';
import { Card } from '@/ui/card';
import { Box } from '@/ui/box';
import { ProjectCurrencies } from '@/components/project-currencies';
import { ProjectLanguages } from '@/components/project-languages';
import { useRouter } from 'next/navigation'

function isProject(data: TErrorResponse | {project: TProject}): data is {project: TProject} {
    return (data as {project: TProject}).project.id !== undefined;
}

function Input(props: UseControllerProps<FormValuesEditProject> & {label?: string, helpText?: string, multiline?: boolean}) {
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

type TProps = {
    project: TProject; 
    accessToken: string; 
    currencies: TCurrencyOption[];
    languages: TLanguageOption[];
}

export function FormEditProject({project, accessToken, currencies, languages} : TProps) {
    const router = useRouter();
    const { control, handleSubmit, formState, getValues, reset } = useForm<FormValuesEditProject>({defaultValues: project});

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
          reset(getValues());
        }
    }, [formState, project, reset]);

    const onSubmit: SubmitHandler<FormValuesEditProject> = async (data) => {
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

            router.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    const currenciesFieldArray = useFieldArray({
        name: 'currencies',
        control
    });
    const languagesFieldArray = useFieldArray({
        name: 'languages',
        control
    });

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card title='Profile'>
                    <Box padding={16}>
                        <Input control={control} name='name' label='Name' rules={{ required: {message: 'is required', value: true} }} />
                        <TextField value={project.projectNumber} label='Project Number' disabled />
                        <TextField value={accessToken} label='Token' disabled helpText='Use this token for Project API' />
                    </Box>
                </Card>

                <ProjectCurrencies project={project} currenciesFieldArray={currenciesFieldArray} currencies={currencies} />
                <ProjectLanguages project={project} languagesFieldArray={languagesFieldArray} languages={languages} />

                <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}