import { TextField } from '@/ui/text-field';
import { Checkbox } from '@/ui/checkbox';
import { TBrick, TSchemaBrick } from '@/types';
import { RegisterOptions, SubmitHandler, UseControllerProps, useController, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/ui/button';
import styles from '@/styles/form-structure.module.css';
import { useState } from 'react';

function Input(props: UseControllerProps<any> & {error?: string, label?: string, helpText?: string, multiline?: boolean}) {
    const { field, fieldState } = useController(props);

    return (
        <TextField 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            error={fieldState.error || props.error}
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
        type
    }

    if (type === 'checkbox') {
        return <Checkbox {...fields} />
    }

    return <TextField {...fields} />
}

type TProps = {
    errors: any;
    brick: TBrick;
    handleSubmitBrick: any;
    handleDeleteBrick: any;
    handleClose: any;
    schemaBrick: TSchemaBrick
}

export function FormBrick({errors, brick, schemaBrick, handleSubmitBrick, handleClose, handleDeleteBrick}: TProps) {
    const [isLimited, setLimited] = useState<boolean>(!!brick.validations.find(v => v.code === 'choices')?.value.length ?? false);

    const { register, control, handleSubmit, formState, setValue, getValues, watch } = useForm<TBrick>({
        defaultValues: brick
    });

    const { fields } = useFieldArray({
        name: 'validations',
        control
    });

    const choicesIndex = brick.validations.findIndex(v => v.code === 'choices') ?? fields.length;
    const choicesFieldArray = useFieldArray({
        name: `validations.${choicesIndex}.value`,
        control
    });

    const onSubmit: SubmitHandler<TBrick> = async (data) => {
        try {
            handleSubmitBrick(data);
        } catch (e) {
            console.log(e)
        }
    };

    const toggleSwitchType = (isPrefix=false):void => {
        let type = getValues('type');

        if (isPrefix && !type.startsWith('list.')) {
            type = 'list.' + type;
        }
        if (!isPrefix && type.startsWith('list.')) {
            type = type.substring(5);
        }

        setValue('type', type, {shouldDirty: true});
    };

    const handleLimited = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setLimited(target.checked);

        if (target.checked && choicesFieldArray.fields.length === 0) {
            choicesFieldArray.append('');
            return;
        }

        if (!target.checked && !brick.key) {
            setValue(`validations.${choicesIndex}.value`, []);
        }
    };

    const validationFields = fields.map((item, index: number) => {
        const registerOptions: RegisterOptions = {};

        const schemaValidation = schemaBrick.validations.find(v => v.code === item.code);
        if (!schemaValidation) {
            return <div key={item.id}></div>;
        }

        if (schemaValidation.code === 'required') {
            return (
                <div key={item.id}>
                    <InputRegister register={register(`validations.${index}.value`, registerOptions)} 
                        label={schemaValidation.name} helpText={schemaValidation.desc} 
                        type={schemaValidation.type} />
                </div>
            );
        }
        if (schemaValidation.code === 'choices') {
            return (
                <div key={item.id}>
                    <Checkbox onChange={(e: Event) => handleLimited(e)} label={schemaValidation.name} checked={isLimited} />
                    {isLimited && (
                        <>
                            <ul className={styles.choicesList}>
                                {choicesFieldArray.fields.map((itemChoice, indexChoice) => (
                                    <li key={itemChoice.id} className={styles.fieldList}>
                                        <div className={styles.infoField}>
                                            <Input control={control} name={`validations.${index}.value.${indexChoice}`} />
                                        </div>
                                        {choicesFieldArray.fields.length > 1 && 
                                            <div><Button onClick={() => choicesFieldArray.remove(indexChoice)}>Delete</Button></div>}
                                    </li>
                                ))}
                            </ul>
                            <Button onClick={() => choicesFieldArray.append('')}>Add item</Button>
                        </>
                    )}
                </div>
            );
        }
        if (isLimited) {
            return <div key={item.id}></div>;
        }

        if (schemaValidation.type === 'number') {
            registerOptions.valueAsNumber = true;
        }

        return (
            <div key={item.id}>
                <InputRegister register={register(`validations.${index}.value`, registerOptions)} 
                    label={schemaValidation.name} helpText={schemaValidation.desc} 
                    type={schemaValidation.type} />
            </div>
        );
    });

    return (
        <div>
            {errors && errors.validations && (
                <div className={styles.validationsErrors}>
                    <p className={styles.validationsErrorsHeading}>To save this brick, {errors.validations.filter((v:any) => v).length} changes need to be made:</p>
                    <ul className={styles.validationsErrorsList}>
                        {errors.validations.map((v:any, i:number) => (
                            <li key={i}>{v.code} {v.value.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.infoBrick}>
                    <Input error={errors?.name} control={control} name='name' label='Name' rules={{required: {message: "Value can't be blank", value: true}}} />
                    <Input error={errors?.key} control={control} name='key' label='Key' rules={{ required: {message: "Value can't be blank", value: true}}} />
                    <Input error={errors?.description} control={control} name='description' label='Description' />

                    {schemaBrick.list && (
                        <div className={styles.switchValues + (brick.id ? ' ' + styles.disabledValues : '') }>
                            <div className={styles.btnValue + (!watch('type').startsWith('list.') ? ' ' + styles.activeValue : '')} 
                            onClick={() => !brick.id && toggleSwitchType()}>One value</div>
                            <div className={styles.btnValue + (watch('type').startsWith('list.') ? ' ' + styles.activeValue : '')} 
                            onClick={() => !brick.id && toggleSwitchType(true)}>List of values</div>
                        </div>
                    )}
                </div>

                <div className={styles.validations}>
                    <p>Validations</p>
                    <p className={styles.validationText}>{schemaBrick.validationDescHtml}</p>
                    <div>{validationFields}</div>
                </div>

                <div className={styles.actions}>
                    <div>
                        {brick.key && <Button onClick={handleDeleteBrick}>Delete</Button>}
                    </div>
                    <div className={styles.actionsRight}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button disabled={!formState.isDirty} submit={true} primary>{brick.key ? 'Done' : 'Add'}</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}