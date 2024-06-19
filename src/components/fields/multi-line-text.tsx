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
            multiline={props.multiline}
        />
    )
}

type TProp = {
    field: TField;
    control: Control;
    prefixName?: string
}

export function MultiLineText({field, control, prefixName=''}: TProp) {
    return <Input control={control} name={prefixName+field.key} multiline={true} label={field.name} helpText={field.description} />
}