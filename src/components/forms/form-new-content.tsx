'use client'

import { useController, useForm, SubmitHandler, UseControllerProps, useFieldArray} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TContent, FormValuesNewContent, TSchemaField, TField } from '@/types'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field';
import { Card } from '@/ui/card'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom';
import { GroupOfFields } from '../group-of-fields'
import { Modal } from '@/ui/modal'
import styles from '@/styles/form-content.module.css'
import { Box } from '@/ui/box'
import { FormField } from '@/components/modals/form-field'

function isError(data: TErrorResponse|({userErrors: TUserErrorResponse[]} | {content: TContent})): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

function isUserError(data: {userErrors: TUserErrorResponse[]}|{content: TContent}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

function Input(props: UseControllerProps<FormValuesNewContent> & {type?: string, label?: string, helpText?: string, multiline?: boolean}) {
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
    groupOfFields: {[key: string]: TSchemaField[]}, 
    names:{[key: string]: string}
}

export function FormNewContent({groupOfFields, names}: TProps) {
    const [showGroupOfFields, setShowGroupOfFields] = useState<boolean>(false);
    const [activeModalField, setActiveModalField] = useState<boolean>(false);
    const [indexField, setIndexField] = useState<number|null>(null);
    const [field, setField] = useState<TField>();
    const [schemaField, setSchemaField] = useState<TSchemaField>();

    const router = useRouter();

    const { control, handleSubmit, formState, watch, setError } = useForm<FormValuesNewContent>({
        defaultValues: {
            name: '',
            code: '',
            entries: {
                fields: []
            }
        }
    });
    const { fields, append, remove, update } = useFieldArray({
        name: 'entries.fields',
        control,
        keyName: 'uuid'
        
    });

    const handleChangeModalField = useCallback(() => setActiveModalField(!activeModalField), [activeModalField]);

    const onSubmit: SubmitHandler<FormValuesNewContent> = async (data) => {
        try {
            const res = await fetch('/admin/internal/api/contents', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: TErrorResponse|{userErrors: TUserErrorResponse[]}|{content: TContent} = await res.json();
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

            const { content } = dataJson;

            router.refresh();
            router.push(`/contents/${content.id}`);
        } catch (e) {
            console.log(e)
        }
    };

    const createField = (schemaField: TSchemaField): void => {
        setSchemaField(schemaField);
        setField({
            system: false,
            type: schemaField.type,
            name: '',
            key: '',
            description: '',
            validations: schemaField.validations.map(v => ({type: v.type, code: v.code, value: v.value}))
        });
        handleChangeModalField();
        setShowGroupOfFields(false);
    };
    const updateField = (field: TField, index: number) => {
        const type = field.type.startsWith('list.') ? field.type.slice(5) : field.type;

        const schemaFields: TSchemaField[] = [];
        Object.keys(groupOfFields).forEach(group => {
            schemaFields.push(...groupOfFields[group]);
        });
        const schemaField: TSchemaField|undefined = schemaFields.find(b => b.type === type);
        if (schemaField) {
            setSchemaField(schemaField);
            setField(field);
            setIndexField(index);
            handleChangeModalField();
        }
    };

    const handleAddField = (field: TField): void => {
        append(field);
        handleChangeModalField();
    };
    const handleEditField = (field: TField): void => {
        if (indexField !== null) {
            update(indexField, field);
            handleChangeModalField();
            setIndexField(null);
        }
    };
    const handleDeleteField = (field: TField): void => {
        if (indexField !== null) {
            remove(indexField);
            handleChangeModalField();
            setIndexField(null);
        }
    };
    const handleClose = () => {
        handleChangeModalField();
        setIndexField(null);
    };

    const errorsField: any = formState.errors.entries?.fields ?? [];

    return (
        <>
            {activeModalField && createPortal(
                <Modal
                    open={activeModalField}
                    onClose={handleClose}
                    title={field?.name || schemaField?.name || ''}
                >
                    {field && schemaField && <FormField 
                    errors={formState.errors.entries?.fields && indexField !== null ? formState.errors.entries.fields[indexField]: []} 
                        field={field} schemaField={schemaField} fields={fields}
                        handleClose={handleClose}
                        handleDeleteField={handleDeleteField} handleSubmitField={indexField !== null ? handleEditField : handleAddField} />}
                </Modal>,
                document.body
            )}

            <div className='mb20'>
                {formState.errors.root && <p>{formState.errors.root.message}</p>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <Box padding={16}>
                        <Input control={control} name='name' label='Name' />
                        <Input control={control} name='code' label='Code' helpText={`Code will be used in Project API`} />
                    </Box>
                </Card>

                <Card title='Fields'>
                    <div className={styles.fields}>
                        <Input control={control} name='entries.fields' type='hidden' />

                        {fields.map((field, index: number) => (
                            <div key={field.key} className={styles.field} onClick={() => updateField(field, index)}>
                                <div className={styles.name}>{field.name}</div>
                                <div className={styles.key}>{field.key}</div>
                                {errorsField[index] && (
                                    <p className={styles.errorMsg}>{errorsField[index]?.validations?.filter((v: any)=>v).length} changes need to be made</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <Box padding={16}>
                        <GroupOfFields groupOfFields={groupOfFields} names={names} createField={createField} 
                            showGroupOfFields={showGroupOfFields} setShowGroupOfFields={setShowGroupOfFields} />
                    </Box>
                </Card>

                <Button disabled={!formState.isDirty} submit={true} primary>Add</Button>
            </form>
        </>
    )
}