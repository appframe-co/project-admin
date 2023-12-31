import styles from '@/styles/form-translations.module.css'
import { TEntry, TTranslation } from '@/types';
import { Button } from '@/ui/button';
import { TextField } from '@/ui/text-field';
import { useEffect } from 'react';
import { SubmitHandler, UseControllerProps, useController, useForm } from 'react-hook-form';

type TProps = {
    lang: string;
    structureId: string;
    entry: TEntry;
    fields: {key: string, name: string, type: string}[];
}

function Input(props: UseControllerProps & {type?: string, label?: string, helpText?: string, multiline?: boolean}) {
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
            style={'td'}
        />
    )
}

function isErrorTranslation(data: {userErrors: TUserErrorResponse[]} | {translation: TTranslation}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

function isError(data: TErrorResponse|{translations: TTranslation[]}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export function TranslationEntry({lang, entry, structureId, fields}: TProps) {
    const defaultValue = fields.reduce((acc:any, f) => {
        acc[f.key] = f.type.startsWith('list.') ? Array(entry.doc[f.key].length).fill('') : '';
        return acc;
    }, {});

    const { control, handleSubmit, formState, getValues, reset, setError, setValue } = useForm<any>({
        defaultValues: {
            lang: null, 
            value: defaultValue
        }
    });

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
          reset(getValues());
        }
    }, [formState, reset]);

    useEffect(() => {
        const fetchTranslationByLang = async () => {
            try {
                const res = await fetch(`/internal/api/translations?structureId=${structureId}&subjectId=${entry.id}&subject=entry&lang=${lang}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) {
                    throw new Error('Fetch error');
                }
                const dataJson:{error: TErrorResponse, translations: TTranslation[]} = await res.json();            
                if (isError(dataJson)) {
                    throw new Error('Fetch error');
                }

                if (!dataJson.translations.length) {
                    reset({lang, value: defaultValue});
                } else {
                    reset({id: dataJson.translations[0].id, lang, value: dataJson.translations[0].value});
                }
            } catch (e) {
                console.log(e);
            }
        }

        fetchTranslationByLang();
    }, [lang]);

    const onSubmit: SubmitHandler<any> = async (data) => {
        const translationId = getValues('id');

        if (translationId) {
            try {
                const res = await fetch('/internal/api/translations/', {
                    method: 'PUT',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({structureId, subjectId: entry.id, ...data})
                });
                if (!res.ok) {
                    throw new Error('Fetch error');
                }
                const dataJson: {userErrors: TUserErrorResponse[]}|{translation: TTranslation} = await res.json();
    
                if (isErrorTranslation(dataJson)) {
                    dataJson.userErrors.forEach(d => {
                        setError(d.field.join('.'), {
                            message: d.message
                        });
                    });
                    return;
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const res = await fetch('/internal/api/translations', {
                    method: 'POST',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({structureId, subjectId: entry.id, subject: 'entry', key: 'doc', ...data})
                });
                if (!res.ok) {
                    throw new Error('Fetch error');
                }
                const dataJson: {userErrors: TUserErrorResponse[]}|{translation: TTranslation} = await res.json();
    
                if (isErrorTranslation(dataJson)) {
                    dataJson.userErrors.forEach(d => {
                        setError(d.field.join('.'), {
                            message: d.message
                        });
                    });
                    return;
                }
    
                setValue('id', dataJson.translation.id);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.table}>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Global</th>
                            <th>Local</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map(field => (
                            <tr key={field.key} className={styles.value}>
                                <td className={styles.td + ' ' + styles.tdTitle}>{field.name}</td>
                                <td className={styles.td + ' ' + styles.lineWrapper}>
                                    {!field.type.startsWith('list.') && <div className={styles.line}>{entry.doc[field.key]}</div>}
                                    {field.type.startsWith('list.') && entry.doc[field.key].map((v:any, i:number) => (
                                        <div className={styles.line} key={i}>{v}</div>
                                    ))}
                                </td>
                                <td>
                                    {!field.type.startsWith('list.') && 
                                        <Input control={control} name={'value.'+field.key} multiline={field.type === 'multi_line_text'} />}
                                    {field.type.startsWith('list.') && entry.doc[field.key].map((v:any, i: number) => (
                                        <Input key={i} control={control} name={'value.'+field.key+'.'+i} />
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
        </form>
    )
}