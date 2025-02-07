
import { SubmitHandler, UseControllerProps, useController, useForm } from "react-hook-form";
import styles from '@/styles/preview-edit-file.module.css'
import { Button } from "@/ui/button";
import { TextField } from "@/ui/text-field";
import { Select } from "@/ui/select";
import { Checkbox } from "@/ui/checkbox";

type TForm = {
    href: string;
    target: string;
    title: string;
    rel: {[key: string]: boolean};
}
type TProp = {
    handleLink: (link: TForm) => void,
    handleRemoveLink: () => void,
    onClose: any;
    data: TForm;
}
type TControllerProps = UseControllerProps<any> & {
    error?: string;
    label?: string;
    helpText?: string;
    type?: string;
    disabled?: boolean;
}
type TInputField = TControllerProps & {
    multiline?: boolean;
}
type TSelectField = TControllerProps & {
    options?: any;
}

function Input({name, control, rules={},  ...props}: TInputField) {
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
function SelectField({name, control, rules={},  ...props}: TSelectField) {
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

export function LinkRichText({onClose, handleLink, handleRemoveLink, data}: TProp) {
    const { control, handleSubmit, formState, setError } = useForm<TForm>({
        defaultValues: {
            href: data.href,
            target: data.target,
            title: data.title,
            rel: data.rel
        }
    });

    const onSubmit: SubmitHandler<TForm> = async (data) => {
        try {
            handleLink(data);
            onClose();
            return;
        } catch (e) {
            console.log(e);
        }
    }

    const options = [{value: '_self', label: 'the same window'}, {value: '_blank', label: 'a new window'}];

    return (
        <div className={styles.wrapper}>
            <form>
                <div className={styles.container}>
                    <div>
                        <Input control={control} name='href' label='Link to' helpText="http:// is required for external links" />
                        <SelectField control={control} name='target' label='Open this link in' options={options} />
                        <Input control={control} name='title' label='Link title' helpText="Used for accessibility and SEO" />
                        <div>
                            <div><span>Rel</span></div>
                            <div>
                            <Input control={control} name='rel.nofollow' label='Nofollow' type='checkbox' />
                            <Input control={control} name='rel.noreferrer' label='Noreferrer' type='checkbox' />
                            <Input control={control} name='rel.noopener' label='Noopener' type='checkbox' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    {data.href && <Button onClick={handleRemoveLink}>Remove link</Button>}
                    <Button onClick={onClose}>Cancel</Button>
                    <Button disabled={!formState.isDirty} primary onClick={handleSubmit(onSubmit)}>
                        {!data.href ? 'Insert link' : 'Edit link'}
                    </Button>
                </div>
            </form>
        </div>
    )
}