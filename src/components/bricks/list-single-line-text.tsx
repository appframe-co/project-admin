'use client'

import styles from '@/styles/bricks.module.css'
import { TBrick } from '@/types';
import { Button } from '@/ui/button';
import { TextField } from '@/ui/text-field';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { UseControllerProps, useController, useFieldArray, useForm } from 'react-hook-form';

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

export function ListSingleLineText({watchGlobal, register, error, setValue, brick, value=[]}: TProp) {
    const divInputListRef = useRef<null|HTMLDivElement>(null);
    const divInputRef = useRef<null|HTMLDivElement>(null);
    const [showFields, setShowFields] = useState<boolean>(false);
    const [rect, setRect] = useState<TRect>();

    const { control, watch } = useForm<any>({
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
                setValue(watch('list'));
                setShowFields(false);
            }
        };

        window.addEventListener('click', closeDropDown);

        return () => window.removeEventListener('click', closeDropDown);
    }, []);

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
                <input style={{display: 'none'}} {...register}/>
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
                                                <Input control={control} name={`list.${index}`} />
                                                {error && Array.isArray(error) && <div className={styles.msg}>{error[index]?.message}</div>}
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