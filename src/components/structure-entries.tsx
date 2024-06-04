import { TBrick, TSchemaBrick, TStructure } from "@/types";
import { Box } from "@/ui/box";
import { Card } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { TextField } from "@/ui/text-field";
import { SubmitHandler, UseControllerProps, useController, useFieldArray, useForm } from "react-hook-form";
import styles from '@/styles/form-structure.module.css'
import { useCallback, useState } from "react";
import { useRouter } from 'next/navigation'
import { createPortal } from "react-dom";
import { Modal } from "@/ui/modal";
import { FormBrick } from "./modals/form-brick";
import { GroupOfBricks } from "./group-of-bricks";
import { Button } from "@/ui/button";

type TControllerProps = UseControllerProps<any> & {
    error?: string;
    label?: string;
    helpText?: string;
    multiline?: boolean;
    type?: string;
}

type TForm = {
    id: string;
    bricks: TBrick[];
}

type TProps = {
    defaultValues: TForm;
    groupOfBricks: {[key: string]: TSchemaBrick[]};
    names:{[key: string]: string};
}

function isError(data: TErrorResponse|({userErrors: TUserErrorResponse[]} | {structure: TStructure})): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

function isUserError(data: {userErrors: TUserErrorResponse[]}|{structure: TStructure}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

function Input({name, control, rules={},  ...props}: TControllerProps) {
    const { field, fieldState } = useController({name, control, rules});

    if (props.type === 'checkbox') {
        return <Checkbox 
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    error={fieldState.error || props.error}
                    label={props.label}
                    helpText={props.helpText}
                    innerRef={control?.register(name).ref}
                />
    }

    return <TextField 
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value ?? ''}
                name={field.name}
                error={fieldState.error || props.error}
                label={props.label}
                helpText={props.helpText}
                multiline={props.multiline}
                type={props.type}
            />
}

export function StructureEntries({defaultValues, groupOfBricks, names}: TProps) {
    const [showGroupOfBricks, setShowGroupOfBricks] = useState<boolean>(false);
    const [activeModalBrick, setActiveModalBrick] = useState<boolean>(false);
    const [indexBrick, setIndexBrick] = useState<number|null>(null);
    const [brick, setBrick] = useState<TBrick>();
    const [schemaBrick, setSchemaBrick] = useState<TSchemaBrick>();

    const router = useRouter();
    
    const { control, handleSubmit, formState, reset, setError } = useForm<TForm>({defaultValues});
    const { fields, append, remove, update } = useFieldArray({
        name: 'bricks',
        control,
        keyName: 'uuid'
    });

    const handleChangeModalBrick = useCallback(() => setActiveModalBrick(!activeModalBrick), [activeModalBrick]);

    const onSubmit: SubmitHandler<TForm> = async (data) => {
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

                <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}