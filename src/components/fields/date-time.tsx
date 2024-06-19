import { TField } from "@/types";
import { TextField } from "@/ui/text-field";
import { Control, UseControllerProps, useController } from "react-hook-form";
import styles from '@/styles/fields/date-time.module.css'

type TControllerProps = UseControllerProps & {
    label?: string;
    helpText?: string;
    multiline?: boolean;
    type?: string;
}
function Input({name, control, ...props}: TControllerProps) {
    const { field, fieldState } = useController({name, control});

    return (
        <TextField 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value ?? ''}
            name={field.name}
            error={fieldState.error}
            label={props.label}
            helpText={props.helpText}
            type={props.type}
        />
    )
}

type TProp = {
    field: TField;
    control: Control;
    prefixName?: string
}

export function DateTime({field, control, prefixName=''}: TProp) {
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.date}>
                    <Input control={control} name={prefixName+field.key} label={field.name} helpText={field.description} type='datetime-local' />
                </div>
            </div>
        </div>
    )
}