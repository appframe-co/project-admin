'use client'

import { useController, useForm, SubmitHandler, UseControllerProps} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TEntry, TStructure } from '@/types';
import { TextField } from '@/ui/text-field';
import { Button } from '@/ui/button';
import { FileReference } from '@/components/bricks/file-reference';
import { Card } from '@/ui/card';
import { Box } from '@/ui/box';
import { ListSingleLineText } from '../bricks/list-single-line-text';
import { ListFileReference } from '../bricks/list-file-reference';

function isError(data: {userErrors: TUserErrorResponse[]} | {entry: TEntry}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

function Input(props: UseControllerProps<any> & {label?: string, helpText?: string, multiline?: boolean, type?: string}) {
    const { field, fieldState } = useController(props);

    return (
        <TextField 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value ?? ''}
            name={field.name}
            error={fieldState.error}
            label={props.label}
            helpText={props.helpText}
            multiline={props.multiline}
            type={props.type}
        />
    )
}

export function FormNewEntry({structure}: {structure: TStructure}) {
    const router = useRouter();
    const { control, handleSubmit, formState, setValue, setError, register, watch, getValues } = useForm<any>();

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const res = await fetch('/internal/api/entries', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({doc: data, structureId: structure.id})
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: {userErrors: TUserErrorResponse[]}|{entry: TEntry} = await res.json();

            if (isError(dataJson)) {
                dataJson.userErrors.forEach(d => {
                    setError(d.field.join('.'), {
                        message: d.message
                    });
                });
                return;
            }

            router.refresh();
            router.push(`/structures/${structure.id}`);
        } catch (e) {
            console.log(e);
        }
    }

    const watchGlobal = watch();

    const bricks = structure.bricks.map((brick, i) => {
        return (
            <div key={i}>
                {brick.type === 'single_line_text' && 
                    <Input control={control} name={brick.key} label={brick.name} helpText={brick.description} />}
                {brick.type === 'multi_line_text' && 
                    <Input control={control} name={brick.key} multiline={true} label={brick.name} helpText={brick.description} />}
                {brick.type === 'number_integer' && 
                    <Input control={control} name={brick.key} label={brick.name} helpText={brick.description} />}
                {brick.type === 'number_decimal' && 
                    <Input control={control} name={brick.key} label={brick.name} helpText={brick.description} />}
                {brick.type === 'file_reference' && 
                    <FileReference value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} />}
                {brick.type === 'list.file_reference' && 
                    <ListFileReference value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {(brick.type === 'list.single_line_text' || brick.type === 'list.number_integer' || brick.type === 'list.number_decimal') && 
                    <ListSingleLineText register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
            </div>
        )
    });

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card><Box padding={16}>{bricks}</Box></Card>
                <Button disabled={!formState.isDirty} submit={true} primary>Create</Button>
            </form>
        </>
    )
}