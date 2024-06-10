import { Button } from "@/ui/button";
import styles from '@/styles/preview-edit-file.module.css'
import { TextField } from "@/ui/text-field";
import { SubmitHandler, UseControllerProps, useController, useForm } from "react-hook-form";
import { TItemForm } from "@/types";
import { Select } from "@/ui/select";

type TProp = {
    index: number;
    item: TItemForm;
    handleClose: any;
    options: {value: string, label: string}[];
    handleItem: (data:TItemForm, index: number) => void
}

type TControllerProps = UseControllerProps<any> & {
    error?: string;
    label?: string;
    helpText?: string;
    multiline?: boolean;
    type?: string;
    disabled?: boolean;
    options?: any;
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

export function FormItem({index, item, handleItem, options, handleClose}: TProp) {
    const { control, handleSubmit, formState, setError, getValues, setValue, watch } = useForm<TItemForm>({
        defaultValues: item
    });

    const onSubmit: SubmitHandler<TItemForm> = async (data) => {
        try {
            handleItem(data, index);
            handleClose();
            return;
        } catch (e) {
            console.log(e);
        }
    }

    const toggleSwitchType = (type: string): void => setValue('type', type, {shouldDirty: true});

    return (
        <div className={styles.wrapper}>
            <form>
                <div className={styles.container}>
                    <div className={styles.switchValues}>
                        <div className={styles.btnValue + (watch('type') === 'http' ? ' ' + styles.activeValue : '')} 
                            onClick={() => toggleSwitchType('http')}>HTTP</div>
                        <div className={styles.btnValue + (watch('type') === 'ref' ? ' ' + styles.activeValue : '')} 
                            onClick={() => toggleSwitchType('ref')}>Ref</div>
                    </div>

                    <div>
                        <Input control={control} name='title' label='Title' />
                        <Input control={control} name='url' label='URL' />
                    </div>

                    {watch('type') === 'ref' && (
                        <div>
                            <SelectField control={control} name='subject' options={[{value: '', label: 'Select a subject'}, {value: 'structure', label: 'Structure'}]} />

                            {watch('subject') === 'structure' && (
                                <SelectField control={control} name='subjectId' options={[{value: '', label: 'Select a structure'}, ...options]} />
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={!formState.isDirty} primary onClick={handleSubmit(onSubmit)}>
                        {index === -1 ? 'Add' : 'Apply changes'}
                    </Button>
                </div>
            </form>
        </div>
    )
}