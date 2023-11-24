import { FormValuesEditStructure } from "@/types";
import { Box } from "@/ui/box";
import { Card } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { TextField } from "@/ui/text-field";
import { Control, UseControllerProps, useController } from "react-hook-form";
import styles from '@/styles/form-structure.module.css'

type TControllerProps = UseControllerProps<any> & {
    error?: string;
    label?: string;
    helpText?: string;
    multiline?: boolean;
    type?: string;
}

function Input({name, control, rules={},  ...props}: TControllerProps) {
    const { field, fieldState } = useController({name, control, rules});

    if (props.type === 'checkbox') {
        return <Checkbox 
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    error={fieldState.error || props.error}
                    label={props.label}
                    helpText={props.helpText}
                    innerRef={control?.register(name).ref}
                />
    }

    return <TextField 
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value ?? ''}
                name={field.name}
                error={fieldState.error || props.error}
                label={props.label}
                helpText={props.helpText}
                multiline={props.multiline}
                type={props.type}
            />
}

export function StructureTranslations({control}:{control: Control<FormValuesEditStructure>}) {
    return (
        <Card title='Translations'>
            <Box padding={16}>
                <Input control={control} name='translations.enabled' label='Enable' type='checkbox' />
            </Box>
        </Card>
    )
}