import { TBrick } from "@/types";
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
    brick: TBrick;
    control: Control;
    prefixName?: string
}

export function NumberDecimal({brick, control, prefixName=''}: TProp) {
    return <Input control={control} name={prefixName+brick.key} label={brick.name} helpText={brick.description} type='number' />;
}