import { TextField } from '@/ui/text-field';
import { Checkbox } from '@/ui/checkbox';
import { TBrick, TSchemaBrick } from '@/types';
import { SubmitHandler, UseControllerProps, useController, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/ui/button';
import styles from '@/styles/form-structure.module.css';
import { useState } from 'react';

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
function InputRegister({register, label, helpText, type}: {register: any, label: string, helpText?: string, type?: string}) {
    const fields = {
        onChange: register.onChange,
        onBlur: register.onBlur,
        name: register.name,
        innerRef: register.ref,
        label: label,
        helpText,
        type: type,
    }

    if (type === 'checkbox') {
        return <Checkbox {...fields} />
    }

    return <TextField {...fields} />
}

type TSchemaValidation = {
    [key: string]: {name: string, desc: string}
}

type TProps = {
    brick: TBrick;
    schemaValidation: TSchemaValidation;
    handleSubmitBrick: any;
    handleDeleteBrick: any;
    handleClose: any;
    indexBrick: number|null;
    schemaBrick: TSchemaBrick
}

export function FormBrick({brick, schemaBrick, schemaValidation, handleSubmitBrick, handleClose, handleDeleteBrick, indexBrick}: TProps) {
    const isListBrick = brick.type.split('.')[0] === 'list';

    const [isListValues, setIsListValues] = useState<boolean>(isListBrick);

    const { register, control, handleSubmit, formState } = useForm<TBrick>({
        defaultValues: brick
    });
    const { fields } = useFieldArray({
        name: 'validations',
        control
    });

    const onSubmit: SubmitHandler<TBrick> = async (data) => {
        try {
            if (isListValues && !isListBrick) {
                data.type = 'list.' + data.type;
            }

            handleSubmitBrick(data);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.infoBrick}>
                    <Input control={control} name='name' label='Name' />
                    <Input control={control} name='key' label='Key' />
                    <Input control={control} name='description' label='Description' />

                    {schemaBrick.list && (
                        <div className={styles.switchValues + (indexBrick !== null ? ' ' + styles.disabledValues : '') }>
                            <div className={styles.btnValue + (isListValues === false ? ' ' + styles.activeValue : '')} 
                            onClick={() => indexBrick === null && setIsListValues(false)}>One value</div>
                            <div className={styles.btnValue + (isListValues === true ? ' ' + styles.activeValue : '')} 
                            onClick={() => indexBrick === null && setIsListValues(true)}>List of values</div>
                        </div>
                    )}
                </div>

                <div className={styles.validations}>
                    <p>Validations</p>
                    <p className={styles.validationText}>{schemaBrick.validationDescHtml}</p>
                    <div>
                        {fields.map((item, index: number) => {
                            return (
                                <div key={item.id}>
                                    {item.code === 'required' && (
                                        <InputRegister register={register(`validations.${index}.value`, {})} 
                                        label={schemaValidation[item.code].name} helpText={schemaValidation[item.code].desc} type='checkbox' />
                                    )}
                                    {item.code === 'max' && (
                                        <InputRegister register={register(`validations.${index}.value`, {valueAsNumber: true})} 
                                        label={schemaValidation[item.code].name} helpText={schemaValidation[item.code].desc} type='number' />
                                    )}
                                    {item.code === 'min' && (
                                        <InputRegister register={register(`validations.${index}.value`, {valueAsNumber: true})} 
                                        label={schemaValidation[item.code].name} helpText={schemaValidation[item.code].desc} type='number' />
                                    )}
                                    {item.code === 'regex' && (
                                        <InputRegister register={register(`validations.${index}.value`)} 
                                        label={schemaValidation[item.code].name} helpText={schemaValidation[item.code].desc} />
                                    )}
                                    {item.code === 'max_precision' && (
                                        <InputRegister register={register(`validations.${index}.value`, {valueAsNumber: true})} 
                                        label={schemaValidation[item.code].name} helpText={schemaValidation[item.code].desc} type='number' />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className={styles.actions}>
                    <div>
                        {indexBrick !== null && <Button onClick={handleDeleteBrick}>Delete</Button>}
                    </div>
                    <div className={styles.actionsRight}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button disabled={!formState.isDirty} submit={true} primary>{indexBrick !== null ? 'Done' : 'Add'}</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}