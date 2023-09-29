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

export function DateBrick({brick, control}: {brick: TBrick, control: Control}) {
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.date}>
                    <Input control={control} name={brick.key} label={brick.name} helpText={brick.description} type='date' />
                </div>
            </div>
        </div>
    )
}