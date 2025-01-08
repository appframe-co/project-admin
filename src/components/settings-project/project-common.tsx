import { useController, useForm, SubmitHandler, UseControllerProps} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TProject } from '@/types'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field'
import { Card } from '@/ui/card'
import { Box } from '@/ui/box'

type TForm = {
    id: string;
    name: string;
}

function isProject(data: TErrorResponse | {project: TProject}): data is {project: TProject} {
    return (data as {project: TProject}).project.id !== undefined;
}

function Input(props: UseControllerProps<TForm> & {label?: string, helpText?: string, multiline?: boolean}) {
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

export function ProjectCommon({defaultValues, projectNumber}: {defaultValues: TForm, projectNumber: number}) {
    const { control, handleSubmit, formState, reset, setError } = useForm<TForm>({defaultValues});

    const router = useRouter();

    const onSubmit: SubmitHandler<TForm> = async (data) => {
        try {
            const res = await fetch('/admin/internal/api/project', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson = await res.json();
            if (!isProject(dataJson)) {
                throw new Error('Fetch error');
            }

            reset({id: dataJson.project.id, name: dataJson.project.name});
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Box padding={16}>
                    <Input control={control} name='name' label='Name' />
                    <TextField value={projectNumber} label='Project Number' disabled />
                </Box>
            </Card>

            <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
        </form>
    )
}