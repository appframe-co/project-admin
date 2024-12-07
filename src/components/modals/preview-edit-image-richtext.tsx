import { Button } from "@/ui/button";
import styles from '@/styles/preview-edit-file.module.css'
import { TFile } from "@/types";
import { TextField } from "@/ui/text-field";
import { SubmitHandler, UseControllerProps, useController, useForm } from "react-hook-form";
import { RadioButton } from "@/ui/radio-button";

type TForm = {
    id: string;
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
    styles: {
        float: string;
    }
}

type TProp = {
    onClose: any;
    handleApplyEditImage: (image: TForm) => void,
    image: {
        id: string;
        src: string;
        alt: string;
        caption: string;
        width: number;
        height: number;
        styles: {
            float: string;
        }
    } | undefined
}

function Input(props: UseControllerProps<any> & {label?: string, type?: string, helpText?: string, multiline?: boolean}) {
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

export function PreviewAndEditImageRichText({onClose, image, handleApplyEditImage}: TProp) {
    const { control, handleSubmit, formState, setError } = useForm<TForm>({
        defaultValues: {
            alt: image ? image.alt : '',
            caption: image ? image.caption : '',
            width: image ? image.width : 0,
            height: image ? image.height : 0,
            styles: {
                float: image?.styles ? image.styles.float : '',
            }
        }
    });

    const onSubmit: SubmitHandler<TForm> = async (data) => {
        try {
            if (!image) {
                return;
            }
    
            handleApplyEditImage({...data, id: image.id});
            onClose();
            return;
        } catch (e) {
            console.log(e);
        }
    }

    if(!image) {
        return <></>;
    }

    const floatOptions = [{label: 'None', value: ''}, {label: 'Left', value: 'left'},{label: 'Right', value: 'right'}];
    const { field, fieldState } = useController({name: 'styles.float', control});

    return (
        <div className={styles.wrapper}>
            <form>
                <div className={styles.container}>
                    <div className={styles.previewFile}><img src={image.src} /></div>
                    <div>
                        <Input control={control} name='alt' label='Alt text' />
                        <Input control={control} name='caption' label='Caption text' />
                    </div>
                    <div>
                        <span>Size</span>
                        <Input control={control} name='width' type='number' label='Width' />
                        <Input control={control} name='height' type='number' label='Height' />
                    </div>
                    <div>
                        <span>Styles</span>
                        <div>
                            <div>
                                <label>Float</label>
                                {floatOptions.map((option) => (
                                    <RadioButton 
                                        key={option.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={'styles.float'}
                                        innerRef={control?.register('styles.float').ref}
                                        value={option.value}
                                        label={option.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button disabled={!formState.isDirty} primary onClick={handleSubmit(onSubmit)}>Save</Button>
                </div>
            </form>
        </div>
    )
}