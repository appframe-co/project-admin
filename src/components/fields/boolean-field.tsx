import { TField } from "@/types";
import { RadioButton } from "@/ui/radio-button";
import { Control, UseControllerProps, useController } from "react-hook-form";
import styles from '@/styles/fields/boolean.module.css'

type TProps = UseControllerProps & {
    label: string;
    helpText: string;
    options: {label: string, value: string}[]
}

function RadioGroup({name, control, ...props}: TProps) {
    const { field, fieldState } = useController({name, control});
    
    return (
        <div className={styles.container}>
            <p className={styles.name}>{props.label}</p>
            {props.options.map((option) => (
                <RadioButton 
                    key={option.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    innerRef={control?.register(name).ref}
                    value={option.value}
                    label={option.label}
                />
            ))}
            <p className={styles.error}>{fieldState.error?.message}</p>
            <p className={styles.info}>{props.helpText}</p>
        </div>
    )
}

type TProp = {
    field: TField;
    control: Control;
    prefixName?: string
}

export function BooleanField({field, control, prefixName=''}: TProp) {
    return (
        <RadioGroup control={control} name={prefixName+field.key} label={field.name} helpText={field.description} 
        options={ [{label: 'True', value: 'true'}, {label: 'False', value: 'false'}] } />
    )
}