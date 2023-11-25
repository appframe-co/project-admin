import { TextField } from '@/ui/text-field';
import { Checkbox } from '@/ui/checkbox';
import { TBrick, TSchemaBrick } from '@/types';
import { RegisterOptions, SubmitHandler, UseControllerProps, useController, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/ui/button';
import styles from '@/styles/form-structure.module.css';
import { useState } from 'react';
import { Select } from '@/ui/select';

type TControllerProps = UseControllerProps<any> & {
    error?: string;
    label?: string;
    helpText?: string;
    multiline?: boolean;
    type?: string;
    disabled?: boolean;
    options?: any;
}

function SelectField({name, control, rules={},  ...props}: TControllerProps) {
    const { field, fieldState } = useController({name, control, rules});

    return <Select 
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value ?? ''}
        name={field.name}
        error={fieldState.error}
        label={props.label}
        helpText={props.helpText}
        options={props.options}
    />
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
                    disabled={props.disabled}
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
                disabled={props.disabled}
            />
}

type TProps = {
    bricks: TBrick[];
    errors: any;
    brick: TBrick;
    handleSubmitBrick: any;
    handleDeleteBrick: any;
    handleClose: any;
    schemaBrick: TSchemaBrick
}

type TOption = {
    value: string;
    label: string;
}

export function FormBrick({bricks, errors, brick, schemaBrick, handleSubmitBrick, handleClose, handleDeleteBrick}: TProps) {
    const [choicesEnabled, setChoicesEnabled] = useState<boolean>(!!brick.validations.find(v => v.code === 'choices')?.value.length ?? false);

    const { control, handleSubmit, formState, setValue, getValues, watch } = useForm<TBrick>({
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
        setChoicesEnabled(target.checked);

        if (target.checked && choicesFieldArray.fields.length === 0) {
            choicesFieldArray.append('');
            return;
        }

        if (!target.checked && !brick.key) {
            setValue(`validations.${choicesIndex}.value`, []);
        }
    };

    const validationFields = fields.map((item, index: number) => {
        const schemaValidation = schemaBrick.validations.find(v => v.code === item.code);
        if (!schemaValidation) {
            return <div key={item.id}></div>;
        }

        const registerOptions: RegisterOptions = {};
        let type = item.type;
        switch(item.type) {
            case 'number': {
                registerOptions.valueAsNumber = true;
                break;    
            }
            case 'date_time': {
                registerOptions.valueAsDate = true;
                type = 'datetime-local';
                break;    
            }
            case 'date': {
                registerOptions.valueAsDate = true;
                type = 'date';
                break;    
            }
        }

        if (item.code === 'required') {
            return (
                <div key={item.id}>
                    <Input control={control} name={`validations.${index}.value`} 
                    label={schemaValidation.name} helpText={schemaValidation.desc} type={schemaValidation.type} />
                </div>
            );
        }
        if (!choicesEnabled) {
            if (item.code === 'unique') {
                return (
                    <div key={item.id}>
                        <Input control={control} name={`validations.${index}.value`} 
                        label={schemaValidation.name} helpText={schemaValidation.desc} type={schemaValidation.type} />
                    </div>
                );
            }
        }

        if (item.code === 'choices') {
            return (
                <div key={item.id}>
                    <Checkbox onChange={(e: Event) => handleLimited(e)} label={schemaValidation.name} checked={choicesEnabled} />
                    {choicesEnabled && (
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

        if (!choicesEnabled) {
            if (item.code === 'min') {
                return (
                    <div key={item.id} className={styles.wrapperBrick}>
                        <Input control={control} name={`validations.${index}.value`} rules={registerOptions}
                        label={schemaValidation.name} helpText={schemaValidation.desc} type={type} />
                    </div>
                );
            }
            if (item.code === 'max') {
                return (
                    <div key={item.id} className={styles.wrapperBrick}>
                        <Input control={control} name={`validations.${index}.value`} rules={registerOptions}
                        label={schemaValidation.name} helpText={schemaValidation.desc} type={type} />
                    </div>
                );
            }
            if (item.code === 'regex') {
                return (
                    <div key={item.id} className={styles.wrapperBrick}>
                        <Input control={control} name={`validations.${index}.value`} rules={registerOptions}
                        label={schemaValidation.name} helpText={schemaValidation.desc} type={type} />
                        {schemaValidation.presetChoices.length > 0 && (
                            <div className={styles.presetChoices}>
                                <ul>
                                    {schemaValidation.presetChoices.map((presetChoice, i) => (
                                        <li key={i} onClick={() => setValue(`validations.${index}.value`, presetChoice.value, {shouldDirty: true})}>
                                            <div>{presetChoice.name}</div>
                                            <div className={styles.valuePresetChocie}>{presetChoice.value}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            }
            if (item.code === 'brick_reference') {
                const options = bricks.reduce((acc: TOption[], brick): TOption[] => {
                    if (brick.type === 'single_line_text') {
                        acc.push({value: brick.key, label: brick.name});
                    }
                    return acc;
                }, []);

                return (
                    <div key={item.id} className={styles.wrapperBrick}>
                        <SelectField 
                            control={control} name={`validations.${index}.value`}
                            label={schemaValidation.name} helpText={schemaValidation.desc}
                            options={[{value: '', label: 'Select a brick'}, ...options]}
                        />
                    </div>
                );
            }
            if (item.code === 'transliteration') {
                return (
                    <div key={item.id}>
                        <Input control={control} name={`validations.${index}.value`} disabled={true}
                        label={schemaValidation.name} helpText={schemaValidation.desc} type={schemaValidation.type} />
                    </div>
                );
            }
        }

        return <div key={item.id}></div>;
    });

    return (
        <div>
            {errors && errors.validations && (
                <div className={styles.validationsErrors}>
                    <p className={styles.validationsErrorsHeading}>To save this brick, {errors.validations.filter((v:any) => v).length} changes need to be made:</p>
                    <ul className={styles.validationsErrorsList}>
                        {errors.validations.map((v:any, i:number) => (
                            <li key={i}>{v.code} {v.value?.message}</li>
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