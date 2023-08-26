'use client'

import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import styles from '@/styles/bricks-editor.module.css'
import { TStructure, FormValuesManageBricks, TSchemaBricks } from '@/types'
import { useState } from 'react'

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
    const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FormValuesManageBricks>({
        defaultValues: {id: structureId, bricks: structure.bricks}
    });
    const { fields, append, remove } = useFieldArray({
        name: 'bricks',
        control
    });

    const watchBricks = watch("bricks");

    const onSubmit: SubmitHandler<FormValuesManageBricks> = async (data) => {
        try {
            const res = await fetch('/structures/api', {
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

    const selectSchemaBrick = (id: string):void => {
        const schemaBrick = schemaBricks.find(b => b.id === id);
        if (!schemaBrick) {
            return;
        }

        append({
            type: schemaBrick.type,
            name: schemaBrick.name,
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
                    {layer === 'bricks' && (
                        <div className={styles.bricks}>
                            <div>
                                {watchBricks?.map((b, i) => {
                                    return (
                                        <div key={i}>
                                            <div onClick={() => selectBrick(i)}>{b.name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <div onClick={() => setLayer('schemaBricks')}>+ New Brick</div>
                            </div>
                        </div>
                    )}

                    {layer === 'schemaBricks' && (
                        <div className={styles.schemaBricks}>
                            {schemaBricks.map(schemaBrick => (
                                <div key={schemaBrick.id}>
                                    <div onClick={() => selectSchemaBrick(schemaBrick.id)}>{schemaBrick.name}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {layer === 'brick' && activeIndexBrick != undefined && (
                        <div className={styles.brick}>
                            <div>
                                <label>Name</label>
                                <input {...register(`bricks.${activeIndexBrick}.name`)} />
                            </div>
                            <div>
                                <label>Code</label>
                                <input {...register(`bricks.${activeIndexBrick}.code`)} />
                            </div>
                            <hr />
                            <div>
                                <p>Validation rules</p>
                                <div>
                                    {fields[activeIndexBrick].validation.map((v, i) => {
                                        return (
                                            <div key={i}>
                                                <input {...register(`bricks.${activeIndexBrick}.validation.${i}.value`)} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <button type="button" onClick={deleteBrick}>Delete Brick</button>
                            <button type="button" onClick={() => setLayer('bricks')}>Back</button>
                        </div>
                    )}
                </div>
                <div className={styles.viewOfBricks}>
                    <div>
                        {watchBricks?.map((b, i) => {
                            return (
                                <div key={i}>
                                    {b.type === 'text' && (
                                        <div>
                                            {b.name}
                                            <input  />
                                        </div>
                                    )}
                                    {b.type === 'rich_text' && (
                                        <div>
                                            {b.name}
                                            <textarea  />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        <input type="submit" />
                    </div>
                </div>
            </div>
        </form>
    )
}