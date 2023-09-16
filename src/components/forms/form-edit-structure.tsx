'use client'

import { useController, useForm, SubmitHandler, UseControllerProps, useFieldArray} from 'react-hook-form'
import { TStructure, FormValuesEditStructure, TBrick, TSchemaBrick } from '@/types'
import { TextField } from '@/ui/text-field'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { GroupOfBricks } from '../group-of-bricks'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from '@/ui/modal'
import { Box } from '@/ui/box'
import { FormBrick } from '../modals/form-brick'
import styles from '@/styles/form-structure.module.css'

function isStructure(data: TErrorResponse | {structure: TStructure}): data is {structure: TStructure} {
    return (data as {structure: TStructure}).structure.id !== undefined;
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

type TProps = {
    structure: TStructure, 
    groupOfBricks: {[key: string]: TSchemaBrick[]}, 
    names:{[key: string]: string}
}
type TSchemaValidation = {
    [key: string]: {name: string, desc: string}
}

export function FormEditStructure({structure, groupOfBricks, names} : TProps) {
    const [showGroupOfBricks, setShowGroupOfBricks] = useState<boolean>(false);
    const [activeModalBrick, setActiveModalBrick] = useState<boolean>(false);
    const [indexBrick, setIndexBrick] = useState<number|null>(null);
    const [brick, setBrick] = useState<TBrick>();
    const [schemaBrick, setSchemaBrick] = useState<TSchemaBrick>();
    const [schemaValidation, setSchemaValidation] = useState<TSchemaValidation>();

    const { control, handleSubmit, formState, watch, reset, getValues } = useForm<FormValuesEditStructure>({defaultValues: structure});
    const { fields, append, remove, update } = useFieldArray({
        name: 'bricks',
        control
    });

    const handleChangeModalBrick = useCallback(() => setActiveModalBrick(!activeModalBrick), [activeModalBrick]);

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
          reset(getValues());
        }
    }, [formState, structure, reset]);

    const onSubmit: SubmitHandler<FormValuesEditStructure> = async (data) => {
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
        } catch (e) {
            console.log(e);
        }
    }

    const createBrick = (schemaBrick: TSchemaBrick): void => {
        const schemaValidation = schemaBrick.validations.reduce((acc: TSchemaValidation, v) => {
            acc[v.code] = {
                name: v.name,
                desc: v.desc
            };
            return acc;
        }, {});

        setSchemaBrick(schemaBrick);
        setBrick({
            type: schemaBrick.type,
            name: '',
            key: '',
            description: '',
            validations: schemaBrick.validations.map(v => ({code: v.code, value: v.value}))
        });
        setSchemaValidation(schemaValidation);
        handleChangeModalBrick();
        setShowGroupOfBricks(false);
    };
    const updateBrick = (brick: TBrick, index: number) => {
        const schemaBricks: TSchemaBrick[] = [];
        Object.keys(groupOfBricks).forEach(group => {
            schemaBricks.push(...groupOfBricks[group]);
        });
        const arType = brick.type.split('.');
        const type = arType.length === 1 ? arType[0] : arType[1];

        const schemaBrick: TSchemaBrick|undefined = schemaBricks.find(b => b.type === type);
        if (schemaBrick) {
            const schemaValidation = schemaBrick.validations.reduce((acc: TSchemaValidation, v) => {
                acc[v.code] = {
                    name: v.name,
                    desc: v.desc
                };
                return acc;
            }, {});

            setSchemaBrick(schemaBrick);
            setBrick(brick);
            setSchemaValidation(schemaValidation);
            setIndexBrick(index);
            handleChangeModalBrick();
        }
    }

    const handleAddBrick = (brick: TBrick): void => {
        append(brick);
        handleChangeModalBrick();
    };
    const handleEditBrick = (brick: TBrick): void => {
        if (indexBrick !== null) {
            update(indexBrick, brick);
            handleChangeModalBrick();
            setIndexBrick(null);
        }
    };
    const handleDeleteBrick = (brick: TBrick): void => {
        if (indexBrick !== null) {
            remove(indexBrick);
            handleChangeModalBrick();
            setIndexBrick(null);
        }
    };

    const handleClose = () => {
        handleChangeModalBrick();
        setIndexBrick(null);
    };

    return (
        <>
            {activeModalBrick && createPortal(
                    <Modal
                        open={activeModalBrick}
                        onClose={handleClose}
                        title={brick?.name || schemaBrick?.name || ''}
                    >
                        {brick && schemaValidation && schemaBrick && <FormBrick brick={brick} schemaBrick={schemaBrick} schemaValidation={schemaValidation} 
                            handleSubmitBrick={indexBrick !== null ? handleEditBrick : handleAddBrick} handleDeleteBrick={handleDeleteBrick}
                            handleClose={handleClose} indexBrick={indexBrick} />}
                    </Modal>,
                document.body
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <Box padding={16}>
                        <Input control={control} name='name' label='Name' rules={{ required: {message: 'is required', value: true} }} />
                        <Input control={control} name='code' label='Code' helpText={`Code will be used in API, e.g. /api/structures/${watch('code') || 'example'}`} rules={{ required: {message: 'is required', value: true} }}/>
                    </Box>
                </Card>

                <Card title='Bricks'>
                    <div className={styles.bricks}>
                        {fields.map(({id, ...brick}, index: number) => (
                            <div key={id} className={styles.brick} onClick={() => updateBrick(brick, index)}>
                                <div className={styles.name}>{brick.name}</div>
                                <div className={styles.key}>{brick.key}</div>
                            </div>
                        ))}
                    </div>

                    <Box padding={16}>
                        <GroupOfBricks groupOfBricks={groupOfBricks} names={names} createBrick={createBrick} 
                            showGroupOfBricks={showGroupOfBricks} setShowGroupOfBricks={setShowGroupOfBricks} />
                    </Box>
                </Card>

                <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}