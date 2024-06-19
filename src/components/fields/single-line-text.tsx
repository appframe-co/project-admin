import { TField } from "@/types";
import { Select } from "@/ui/select";
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
function Choices(props: UseControllerProps<any> & {label?: string, helpText?: string, multiline?: boolean, type?: string, choices: string[]}) {
    const { field, fieldState } = useController(props);

    const options = props.choices.map(c => ({value: c, label: c}));

    return (
        <Select 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value ?? ''}
            name={field.name}
            error={fieldState.error}
            label={props.label}
            helpText={props.helpText}
            options={[{value: '', label: 'Select an option'}, ...options]}
        />
    )
}

type TProp = {
    field: TField;
    control: Control;
    name?: string;
    prefixName?: string
}

export function SingleLineText({field, control, name, prefixName=''}: TProp) {
    const validationChoices = field.validations.find((v:any) => v.code === 'choices');

    if (name && name.startsWith('list.')) {
        return (
            <>
                {validationChoices?.value.length ? (
                    <Choices control={control} name={prefixName+name} choices={field.validations.find((v:any) => v.code==='choices')?.value} />
                ) : <Input control={control} name={prefixName+name} />
                }
            </>
        );
    }

    return (
        <>
            {validationChoices?.value.length ? (
                <Choices control={control} name={prefixName+field.key} label={field.name} helpText={field.description}
                choices={field.validations.find((v:any) => v.code==='choices')?.value} />
            ) : <Input control={control} name={prefixName+field.key} label={field.name} helpText={field.description} />
            }
        </>
    )
}