import { Button } from "@/ui/button";
import styles from '@/styles/preview-edit-file.module.css'
import { TFile } from "@/types";
import { TextField } from "@/ui/text-field";
import { SubmitHandler, UseControllerProps, useController, useForm } from "react-hook-form";

function isError(data: {userErrors: TUserErrorResponse[]} | {file: TFile}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

type TProp = {
    fileIndex: number;
    files: TFile[];
    setFiles: any;
    onClose: any;
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

export function PreviewAndEditFile({fileIndex, files, setFiles,  onClose}: TProp) {
    const { control, handleSubmit, formState, setError } = useForm<{id:string,alt:string}>({
        defaultValues: {
            id: files[fileIndex].id,
            alt: files[fileIndex].alt ?? ''
        }
    });

    const onSubmit: SubmitHandler<{id:string,alt:string}> = async (data) => {
        try {
            const res = await fetch('/internal/api/files', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: {userErrors: TUserErrorResponse[]}|{file: TFile} = await res.json();

            if (isError(dataJson)) {
                dataJson.userErrors.forEach(d => {
                    const field = d.field.join('.') as 'alt';
                    setError(field, {
                        message: d.message
                    });
                });
                return;
            }

            setFiles((prevState: TFile[]) => prevState.map((file, i) => {
                if (i === fileIndex) {
                    file.alt = dataJson.file.alt;
                }
                return file;
            }));

            onClose();
            return;
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={styles.wrapper}>
            <form>
                <div className={styles.container}>
                    <div className={styles.previewFile}><img src={files[fileIndex].src} /></div>
                    <div>
                        <Input control={control} name='alt' label='Alt text' />
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