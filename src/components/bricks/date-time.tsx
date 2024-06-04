import { TBrick } from "@/types";
import { TextField } from "@/ui/text-field";
import { Control, UseControllerProps, useController } from "react-hook-form";
import styles from '@/styles/bricks/date-time.module.css'

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
    brick: TBrick;
    control: Control;
    prefixName?: string
}

export function DateTime({brick, control, prefixName=''}: TProp) {
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.date}>
                    <Input control={control} name={prefixName+brick.key} label={brick.name} helpText={brick.description} type='datetime-local' />
                </div>
            </div>
        </div>
    )
}