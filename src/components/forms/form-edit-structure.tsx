'use client'

import { useController, useForm, SubmitHandler, UseControllerProps, useFieldArray} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TStructure, FormValuesEditStructure, TBrick, TSchemaBrick } from '@/types'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field'
import { Card } from '@/ui/card'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { GroupOfBricks } from '../group-of-bricks'
import { Modal } from '@/ui/modal'
import styles from '@/styles/form-structure.module.css'
import { Box } from '@/ui/box'
import { FormBrick } from '../modals/form-brick'
import { StructureNotifications } from '../structure-notifications'
import { StructureTranslations } from '../structure-translations'

function isError(data: TErrorResponse|({userErrors: TUserErrorResponse[]} | {structure: TStructure})): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

function isUserError(data: {userErrors: TUserErrorResponse[]}|{structure: TStructure}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

function Input(props: UseControllerProps<FormValuesEditStructure> & {type?: string, label?: string, helpText?: string, multiline?: boolean}) {
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
            type={props.type}
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

    const router = useRouter();

    const { control, handleSubmit, formState, reset, setError, watch } = useForm<FormValuesEditStructure>({defaultValues: structure});
    const { fields, append, remove, update } = useFieldArray({
        name: 'bricks',
        control,
        keyName: 'uuid'
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
            const dataJson:{userErrors: TUserErrorResponse[]}|{structure: TStructure} = await res.json();
            if (isError(dataJson)) {
                setError('root', {type: 'manual', message: dataJson.description ?? ''});
                return;
            }
            if (isUserError(dataJson)) {
                dataJson.userErrors.forEach(d => {
                    const field = d.field.join('.') as any;
                    setError(field, {
                        message: d.message
                    });
                });
                return;
            }

            reset(dataJson.structure);
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    };

    const createBrick = (schemaBrick: TSchemaBrick): void => {
        setSchemaBrick(schemaBrick);
        setBrick({
            type: schemaBrick.type,
            name: '',
            key: '',
            description: '',
            validations: schemaBrick.validations.map(v => ({type: v.type, code: v.code, value: v.value}))
        });
        handleChangeModalBrick();
        setShowGroupOfBricks(false);
    };
    const updateBrick = (brick: TBrick, index: number) => {
        const type = brick.type.startsWith('list.') ? brick.type.slice(5) : brick.type;

        const schemaBricks: TSchemaBrick[] = [];
        Object.keys(groupOfBricks).forEach(group => {
            schemaBricks.push(...groupOfBricks[group]);
        });
        const schemaBrick: TSchemaBrick|undefined = schemaBricks.find(b => b.type === type);
        if (schemaBrick) {
            setSchemaBrick(schemaBrick);
            setBrick(brick);
            setIndexBrick(index);
            handleChangeModalBrick();
        }
    };

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
    const handleDeleteBrick = (): void => {
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

    const errorsBrick: any = formState.errors.bricks ?? [];

    return (
        <>
            {activeModalBrick && createPortal(
                <Modal
                    open={activeModalBrick}
                    onClose={handleClose}
                    title={brick?.name || schemaBrick?.name || ''}
                >
                    {brick && schemaBrick && <FormBrick 
                        errors={formState.errors.bricks && indexBrick !== null ? formState.errors.bricks[indexBrick]: []}  
                        brick={brick} schemaBrick={schemaBrick} bricks={fields}
                        handleClose={handleClose}
                        handleDeleteBrick={handleDeleteBrick} handleSubmitBrick={indexBrick !== null ? handleEditBrick : handleAddBrick} />}
                </Modal>,
                document.body
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <Box padding={16}>
                        <Input control={control} name='name' label='Name' />
                        <Input control={control} name='code' label='Code' helpText={`Code will be used in Project API`} />
                    </Box>
                </Card>

                <Card title='Bricks'>
                    <div className={styles.bricks}>
                        <Input control={control} name='bricks' type='hidden' />

                        {fields.map((brick, index: number) => (
                            <div key={brick.key} className={styles.brick} onClick={() => updateBrick(brick, index)}>
                                <div className={styles.name}>{brick.name}</div>
                                <div className={styles.key}>{brick.key}</div>
                                {errorsBrick[index]?.name && (
                                    <p className={styles.errorMsg}>{errorsBrick[index]?.name.message} (changes need to be made)</p>
                                )}
                                {errorsBrick[index]?.key && (
                                    <p className={styles.errorMsg}>{errorsBrick[index]?.key.message} (changes need to be made)</p>
                                )}
                                {errorsBrick[index]?.validations && (
                                    <p className={styles.errorMsg}>{errorsBrick[index]?.validations?.filter((v: any)=>v).length} changes need to be made</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <Box padding={16}>
                        <GroupOfBricks groupOfBricks={groupOfBricks} names={names} createBrick={createBrick} 
                            showGroupOfBricks={showGroupOfBricks} setShowGroupOfBricks={setShowGroupOfBricks} />
                    </Box>
                </Card>

                <StructureNotifications control={control} />
                <StructureTranslations control={control} />

                <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}