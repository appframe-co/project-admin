import { TField } from "@/types";
import { TextField } from "@/ui/text-field";
import { Control, UseControllerProps, useController } from "react-hook-form";

function Input(props: UseControllerProps<any> & {label?: string, helpText?: string, multiline?: boolean, type: string}) {
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
            multiline={props.multiline}
            type={props.type}
        />
    )
}

type TProp = {
    field: TField;
    control: Control;
    prefixName?: string
}

export function NumberInteger({field, control, prefixName=''}: TProp) {
    return <Input control={control} name={prefixName+field.key} label={field.name} helpText={field.description} type='number' />;
}