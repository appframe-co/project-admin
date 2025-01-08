import { Button } from "@/ui/button";
import styles from '@/styles/preview-edit-file.module.css'
import { TFile, TTranslation } from "@/types";
import { TextField } from "@/ui/text-field";
import { SubmitHandler, UseControllerProps, useController, useForm } from "react-hook-form";
import { useEffect } from "react";

function isError(data: TErrorResponse|{translations: TTranslation[]}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}
function isErrorTranslation(data: {userErrors: TUserErrorResponse[]} | {translation: TTranslation}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}


type TProp = {
    fileId: string|null;
    file: TFile|undefined;
    onClose: any;
    lang: string;
    menuId: string;
    fileKey: string|null;
}

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

type TForm = {
    id?: string;
    lang:string;
    value: {
        alt:string;
        caption:string;
    }
}

export function PreviewAndEditTranslationFileMenuItem({fileId, fileKey, file, onClose, lang, menuId}: TProp) {
    const defaultValue = {
        alt: '',
        caption: ''
    };

    const { control, handleSubmit, formState, setError, reset, getValues, setValue } = useForm<any>({
        defaultValues: {
            lang, 
            value: defaultValue
        }
    });

    useEffect(() => {
        const fetchTranslationByLang = async () => {
            try {
                const res = await fetch(`/internal/api/translations_menu_item?menuId=${menuId}&subjectId=${fileId}&subject=file&lang=${lang}`, {
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
    }, []);

    const onSubmit: SubmitHandler<any> = async (data) => {
        const translationId = getValues('id');

        if (translationId) {
            try {
                const res = await fetch('/admin/internal/api/translations_menu_item/', {
                    method: 'PUT',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({menuId, subjectId: fileId, ...data})
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
                } else {
                    onClose();
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const res = await fetch('/admin/internal/api/translations_menu_item', {
                    method: 'POST',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({menuId, subjectId: fileId, subject: 'file', key: fileKey, ...data})
                });
                if (!res.ok) {
                    throw new Error('Fetch error');
                }
                const dataJson: {userErrors: TUserErrorResponse[]}|{translation: TTranslation} = await res.json();
    
                if (isErrorTranslation(dataJson)) {
                    dataJson.userErrors.forEach(d => {
                        const field = d.field.join('.');

                        setError(field, {
                            message: d.message
                        });
                    });
                    return;
                } else {
                    onClose();
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    if (!fileId || !file) {
        return <></>;
    }

    return (
        <div className={styles.wrapper}>
            <form>
                <div className={styles.container}>
                    <div className={styles.previewFile}><img src={file.src} /></div>
                    <div>
                        <Input control={control} name='value.alt' label='Alt text' />
                        <Input control={control} name='value.caption' label='Caption text' />
                    </div>
                    <p className={styles.text}>Edits will apply to all places this file is used across AppFrame.</p>
                </div>
                <div className={styles.actions}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button disabled={!formState.isDirty} primary onClick={handleSubmit(onSubmit)}>Save</Button>
                </div>
            </form>
        </div>
    )
}