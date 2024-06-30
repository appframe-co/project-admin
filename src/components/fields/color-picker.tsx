import { TField } from "@/types";
import { TextField } from "@/ui/text-field";
import { Control, UseControllerProps, useController } from "react-hook-form";

function Input(props: UseControllerProps<any> & {label?: string, helpText?: string, multiline?: boolean}) {
    const { field, fieldState } = useController(props);

    return (
        <TextField 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value ?? ''}
            name={field.name}
            error={fieldState.error}
            label={props.label}
            helpText={props.helpText}
            type='color'
        />
    )
}

type TProp = {
    field: TField;
    control: Control;
    name?: string;
    prefixName?: string
}

export function ColorPicker({field, control, name, prefixName=''}: TProp) {
    if (name && name.startsWith('list.')) {
        return <Input control={control} name={prefixName+name} />;
    }

    return <Input control={control} name={prefixName+field.key} label={field.name} helpText={field.description} />;
}