'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { TContent, TFile, TCurrencyPreview, TSection, TSchemaField } from '@/types'

import { Button } from '@/ui/button'
import { Card } from '@/ui/card';
import { Box } from '@/ui/box';

import { FileReference } from '@/components/fields/file-reference';
import { ListFileReference } from '@/components/fields/list-file-reference';
import { ListSingleLineText } from '@/components/fields/list-single-line-text';
import { SingleLineText } from '@/components/fields/single-line-text';
import { MultiLineText } from '@/components/fields/multi-line-text';
import { NumberInteger } from '@/components/fields/number-integer';
import { NumberDecimal } from '@/components/fields/number-decimal';
import { BooleanField } from '@/components/fields/boolean-field';
import { DateTime } from '@/components/fields/date-time';
import { ListDateTime } from '@/components/fields/list-date-time';
import { DateField } from '@/components/fields/date';
import { ListDate } from '@/components/fields/list-date';
import { Money } from '@/components/fields/money';
import { RichText } from '@/components/fields/rich-text'
import { ColorPicker } from '@/components/fields/color-picker'
import { ListColorPicker } from '@/components/fields/list-color-picker'
import { Dimension } from '@/components/fields/dimension'
import { ListDimension } from '@/components/fields/list-dimension'

function isError(data: {userErrors: TUserErrorResponse[]} | {section: TSection}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

export function FormEditSection({content, section, files, currencies, schemaFields} : {content: TContent, section: TSection, files: TFile[], currencies: TCurrencyPreview[], schemaFields: TSchemaField[]}) {
    const { control, handleSubmit, formState, setValue, setError, register, watch, getValues, reset } = useForm<any>({defaultValues: {
        doc: section.doc
    }});
    const router = useRouter();

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const res = await fetch('/admin/internal/api/sections', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, id: section.id, contentId: content.id})
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
                });
                return;
            }

            reset(dataJson.section);
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    const watchGlobal = watch();

    const prefixName = 'doc.';
    const fields = content.sections.fields.map((field, i) => {
        const key = prefixName+field.key;

        const type = field.type.startsWith('list.') ?  field.type.substring(5) : field.type;

        return (
            <div key={i}>
                {field.type === 'single_line_text' && <SingleLineText prefixName={prefixName} field={field} control={control} />}
                {field.type === 'multi_line_text' && <MultiLineText prefixName={prefixName} field={field} control={control} />}
                {field.type === 'rich_text' && <RichText prefixName={prefixName} field={field} control={control} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} />}
                {field.type === 'number_integer' && <NumberInteger prefixName={prefixName} field={field} control={control} />}
                {field.type === 'number_decimal' && <NumberDecimal prefixName={prefixName} field={field} control={control} />}
                {field.type === 'boolean' && <BooleanField prefixName={prefixName} field={field} control={control} />}
                {field.type === 'date_time' && <DateTime prefixName={prefixName} field={field} control={control} />}
                {field.type === 'date' && <DateField prefixName={prefixName} field={field} control={control} />}
                {field.type === 'file_reference' && 
                    <FileReference filesRef={files.filter(f => f.id === getValues(key))} value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} />}
                {field.type === 'list.file_reference' && 
                    <ListFileReference filesRef={files.filter(f => getValues(key)?.includes(f.id))} value={getValues(key)} register={register(key)} error={formState.errors[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {(field.type === 'list.single_line_text' || field.type === 'list.number_integer' || field.type === 'list.number_decimal') && 
                    <ListSingleLineText value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {field.type === 'list.date_time' && 
                    <ListDateTime value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {field.type === 'list.date' && 
                    <ListDate value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {field.type === 'money' && 
                    <Money value={getValues(key)} currencies={currencies} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {field.type === 'url_handle' && <SingleLineText prefixName={prefixName} field={field} control={control} />}
                {field.type === 'color' && <ColorPicker prefixName={prefixName} field={field} control={control} />}
                {(field.type === 'list.color') && 
                    <ListColorPicker value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {field.type === 'url' && <SingleLineText prefixName={prefixName} field={field} control={control} />}
                {(field.type === 'list.url') && 
                    <ListSingleLineText value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {(field.type === 'dimension' || field.type === 'volume' || field.type === 'weight') && <Dimension prefixName={prefixName} 
                    field={field} control={control} schemaField={schemaFields.find(f => f.type === type)} />}
                {(field.type === 'list.dimension' || field.type === 'list.volume' || field.type === 'list.weight') && 
                    <ListDimension value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} watchGlobal={watchGlobal}
                    field={field} schemaField={schemaFields.find(f => f.type === type)} />}
            </div>
        )
    });

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card><Box padding={16}>{fields}</Box></Card>
                <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}