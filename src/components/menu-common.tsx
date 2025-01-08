import { useController, useForm, SubmitHandler, UseControllerProps} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TMenu, TContent } from '@/types'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field'
import { Card } from '@/ui/card'
import { Box } from '@/ui/box'
import { Checkbox } from '@/ui/checkbox'

type TControllerProps = UseControllerProps<any> & {
    error?: string;
    label?: string;
    helpText?: string;
    multiline?: boolean;
    type?: string;
}

type TForm = {
    id: string;
    name: string;
    code: string;
}

function isError(data: TErrorResponse|({userErrors: TUserErrorResponse[]} | {menu: TMenu})): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

function isUserError(data: {userErrors: TUserErrorResponse[]}|{menu: TMenu}): data is {userErrors: TUserErrorResponse[]} {
    return !!(data as {userErrors: TUserErrorResponse[]}).userErrors.length;
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

export function MenuCommon({defaultValues}: {defaultValues: TForm}) {
    const { control, handleSubmit, formState, reset, setError } = useForm<TForm>({defaultValues});

    const router = useRouter();

    const onSubmit: SubmitHandler<TForm> = async (data) => {
        try {
            const res = await fetch('/admin/internal/api/menus', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson:{userErrors: TUserErrorResponse[]}|{menu: TMenu} = await res.json();
            if (isError(dataJson)) {
                setError('root', {type: 'manual', message: dataJson.description ?? ''});
                return;
            }
            if (isUserError(dataJson)) {
                dataJson.userErrors.forEach(d => {
                    const field = d.field.join('.') as any;
                    setError(field, {
                        message: d.message
                    });
                });
                return;
            }

            reset(dataJson.menu);
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card title='General'>
                <Box padding={16}>
                    <Input control={control} name='name' label='Name' />
                    <Input control={control} name='code' label='Code' helpText={`Code will be used in Project API`} />
                </Box>
            </Card>

            <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
        </form>
    )
}