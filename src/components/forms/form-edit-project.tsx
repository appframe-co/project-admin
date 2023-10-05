'use client'

import { useController, useForm, SubmitHandler, UseControllerProps, useFieldArray} from 'react-hook-form'
import { FormValuesEditProject, TProject, TCurrencyOption } from '@/types'
import { Button } from '@/ui/button';
import { TextField } from '@/ui/text-field';
import { Card } from '@/ui/card';
import { Box } from '@/ui/box';
import { ProjectCurrencies } from '../project-currencies';
import { useEffect } from 'react';

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

export function FormEditProject({project, accessToken, currencies} : {project: TProject, accessToken: string, currencies:TCurrencyOption[]}) {
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
        } catch (e) {
            console.log(e);
        }
    }

    const currenciesFieldArray = useFieldArray({
        name: 'currencies',
        control
    });

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card title='Profile'>
                    <Box padding={16}>
                        <Input control={control} name='name' label='Name' rules={{ required: {message: 'is required', value: true} }} />
                        <TextField value={project.projectNumber} label='Project Number' ronChange={() => {}} disabled />
                        <TextField value={accessToken} label='Token' ronChange={() => {}} disabled helpText='Use this token for Project API' />
                    </Box>
                </Card>

                <ProjectCurrencies project={project} currenciesFieldArray={currenciesFieldArray} currencies={currencies} />

                <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}