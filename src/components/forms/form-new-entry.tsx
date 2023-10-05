'use client'

import { useForm, SubmitHandler} from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { TEntry, TStructure, TCurrencyPreview } from '@/types';

import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Box } from '@/ui/box';

import { FileReference } from '@/components/bricks/file-reference';
import { ListFileReference } from '@/components/bricks/list-file-reference';
import { ListSingleLineText } from '@/components/bricks/list-single-line-text';
import { SingleLineText } from '@/components/bricks/single-line-text';
import { MultiLineText } from '@/components/bricks/multi-line-text';
import { NumberInteger } from '@/components/bricks/number-integer';
import { NumberDecimal } from '@/components/bricks/number-decimal';
import { BooleanBrick } from '@/components/bricks/boolean-brick';
import { DateTime } from '@/components/bricks/date-time';
import { ListDateTime } from '../bricks/list-date-time';
import { DateBrick } from '../bricks/date';
import { ListDate } from '../bricks/list-date';
import { Money } from '../bricks/money';

function isError(data: {userErrors: TUserErrorResponse[]} | {entry: TEntry}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

export function FormNewEntry({structure, currencies}: {structure: TStructure, currencies: TCurrencyPreview[]}) {
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
                {brick.type === 'single_line_text' && <SingleLineText brick={brick} control={control} />}
                {brick.type === 'multi_line_text' && <MultiLineText brick={brick} control={control} />}
                {brick.type === 'number_integer' && <NumberInteger brick={brick} control={control} />}
                {brick.type === 'number_decimal' && <NumberDecimal brick={brick} control={control} />}
                {brick.type === 'boolean' && <BooleanBrick brick={brick} control={control} />}
                {brick.type === 'date_time' && <DateTime brick={brick} control={control} />}
                {brick.type === 'date' && <DateBrick brick={brick} control={control} />}
                {brick.type === 'file_reference' && 
                    <FileReference value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} />}
                {brick.type === 'list.file_reference' && 
                    <ListFileReference value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {(brick.type === 'list.single_line_text' || brick.type === 'list.number_integer' || brick.type === 'list.number_decimal') && 
                    <ListSingleLineText register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'list.date_time' && 
                    <ListDateTime value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'list.date' && 
                    <ListDate value={getValues(brick.key)} register={register(brick.key)} error={formState.errors[brick.key]} 
                    setValue={(v:any) => setValue(brick.key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'money' && 
                    <Money currencies={currencies} register={register(brick.key)} error={formState.errors[brick.key]} 
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