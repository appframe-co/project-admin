import { TBrick } from "@/types";
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

export function SingleLineText({brick, control, name}: {brick: TBrick, control: Control, name?: string}) {
    const validationChoices = brick.validations.find((v:any) => v.code === 'choices');

    if (name && name.startsWith('list.')) {
        return (
            <>
                {validationChoices?.value.length ? (
                    <Choices control={control} name={name} choices={brick.validations.find((v:any) => v.code==='choices')?.value} />
                ) : <Input control={control} name={name} />
                }
            </>
        );
    }

    return (
        <>
            {validationChoices?.value.length ? (
                <Choices control={control} name={brick.key} label={brick.name} helpText={brick.description}
                choices={brick.validations.find((v:any) => v.code==='choices')?.value} />
            ) : <Input control={control} name={brick.key} label={brick.name} helpText={brick.description} />
            }
        </>
    )
}