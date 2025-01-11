import { TField, TSchemaField, TSections, TContent } from "@/types";
import { Box } from "@/ui/box";
import { Card } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { TextField } from "@/ui/text-field";
import { SubmitHandler, UseControllerProps, useController, useFieldArray, useForm } from "react-hook-form";
import styles from '@/styles/form-content.module.css'
import { useCallback, useState } from "react";
import { useRouter } from 'next/navigation'
import { createPortal } from "react-dom";
import { Modal } from "@/ui/modal";
import { FormField } from "@/components/modals/form-field";
import { GroupOfFields } from "@/components/group-of-fields";
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
    sections: TSections;
}

type TProps = {
    defaultValues: TForm;
    groupOfFields: {[key: string]: TSchemaField[]};
    names:{[key: string]: string};
}

function isError(data: TErrorResponse|({userErrors: TUserErrorResponse[]} | {content: TContent})): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

function isUserError(data: {userErrors: TUserErrorResponse[]}|{content: TContent}): data is {userErrors: TUserErrorResponse[]} {
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

export function ContentSections({defaultValues, groupOfFields, names}: TProps) {
    const [showGroupOfFields, setShowGroupOfFields] = useState<boolean>(false);
    const [activeModalField, setActiveModalField] = useState<boolean>(false);
    const [indexField, setIndexField] = useState<number|null>(null);
    const [field, setField] = useState<TField>();
    const [schemaField, setSchemaField] = useState<TSchemaField>();

    const router = useRouter();
    
    const { control, handleSubmit, formState, reset, setError, watch } = useForm<TForm>({defaultValues});
    const { fields, append, remove, update } = useFieldArray({
        name: 'sections.fields',
        control,
        keyName: 'uuid'
    });

    const handleChangeModalField = useCallback(() => setActiveModalField(!activeModalField), [activeModalField]);

    const onSubmit: SubmitHandler<TForm> = async (data) => {
        try {
            const res = await fetch('/admin/internal/api/contents', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson:{userErrors: TUserErrorResponse[]}|{content: TContent} = await res.json();
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

            reset(dataJson.content);
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    };

    const createField = (schemaField: TSchemaField): void => {
        const field: TField = {
            type: schemaField.type,
            name: '',
            key: '',
            description: '',
            validations: schemaField.validations.map(v => ({type: v.type, code: v.code, value: v.value})),
            system: false,
        };
        if (schemaField.units && schemaField.units.length) {
            field.unit = schemaField.units[0].code;
        }

        setSchemaField(schemaField);
        setField(field);
        handleChangeModalField();
        setShowGroupOfFields(false);
    };
    const updateField = (field: TField, index: number) => {
        if (field.system) {
            return;
        }

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
    const handleDeleteField = (): void => {
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

    const errorsField: any = formState.errors.sections?.fields ?? [];

    return (
        <>
            {activeModalField && createPortal(
                <Modal
                    open={activeModalField}
                    onClose={handleClose}
                    title={field?.name || schemaField?.name || ''}
                >
                    {field && schemaField && <FormField 
                        errors={formState.errors.sections?.fields && indexField !== null ? formState.errors.sections?.fields[indexField]: []}  
                        field={field} schemaField={schemaField} fields={fields}
                        handleClose={handleClose}
                        handleDeleteField={handleDeleteField} handleSubmitField={indexField !== null ? handleEditField : handleAddField} />}
                </Modal>,
                document.body
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card title='General'>
                    <Box padding={16}>
                        <Input control={control} name='sections.enabled' label='Enable' type='checkbox' />
                    </Box>
                </Card>

                <Card title='Fields'>
                    <div className={styles.fields}>
                        <Input control={control} name='sections.fields' type='hidden' />

                        {fields.map((field, index: number) => (
                            <div key={field.key+index} className={!field.system ? styles.field : styles.fieldSystem} onClick={() => updateField(field, index)}>
                                <div className={styles.name}>{field.name} {field.system && '(system)'}</div>
                                <div className={styles.key}>{field.key}</div>
                                {errorsField[index]?.name && (
                                    <p className={styles.errorMsg}>{errorsField[index]?.name.message} (changes need to be made)</p>
                                )}
                                {errorsField[index]?.key && (
                                    <p className={styles.errorMsg}>{errorsField[index]?.key.message} (changes need to be made)</p>
                                )}
                                {errorsField[index]?.validations && (
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

                <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
            </form>
        </>
    )
}