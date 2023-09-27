import { TBrick } from "@/types";
import { RadioButton } from "@/ui/radio-button";
import { useEffect } from "react";
import { UseControllerProps, useController } from "react-hook-form";

type TProps = UseControllerProps&{
    label: string;
    helpText: string;
    options: {label: string, value: string}[]
}

function RadioGroup({name, control, ...props}: TProps) {
    const { field, fieldState } = useController({name, control});
    
    return (
        <>
            <p>{props.label}</p>
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
            <p>{fieldState.error?.message}</p>
            <p>{props.helpText}</p>
        </>
    )
}

export function BooleanBrick({brick, control}: {brick: TBrick, control: any}) {
    return (
        <RadioGroup control={control} name={brick.key} label={brick.name} helpText={brick.description} 
        options={ [{label: 'True', value: 'true'}, {label: 'False', value: 'false'}] } />
    )
}