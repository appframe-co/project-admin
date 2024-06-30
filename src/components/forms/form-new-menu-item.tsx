'use client'

import { useForm, SubmitHandler, useController, UseControllerProps } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { TCurrencyPreview, TMenu, TItem } from '@/types';

import { Button } from '@/ui/button';
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
import { Select } from '@/ui/select';
import { RichText } from '../fields/rich-text';
import { ColorPicker } from '../fields/color-picker';
import { ListColorPicker } from '../fields/list-color-picker';

function isError(data: {userErrors: TUserErrorResponse[]} | {item: TItem}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

type TProps = {
    menu: TMenu;
    currencies: TCurrencyPreview[];
    parentId?: string|undefined;
    options: {value: string, label: string}[];
}

type TControllerProps = UseControllerProps<any> & {
    error?: string;
    label?: string;
    helpText?: string;
    multiline?: boolean;
    type?: string;
    disabled?: boolean;
    options?: any;
}

function SelectField({name, control, rules={},  ...props}: TControllerProps) {
    const { field, fieldState } = useController({name, control, rules});

    return <Select 
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value ?? ''}
        name={field.name}
        error={fieldState.error}
        label={props.label}
        helpText={props.helpText}
        options={props.options}
    />
}

export function FormNewMenuItem({menu, currencies, parentId, options}: TProps) {
    const router = useRouter();
    const { control, handleSubmit, formState, setValue, setError, register, watch, getValues } = useForm<any>({
        defaultValues: {
            subject: null,
            subjectId: null,
            doc: {}
        }
    });

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const res = await fetch('/internal/api/menu_items', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, menuId: menu.id, parentId})
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: {userErrors: TUserErrorResponse[]}|{item: TItem} = await res.json();

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
            router.push(`/menus/${menu.id}/items/${dataJson.item.id}`);
        } catch (e) {
            console.log(e);
        }
    }

    const watchGlobal = watch();

    const prefixName = 'doc.';
    const fields = menu.items.fields.map((field, i) => {
        const key = prefixName+field.key;

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
                    <FileReference value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} />}
                {field.type === 'list.file_reference' && 
                    <ListFileReference value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {(field.type === 'list.single_line_text' || field.type === 'list.number_integer' || field.type === 'list.number_decimal') && 
                    <ListSingleLineText register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {field.type === 'list.date_time' && 
                    <ListDateTime value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {field.type === 'list.date' && 
                    <ListDate value={getValues(key)} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
                    setValue={(v:any) => setValue(key, v, {shouldDirty: true})} field={field} watchGlobal={watchGlobal} />}
                {field.type === 'money' && 
                    <Money currencies={currencies} register={register(key)} error={(formState.errors['doc'] as any)?.[field.key]} 
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
            </div>
        )
    });

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card><Box padding={16}>{fields}</Box></Card>
                <Card title='Ref'>
                    <Box padding={16}>
                        <div>
                            <SelectField control={control} name='subject' options={[{value: '', label: 'Select a subject'}, {value: 'content', label: 'Content'}]} />

                            {watch('subject') === 'content' && (
                                <SelectField control={control} name='subjectId' options={[{value: '', label: 'Select a content'}, ...options]} />
                            )}
                        </div>
                    </Box>
                </Card>
                <Button disabled={!formState.isDirty} submit={true} primary>Create</Button>
            </form>
        </>
    )
}