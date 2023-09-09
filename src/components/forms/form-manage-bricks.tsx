'use client'

import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import styles from '@/styles/bricks-editor.module.css'
import { TStructure, FormValuesManageBricks, TSchemaBricks } from '@/types'
import { useState } from 'react'
import { Bricks } from '@/components/layers/bricks'
import { SchemaBricks } from '@/components/layers/schema-bricks'
import { Brick } from '@/components/layers/brick'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field'

function isStructure(data: TErrorResponse | {structure: TStructure}): data is {structure: TStructure} {
    return (data as {structure: TStructure}).structure.id !== undefined;
}

export function FormManageBricks(
    {schemaBricks, structure, structureId}:
    {schemaBricks: TSchemaBricks[], structure: TStructure, structureId: string}) 
{
    const [layer, setLayer] = useState<string>('bricks');
    const [activeIndexBrick, setActiveIndexBrick] = useState<number>();
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors, isDirty }, watch } = useForm<FormValuesManageBricks>({
        defaultValues: {id: structureId, bricks: structure.bricks}
    });
    const { fields, append, remove } = useFieldArray({
        name: 'bricks',
        control
    });

    const watchBricks = watch("bricks");

    const onSubmit: SubmitHandler<FormValuesManageBricks> = async (data) => {
        try {
            const res = await fetch('/internal/api/structures', {
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
            if (!isStructure(dataJson)) {
                throw new Error('Fetch error');
            }

            const { structure } = dataJson;

            router.refresh();
            router.push(`/structures/${structure.id}/edit`);
        } catch (e) {
            console.log(e);
        }
    };

    const selectSchemaBrick = (id: string): void => {
        const schemaBrick = schemaBricks.find(b => b.id === id);
        if (!schemaBrick) {
            return;
        }

        append({
            type: schemaBrick.type,
            name: schemaBrick.name,
            code: schemaBrick.type,
            validation: schemaBrick.validation.map(v => ({code: v.code, value: v.value}))
        });

        setActiveIndexBrick(fields.length);
        setLayer('brick');
    };
    const selectBrick = (index: number):void => {
        setActiveIndexBrick(index);
        setLayer('brick');
    };
    const deleteBrick = () => {
        setActiveIndexBrick((prevState: number|undefined) => {
            if (prevState !== undefined) {
                remove(prevState);
            }
            return undefined;
        });

        setLayer('bricks');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.editor}>
                <div className={styles.layers}>
                    {layer === 'bricks' && <Bricks bricks={watchBricks} selectBrick={selectBrick} setLayer={setLayer} />}
                    {layer === 'schemaBricks' && <SchemaBricks setLayer={setLayer} schemaBricks={schemaBricks} selectSchemaBrick={selectSchemaBrick} />}
                    {layer === 'brick' && activeIndexBrick != undefined && <Brick 
                        register={register} fields={fields} setLayer={setLayer}
                        deleteBrick={deleteBrick} activeIndexBrick={activeIndexBrick}/>}
                </div>
                <div className={styles.viewOfBricks}>
                    <div>
                        {watchBricks?.map((b, i) => {
                            return (
                                <div key={i}>
                                    {b.type === 'text' && (
                                        <TextField label={b.name} onChange={()=>{}} />
                                    )}
                                    {b.type === 'rich_text' && (
                                        <TextField multiline label={b.name} onChange={()=>{}} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <Button disabled={!isDirty} submit={true} primary>Save</Button>
                    </div>
                </div>
            </div>
        </form>
    )
}