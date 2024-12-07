import { TField, TFile } from "@/types";
import { RichTextEditor } from "@/ui/rich-text-editor";
import { Control, UseControllerProps, useController } from "react-hook-form";

function Input(props: UseControllerProps<any> & {label?: string, helpText?: string, multiline?: boolean, setValue: any}) {
    const { field, fieldState } = useController(props);

    return (
        <RichTextEditor 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value ?? ''}
            name={field.name}
            error={fieldState.error}
            label={props.label}
            helpText={props.helpText}
            setValue={props.setValue}
        />
    )
}

type TProp = {
    field: TField;
    control: Control;
    prefixName?: string;
    setValue: any;
}

export function RichText({field, control, prefixName='', setValue}: TProp) {
    return <Input control={control} name={prefixName+field.key} label={field.name} helpText={field.description} 
        setValue={setValue} />
}