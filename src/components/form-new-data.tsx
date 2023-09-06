'use client'

import { useState } from 'react';
import { useController, useForm, SubmitHandler, UseControllerProps} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TStructure, TImage } from '@/types';
import { TextField } from '@/ui/text-field';
import { Button } from '@/ui/button';
import { ImageBrick } from './bricks/image';

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

function Input(props: UseControllerProps<any> & {label?: string, helpText?: string, multiline?: boolean}) {
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

export function FormNewData({structure}: {structure: TStructure}) {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors, isDirty } } = useForm<any>();
    const [imagesFieldList, setImagesFieldList] = useState({});

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const res = await fetch('/internal/api/data', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({doc: data, structureId: structure.id, images: imagesFieldList})
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: TErrorResponse | any  = await res.json();

            if (isError(dataJson)) {
                throw new Error('Fetch error');
            }

            const { structureId } = dataJson.data;

            router.refresh();
            router.push(`/structures/${structureId}`);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {structure.bricks.map((brick, i) => (
                    <div key={i}>
                        {brick.type === 'text' && 
                            <Input control={control} name={brick.code} label={brick.name} rules={{ required: {message: 'is required', value: true} }} />}
                        {brick.type === 'rich_text' && 
                            <Input control={control} name={brick.code} multiline={true} label={brick.name} rules={{ required: {message: 'is required', value: true} }} />}
                        {brick.type === 'image' && (
                            <ImageBrick brick={brick} imagesFieldList={imagesFieldList} setImagesFieldList={setImagesFieldList} />
                        )}
                    </div>
                ))}

                <Button disabled={!isDirty} submit={true} primary>Create</Button>
            </form>
        </>
    )
}