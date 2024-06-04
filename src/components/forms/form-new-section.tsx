'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { TStructure, TCurrencyPreview, TSection } from '@/types';

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

function isError(data: {userErrors: TUserErrorResponse[]} | {section: TSection}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

export function FormNewSection({structure, currencies, parentId}: {structure: TStructure, currencies: TCurrencyPreview[], parentId?: string|undefined}) {
    const router = useRouter();
    const { control, handleSubmit, formState, setValue, setError, register, watch, getValues } = useForm<any>({
        defaultValues: {
            doc: {}
        }
    });

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const res = await fetch('/internal/api/sections', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, structureId: structure.id, parentId})
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: {userErrors: TUserErrorResponse[]}|{section: TSection} = await res.json();

            if (isError(dataJson)) {
                dataJson.userErrors.forEach(d => {
                    setError(d.field.join('.'), {
                        message: d.message
                    });

                    if (d.value) {
                        setValue(d.field.join('.'), d.value);
                    }
                });
                return;
            }

            router.refresh();
            router.push(`/structures/${structure.id}/sections/${dataJson.section.id}`);
        } catch (e) {
            console.log(e);
        }
    }

    const watchGlobal = watch();

    const prefixName = 'doc.';
    const bricks = structure.sections.bricks.map((brick, i) => {
        const key = prefixName+brick.key;

        return (
            <div key={i}>
                {brick.type === 'single_line_text' && <SingleLineText prefixName={prefixName} brick={brick} control={control} />}
                {brick.type === 'multi_line_text' && <MultiLineText prefixName={prefixName} brick={brick} control={control} />}
                {brick.type === 'number_integer' && <NumberInteger prefixName={prefixName} brick={brick} control={control} />}
                {brick.type === 'number_decimal' && <NumberDecimal prefixName={prefixName} brick={brick} control={control} />}
                {brick.type === 'boolean' && <BooleanBrick prefixName={prefixName} brick={brick} control={control} />}
                {brick.type === 'date_time' && <DateTime prefixName={prefixName} brick={brick} control={control} />}
                {brick.type === 'date' && <DateBrick prefixName={prefixName} brick={brick} control={control} />}
                {brick.type === 'file_reference' && 
                    <FileReference value={getValues(key)} register={register(key)} error={formState.errors[key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} brick={brick} />}
                {brick.type === 'list.file_reference' && 
                    <ListFileReference value={getValues(key)} register={register(key)} error={formState.errors[key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {(brick.type === 'list.single_line_text' || brick.type === 'list.number_integer' || brick.type === 'list.number_decimal') && 
                    <ListSingleLineText register={register(key)} error={formState.errors[key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'list.date_time' && 
                    <ListDateTime value={getValues(key)} register={register(key)} error={formState.errors[key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'list.date' && 
                    <ListDate value={getValues(key)} register={register(key)} error={formState.errors[key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'money' && 
                    <Money currencies={currencies} register={register(key)} error={formState.errors[key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} brick={brick} watchGlobal={watchGlobal} />}
                {brick.type === 'url_handle' && <SingleLineText prefixName={prefixName} brick={brick} control={control} />}
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