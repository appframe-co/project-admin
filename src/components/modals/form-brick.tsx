import { TextField } from '@/ui/text-field';
import { Checkbox } from '@/ui/checkbox';
import { TBrick, TSchemaBrick } from '@/types';
import { SubmitHandler, UseControllerProps, useController, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/ui/button';

function Input(props: UseControllerProps<any> & {label?: string, helpText?: string, multiline?: boolean}) {
    const { field, fieldState } = useController(props);

    return (
        <TextField 
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            error={fieldState.error}
            label={props.label}
            helpText={props.helpText}
            multiline={props.multiline}
        />
    )
}
function InputRegister({register, label, type}: {register: any, label: string, type?: string}) {
    const fields = {
        onChange: register.onChange,
        onBlur: register.onBlur,
        name: register.name,
        innerRef: register.ref,
        label: label,
        type: type,
    }

    if (type === 'checkbox') {
        return <Checkbox {...fields} />
    }

    return <TextField {...fields} />
}

type TProps = {
    brick: TBrick;
    namesValidation: {[key: string]: string};
    handleSubmitBrick: any;
    handleDeleteBrick: any;
    handleClose: any;
    indexBrick: number|null;
}

export function FormBrick({brick, namesValidation, handleSubmitBrick, handleClose, handleDeleteBrick, indexBrick}: TProps) {
    const { register, control, handleSubmit, formState: { errors, isDirty }, watch } = useForm<TBrick>({
        defaultValues: brick
    });
    const { fields } = useFieldArray({
        name: 'validation',
        control
    });

    const onSubmit: SubmitHandler<TBrick> = async (data) => {
        try {
            handleSubmitBrick(data);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input control={control} name='name' label='Name' />
                <Input control={control} name='key' label='Key' />
                <Input control={control} name='description' label='Description' />

                <div>
                    <p>Validation rules</p>
                    <div>
                        {fields.map((item, index: number) => {
                            return (
                                <div key={item.id}>
                                    {item.code === 'required' && (
                                        <InputRegister register={register(`validation.${index}.value`, {})} label={namesValidation[item.code]} type='checkbox' />
                                    )}
                                    {item.code === 'max' && (
                                        <InputRegister register={register(`validation.${index}.value`, {valueAsNumber: true})} label={namesValidation[item.code]} type='number' />
                                    )}
                                    {item.code === 'min' && (
                                        <InputRegister register={register(`validation.${index}.value`, {valueAsNumber: true})} label={namesValidation[item.code]} type='number' />
                                    )}
                                    {item.code === 'regex' && (
                                        <InputRegister register={register(`validation.${index}.value`)} label={namesValidation[item.code]} />
                                    )}
                                    {item.code === 'max_precision' && (
                                        <InputRegister register={register(`validation.${index}.value`, {valueAsNumber: true})} label={namesValidation[item.code]} type='number' />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div>
                    {indexBrick !== null && <Button onClick={handleDeleteBrick}>Delete</Button>}

                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={!isDirty} submit={true} primary>{indexBrick !== null ? 'Done' : 'Add'}</Button>
                </div>
            </form>
        </div>
    )
}