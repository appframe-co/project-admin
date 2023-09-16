import styles from '@/styles/bricks.module.css'
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

export function ListSingleLineText({register, error, setValue, label, value=[]}: {register: any, error: any, setValue: any, label: string, value?: any}) {
    const { control, watch } = useForm<any>({
        defaultValues: {
            list: Array.isArray(value) ? value : JSON.parse(value)
        }
    });
    const { fields, append, remove } = useFieldArray({
        name: 'list',
        control
    });

    const btnRef = useRef<null|HTMLDivElement>(null);
    const divInputRef = useRef<null|HTMLDivElement>(null);
    const [showFields, setShowFields] = useState<boolean>(false);

    useEffect(() => {
        const closeDropDown = (event: Event) => {
            if (!event.composedPath().includes(btnRef.current as HTMLDivElement)) {
                setValue(JSON.stringify(watch('list')));
                setShowFields(false);
            }
        };

        document.body.addEventListener('click', closeDropDown);

        return () => document.body.removeEventListener('click', closeDropDown);
    }, []);

    const rect = divInputRef.current?.getBoundingClientRect();

    return (
        <>
            <div ref={divInputRef} onClick={() => setShowFields((prevState: any) => !prevState)}>
                <div>{label}</div>
                <input style={{display: 'none'}} {...register}/>
                <div className={styles.input}>
                    <div>{watch('list').join(' • ')}</div>
                    <div>{watch('list').length} {watch('list').length > 1 ? 'items' : 'item'}</div>
                </div>
            </div>
            {showFields && createPortal(
                <div ref={btnRef} style={{position:'absolute',width: rect?.width,top:rect?.top,left:rect?.left}}>
                    <div className={styles.wrapper}>
                        <div className={styles.container}>
                            <div>{label}</div>
                            {error && !fields.length && <div className={styles.msg}>{error?.message}</div>}
                            <form>
                                <ul>
                                    {fields.map((item, index) => (
                                        <li key={item.id}>
                                            <Input control={control} name={`list.${index}`} />
                                            {error && Array.isArray(error) && <div className={styles.msg}>{error[index]?.message}</div>}
                                            <button type="button" onClick={() => remove(index)}>Delete</button>
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