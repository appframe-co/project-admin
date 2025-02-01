import { useController, useForm, SubmitHandler, UseControllerProps} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TFile, TProject } from '@/types'
import { Button } from '@/ui/button'
import { TextField } from '@/ui/text-field'
import { Card } from '@/ui/card'
import { Box } from '@/ui/box'
import { FileReference } from '../fields/file-reference'

type TForm = {
    id: string;
    front: {
        title: string;
        logo: string;
    };
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

export function ProjectFront({defaultValues, files}: {defaultValues: TForm, files: TFile[]}) {
    const { control, handleSubmit, formState, reset, setError, getValues, register, setValue, watch } = useForm<TForm>({defaultValues});

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

            reset({id: dataJson.project.id, front: dataJson.project.front});
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    const field = {
        name: 'Logo',
        type: 'file',
        key: 'logo',
        description: '',
        validations: [],
        params: [],
        system: false
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Box padding={16}>
                    <Input control={control} name='front.title' label='Title' />

                    <FileReference filesRef={files.filter(f => f.id === getValues('front.logo'))} 
                    value={getValues('front.logo')} register={register('front.logo')} 
                    error={formState.errors.front?.logo} setValue={(v:any) => setValue('front.logo', v, {shouldDirty: true})} field={field} />
                </Box>
            </Card>

            <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
        </form>
    )
}