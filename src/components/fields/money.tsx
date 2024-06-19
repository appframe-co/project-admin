'use client'

import styles from '@/styles/fields.module.css'
import { TField, TCurrencyPreview } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RegisterOptions, UseControllerProps, useController, useFieldArray, useForm } from 'react-hook-form';
import { TextField } from '@/ui/text-field';
import { Button } from '@/ui/button';

type TProp = {
    register: any;
    error: any;
    setValue: any;
    field: TField;
    value?: any;
    watchGlobal: any;
    currencies: TCurrencyPreview[]
}
type TRect = {
    top: number, left: number, width: number
}
type TControllerProps = UseControllerProps<any> & {
    label?: string;
    helpText?: string;
    multiline?: boolean;
    prefix?: string;
    placeholder?: string;
    type?: string;
}

function Input({name, control, ...props}: TControllerProps) {
    const { field, fieldState } = useController({name, control});

    const onChange =  (e: Event) => {
        const target = e.target as HTMLInputElement;
        return field.onChange(parseFloat(target.value) || '');
    };

    return <TextField 
                onChange={onChange}
                onBlur={field.onBlur}
                value={field.value}
                name={field.name}
                error={fieldState.error}
                label={props.label}
                helpText={props.helpText}
                multiline={props.multiline}
                prefix={props.prefix}
                placeholder={props.placeholder}
                type={props.type}
            />
}

export function Money({watchGlobal, register, error, setValue, field, value=[], currencies}: TProp) {
    const divInputListRef = useRef<null|HTMLDivElement>(null);
    const divInputRef = useRef<null|HTMLDivElement>(null);
    const [showFields, setShowFields] = useState<boolean>(false);
    const [rect, setRect] = useState<TRect>();

    const { control, watch, formState, reset} = useForm<{list: {amount: number|string, currencyCode: string}[]}>({
        defaultValues: {
            list: value ?? []
        }
    });
    const { fields, append, remove } = useFieldArray({
        name: 'list',
        control
    });

    useEffect(() => {
        reset();

        const codes = value ? value.map((v: any) => v.currencyCode) : [];
    
        currencies.filter(c => !codes.includes(c.code)).forEach(c => {
            append({amount: '', currencyCode: c.code});
        });
    }, []);

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

    const fieldsJSX = fields.map((item, index) => {
        const currencyProject = currencies.find(c => c.code === item.currencyCode);
        if (!currencyProject) {
            return (
                <li key={item.id} className={styles.fieldList}>
                    <div className={styles.infoField}>
                        {item.amount} {item.currencyCode} (not selected in Project currencies)
                    </div>
                    <Button onClick={() => remove(index)}>Delete</Button>
                </li>
            )
        }

        const helpText = currencyProject.primary ? 'Primary' : '';

        return (
            <li key={item.id} className={styles.fieldList}>
                <div className={styles.infoField}>
                    <Input control={control} name={`list.${index}.amount`} 
                    prefix={currencyProject.symbol} placeholder={'0.00'} type='number' helpText={helpText} />
                    {error && Array.isArray(error) && <div className={styles.error}>{error[index]?.amount?.message}</div>}
                </div>
            </li>
        )
    });

    const listStr = watch('list').filter(l => {
        if (!l.amount) {
            return false;
        }

        const currencyProject = currencies.find(c => c.code === l.currencyCode);
        if (!currencyProject) {
            return false;
        }

        return true;
    }).map((l, k) => {
        const currencyProject = currencies.find(c => c.code === l.currencyCode);
        if (currencyProject) {
            return <span key={l.currencyCode}>{k ? ' • ' : ''}{currencyProject.symbol}{l.amount}</span>;
        }
    })

    return (
        <>
            <div ref={divInputRef} className={styles.field} onClick={() => setShowFields((prevState: any) => !prevState)}>
                <div className={styles.name}>{field.name}</div>
                <div className={styles.info}>{field.description}</div>
                <select style={{display: 'none'}} {...register} multiple />
                <div className={styles.input + (error ? ' '+styles.errorInput : '')}>
                    {watch('list') && (
                        <>
                            <div>{listStr}</div>
                            <div>{watch('list').length} {watch('list').length > 1 ? 'currencies' : 'currency'}</div>
                        </>
                    )}
                </div>
            </div>
            {showFields && createPortal(
                <div ref={divInputListRef} style={{position:'absolute',width:rect?.width,top:rect?.top,left:rect?.left}}>
                    <div className={styles.wrapper}>
                        <div className={styles.container}>
                            <div className={styles.name}>{field.name}</div>
                            {error && <div className={styles.error}>{error?.message}</div>}
                            <form>
                                <ul>{fieldsJSX}</ul>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}