'use client'

import { useEffect } from 'react';
import { useForm, SubmitHandler} from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { TEntry, TStructure, TFile } from '@/types'

import { Button } from '@/ui/button'
import { Card } from '@/ui/card';
import { Box } from '@/ui/box';

import { FileReference } from '@/components/bricks/file-reference';
import { ListFileReference } from '@/components/bricks/list-file-reference';
import { ListSingleLineText } from '@/components/bricks/list-single-line-text';
import { SingleLineText } from '@/components/bricks/single-line-text';
import { MultiLineText } from '@/components/bricks/multi-line-text';
import { NumberInteger } from '@/components/bricks/number-integer';
import { NumberDecimal } from '@/components/bricks/number-decimal';
import { BooleanBrick } from '../bricks/boolean-brick';
import { DateTime } from '../bricks/date-time';
import { ListDateTime } from '../bricks/list-date-time';
import { DateBrick } from '../bricks/date';
import { ListDate } from '../bricks/list-date';

function isError(data: {userErrors: TUserErrorResponse[]} | {entry: TEntry}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

export function FormEditEntry({structure, entry, files} : {structure: TStructure, entry: TEntry, files: TFile[]}) {
    const { control, handleSubmit, formState, setValue, setError, register, watch, getValues, reset } = useForm<any>({defaultValues: entry.doc});
    const router = useRouter();

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
          reset(getValues());
        }
    }, [formState, structure, reset]);

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const res = await fetch('/internal/api/entries', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({doc: data, id: entry.id, structureId: structure.id})
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
        } catch (e) {
            console.log(e);
        }
    }

    const watchGlobal = watch();

    const bricks = structure.bricks.map((brick, i) => {
        return (
            <div key={i}>
                {brick.type === 'single_line_text' && <SingleLineText brick={brick} control={control} />}
                {brick.type === 'multi_line_text' && <MultiLineText brick={brick} control={control} />}
                {brick.type === 'number_integer' && <NumberInteger brick={brick} control={control} />}
                {brick.type === 'number_decimal' && <NumberDecimal brick={brick} control={control} />}
                {brick.type === 'boolean' && <BooleanBrick brick={brick} control={control} />}
                {brick.type === 'date_time' && <DateTime brick={brick} control={control} />}
                {brick.type === 'date' && <DateBrick brick={brick} control={control} />}
                {brick.type === 'file_reference' && 
                    <FileReference filesRef={files.filter(f => f.id === getValues(brick.key))} value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} />}
                {brick.type === 'list.file_reference' && 
                    <ListFileReference filesRef={files.filter(f => getValues(brick.key)?.includes(f.id))} value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {(brick.type === 'list.single_line_text' || brick.type === 'list.number_integer' || brick.type === 'list.number_decimal') && 
                    <ListSingleLineText value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'list.date_time' && 
                    <ListDateTime value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'list.date' && 
                    <ListDate value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
            </div>
        )
    });

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card><Box padding={16}>{bricks}</Box></Card>
                <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}