import { TBrick } from "@/types";
import { TextField } from "@/ui/text-field";
import { UseControllerProps, useController } from "react-hook-form";

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

export function MultiLineText({brick, control}: {brick: TBrick, control: any}) {
    return <Input control={control} name={brick.key} multiline={true} label={brick.name} helpText={brick.description} />
}