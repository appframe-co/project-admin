'use client'

import { useController, useForm, SubmitHandler, UseControllerProps, useFieldArray} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { FormValuesMenu, TItemForm, TMenu } from '@/types'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field';
import { Card } from '@/ui/card'
import { Box } from '@/ui/box'
import styles from '@/styles/form-menu.module.css'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from '@/ui/modal'
import { FormItem } from '../modals/form-item'

function isUserError(data: {userErrors: TUserErrorResponse[]}|{menu: TMenu}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

function Input(props: UseControllerProps<FormValuesMenu> & {type?: string, label?: string, helpText?: string, multiline?: boolean}) {
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
    structures: {value: string, label: string}[]
}
export function FormNewMenu(props: TProps) {
    const defaultItem = {
        type: 'http',
        title: '',
        url: '',
        subject: null,
        subjectId: null,
    };

    const [index, setIndex] = useState<number>(-1);
    const [item, setItem] = useState<TItemForm>(defaultItem);
    const router = useRouter();
    const [activeModalItem, setActiveModalItem] = useState<boolean>(false);

    const handleChangeModalItem = useCallback(() => setActiveModalItem(!activeModalItem), [activeModalItem]);

    const { control, handleSubmit, formState, watch, setError, getValues } = useForm<FormValuesMenu>({
        defaultValues: {
            title: '',
            handle: '',
            items: []
        }
    });

    const { fields, append, remove, update, move } = useFieldArray({
        name: 'items',
        control,
        keyName: 'uuid'
    });

    const onSubmit: SubmitHandler<FormValuesMenu> = async (data) => {
        try {
            const res = await fetch('/internal/api/menus', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: {userErrors: TUserErrorResponse[]}|{menu: TMenu} = await res.json();

            if (isUserError(dataJson)) {
                dataJson.userErrors.forEach(d => {
                    const field = d.field.join('.') as any;
                    setError(field, {
                        message: d.message
                    });
                });
                return;
            }

            router.refresh();
            router.push(`/menus/${dataJson.menu.id}`);
        } catch (e) {
            console.log(e)
        }
    };

    const handleItem = (item: TItemForm) => {
        if (index === -1) {
            append(item);
        } else {
            update(index, item);
        }
    };

    const showModalItem = (item: TItemForm, index: number=-1) => {
        setItem(item);
        setIndex(index);
        handleChangeModalItem();
    };

    const handleDeleteItem = (index: number):void => {
        remove(index);
    };

    const handleMovePostion = (from: number, to: number) => {
        if (to <= -1 || to >= fields.length) {
            return;
        }

        move(from, to);
    };

    return (
        <>
            {activeModalItem && createPortal(
                <Modal
                    open={activeModalItem}
                    onClose={handleChangeModalItem}
                    title={index === -1 ? 'Add menu item' : 'Edit menu item'}
                >
                    <FormItem index={index} item={item} handleItem={handleItem} 
                        options={props.structures} handleClose={handleChangeModalItem} />
                </Modal>,
                document.body
            )}

            <div className='mb20'>
                {formState.errors.root && <p>{formState.errors.root.message}</p>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <Box padding={16}>
                        <Input control={control} name='title' label='Title' />
                        <Input control={control} name='handle' label='Handle' helpText={`Handle will be used in Project API`} />
                    </Box>
                </Card>
                <Card title='Menu items'>
                    <Box padding={16}>
                        {!fields.length && <p>This menu doesn't have any items.</p>}

                        <div className={styles.items}>
                            {fields.map((item, index: number) => (
                                <div key={item.uuid} className={styles.item}>
                                    <div className={styles.title}>{item.title}</div>
                                    <div className={styles.controls}>
                                        <div className={styles.position}>
                                            <span onClick={() => handleMovePostion(index, index-1)}>Up</span>
                                            <span onClick={() => handleMovePostion(index, index+1)}>Down</span>
                                        </div>
                                        <div className={styles.buttons}>
                                            <Button onClick={() => showModalItem(item, index)}>Edit</Button>
                                            <Button onClick={() => handleDeleteItem(index)}>Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                       <Button onClick={() => showModalItem(defaultItem)}>Add menu item</Button>
                    </Box>
                </Card>

                <Button disabled={!formState.isDirty} submit={true} primary>Add</Button>
            </form>
        </>
    )
}