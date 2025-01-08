import { useController, useForm, SubmitHandler, UseControllerProps} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TContent, TTranslations } from '@/types'
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
    translations: TTranslations;
}

function isError(data: TErrorResponse|({userErrors: TUserErrorResponse[]} | {content: TContent})): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

function isUserError(data: {userErrors: TUserErrorResponse[]}|{content: TContent}): data is {userErrors: TUserErrorResponse[]} {
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

export function ContentTranslations({defaultValues}:{defaultValues: TForm}) {
    const { control, handleSubmit, formState, reset, setError } = useForm<TForm>({defaultValues});

    const router = useRouter();

    const onSubmit: SubmitHandler<TForm> = async (data) => {
        try {
            const res = await fetch('/admin/internal/api/contents', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson:{userErrors: TUserErrorResponse[]}|{content: TContent} = await res.json();
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

            reset(dataJson.content);
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card title='General'>
                <Box padding={16}>
                    <Input control={control} name='translations.enabled' label='Enable' type='checkbox' />
                </Box>
            </Card>

            <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
        </form>
    )
}