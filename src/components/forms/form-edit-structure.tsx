'use client'

import { useController, useForm, SubmitHandler, UseControllerProps, useFieldArray} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TStructure, FormValuesEditStructure, TBrick, TSchemaBrick } from '@/types'
import { TextField } from '@/ui/text-field'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { GroupOfBricks } from '../group-of-bricks'
import { useCallback, useState } from 'react'
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

export function FormEditStructure({structure, groupOfBricks, names} : TProps) {
    const [showGroupOfBricks, setShowGroupOfBricks] = useState<boolean>(false);
    const [activeModalBrick, setActiveModalBrick] = useState<boolean>(false);
    const [indexBrick, setIndexBrick] = useState<number|null>(null);
    const [brick, setBrick] = useState<TBrick>();
    const [schemaBrick, setSchemaBrick] = useState<TSchemaBrick>();
    const [namesValidation, setNamesValidation] = useState<{[key: string]: string}>();

    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors, isDirty }, watch } = useForm<FormValuesEditStructure>({defaultValues: structure});
    const { fields, append, remove, update } = useFieldArray({
        name: 'bricks',
        control
    });

    const handleChangeModalBrick = useCallback(() => setActiveModalBrick(!activeModalBrick), [activeModalBrick]);

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

            const { structure } = dataJson;

            router.refresh();
            router.push(`/structures/${structure.id}`);
        } catch (e) {
            console.log(e);
        }
    }

    const createBrick = (schemaBrick: TSchemaBrick): void => {
        const namesValidation = schemaBrick.validation.reduce((acc: {[key: string]: string}, v) => {
            acc[v.code] = v.name;
            return acc;
        }, {});

        setSchemaBrick(schemaBrick);
        setBrick({
            type: schemaBrick.type,
            name: '',
            key: '',
            description: '',
            validation: schemaBrick.validation.map(v => ({code: v.code, value: v.value}))
        });
        setNamesValidation(namesValidation);
        handleChangeModalBrick();
        setShowGroupOfBricks(false);
    };
    const updateBrick = (brick: TBrick, index: number) => {
        const schemaBricks: TSchemaBrick[] = [];
        Object.keys(groupOfBricks).forEach(group => {
            schemaBricks.push(...groupOfBricks[group]);
        });
        const schemaBrick: TSchemaBrick|undefined = schemaBricks.find(b => b.type === brick.type);
        if (schemaBrick) {
            const namesValidation = schemaBrick.validation.reduce((acc: {[key: string]: string}, v) => {
                acc[v.code] = v.name;
                return acc;
            }, {});

            setSchemaBrick(schemaBrick);
            setBrick(brick);
            setNamesValidation(namesValidation);
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
                        {brick && namesValidation && <FormBrick brick={brick} namesValidation={namesValidation} 
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

                <Button disabled={!isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}