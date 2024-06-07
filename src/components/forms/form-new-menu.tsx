'use client'

import { useController, useForm, SubmitHandler, UseControllerProps, useFieldArray} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { FormValuesNewMenu, TMenu } from '@/types'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field';
import { Card } from '@/ui/card'
import { Box } from '@/ui/box'


function isUserError(data: {userErrors: TUserErrorResponse[]}|{menu: TMenu}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
}

function Input(props: UseControllerProps<FormValuesNewMenu> & {type?: string, label?: string, helpText?: string, multiline?: boolean}) {
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
            type={props.type}
        />
    )
}

export function FormNewMenu() {
    const router = useRouter();

    const { control, handleSubmit, formState, watch, setError } = useForm<FormValuesNewMenu>({
        defaultValues: {
            title: '',
            handle: ''
        }
    });

    const onSubmit: SubmitHandler<FormValuesNewMenu> = async (data) => {
        try {
            const res = await fetch('/internal/api/menus', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson: {userErrors: TUserErrorResponse[]}|{menu: TMenu} = await res.json();

            if (isUserError(dataJson)) {
                dataJson.userErrors.forEach(d => {
                    const field = d.field.join('.') as any;
                    setError(field, {
                        message: d.message
                    });
                });
                return;
            }

            router.refresh();
            router.push(`/menus/${dataJson.menu.id}`);
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <>
            <div className='mb20'>
                {formState.errors.root && <p>{formState.errors.root.message}</p>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <Box padding={16}>
                        <Input control={control} name='title' label='Title' />
                        <Input control={control} name='handle' label='Handle' helpText={`Handle will be used in Project API`} />
                    </Box>
                </Card>
                <Card title='Menu items'>
                    <Box padding={16}>
                       <p></p>
                    </Box>
                </Card>

                <Button disabled={!formState.isDirty} submit={true} primary>Add</Button>
            </form>
        </>
    )
}