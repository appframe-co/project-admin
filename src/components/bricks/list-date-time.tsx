'use client'

import styles from '@/styles/bricks.module.css'
import { TBrick } from '@/types';
import { Button } from '@/ui/button';
import { TextField } from '@/ui/text-field';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { UseControllerProps, useController, useFieldArray, useForm } from 'react-hook-form';

type TProp = {
    register: any;
    error: any;
    setValue: any;
    brick: TBrick;
    value?: any;
    watchGlobal: any;
}
type TRect = {
    top: number, left: number, width: number
}

type TControllerProps = UseControllerProps & {
    label?: string;
    helpText?: string;
    multiline?: boolean;
    type?: string;
}
function Input({name, control, ...props}: TControllerProps) {
    const { field, fieldState } = useController({name, control});

    return (
        <TextField 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value ?? ''}
            name={field.name}
            error={fieldState.error}
            type={props.type}
        />
    )
}

export function ListDateTime({watchGlobal, register, error, setValue, brick, value=[]}: TProp) {
    const divInputListRef = useRef<null|HTMLDivElement>(null);
    const divInputRef = useRef<null|HTMLDivElement>(null);
    const [showFields, setShowFields] = useState<boolean>(false);
    const [rect, setRect] = useState<TRect>();

    const { control, watch, formState } = useForm<any>({
        defaultValues: {
            list: value
        }
    });
    const { fields, append, remove } = useFieldArray({
        name: 'list',
        control
    });

    useEffect(() => {
        const closeDropDown = (event: Event) => {
            if (!divInputRef.current) {
                return;
            }

            if (!event.composedPath().includes(divInputRef.current as HTMLDivElement) && 
                !event.composedPath().includes(divInputListRef.current as HTMLDivElement)
            ) {
                if (formState.isDirty) {
                    setValue(watch('list'));
                }
                setShowFields(false);
            }
        };

        window.addEventListener('click', closeDropDown);

        return () => window.removeEventListener('click', closeDropDown);
    }, [formState.isDirty]);

    useEffect(() => {
        if (!divInputRef.current) {
            return;
        }

        const rect = divInputRef.current.getBoundingClientRect();
        setRect({top: rect.top + window.scrollY, left: rect.left, width: rect.width});
    }, [watchGlobal]);

    return (
        <>
            <div ref={divInputRef} className={styles.field} onClick={() => setShowFields((prevState: any) => !prevState)}>
                <div className={styles.name}>{brick.name}</div>
                <div className={styles.info}>{brick.description}</div>
                <select style={{display: 'none'}} {...register} multiple />
                <div className={styles.input + (error ? ' '+styles.errorInput : '')}>
                    {watch('list') && (
                        <>
                            <div>{watch('list').join(' • ')}</div>
                            <div>{watch('list').length} {watch('list').length > 1 ? 'items' : 'item'}</div>
                        </>
                    )}
                </div>
            </div>
            {showFields && createPortal(
                <div ref={divInputListRef} style={{position:'absolute',width:rect?.width,top:rect?.top,left:rect?.left}}>
                    <div className={styles.wrapper}>
                        <div className={styles.container}>
                            <div className={styles.name}>{brick.name}</div>
                            {error && !fields.length && <div className={styles.error}>{error?.message}</div>}
                            <form>
                                <ul>
                                    {fields.map((item, index) => (
                                        <li key={item.id} className={styles.fieldList}>
                                            <div className={styles.infoField}>
                                                <Input control={control} name={`list.${index}`} type='datetime-local' />
                                                {error && Array.isArray(error) && <div className={styles.error}>{error[index]?.message}</div>}
                                            </div>
                                            <div><Button onClick={() => remove(index)}>Delete</Button></div>
                                        </li>
                                    ))}
                                </ul>
                                <Button onClick={() => append('')}>Add item</Button>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}