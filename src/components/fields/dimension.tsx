import { TField, TSchemaField } from "@/types";
import { TextField } from "@/ui/text-field";
import { Control, UseControllerProps, useController } from "react-hook-form";

function Input(props: UseControllerProps<any> & {label?: string, helpText?: string, multiline?: boolean, type: string, suffix?: string}) {
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
            suffix={props.suffix}
        />
    )
}

type TProp = {
    field: TField;
    schemaField: TSchemaField|undefined;
    control: Control;
    name?: string;
    prefixName?: string;
}

export function Dimension({field, schemaField, control,  name,  prefixName=''}: TProp) {
    if (!schemaField) {
        return <></>;
    }

    const unit = schemaField.units.find(u => u.code === field.unit);

    if (name && name.startsWith('list.')) {
        return <Input control={control} name={prefixName+name} type='number' suffix={unit?.name} />;
    }

    return <Input control={control} name={prefixName+field.key} label={field.name} helpText={field.description} type='number' suffix={unit?.name} />;
}