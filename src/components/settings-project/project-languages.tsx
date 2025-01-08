import { Box } from "@/ui/box";
import { Card } from "@/ui/card";
import { Select } from '@/ui/select';
import { Button } from "@/ui/button";
import { useEffect, useState } from "react";
import { SubmitHandler, UseFieldArrayReturn, useFieldArray, useForm } from "react-hook-form";
import { FormValuesEditProject, TProject, TLanguageOption } from "@/types";
import styles from '@/styles/form-project.module.css';
import { useRouter } from "next/navigation";

type TForm = {
    id: string;
    languages: {code:string, primary:boolean, name: string}[];
}

type TProps = {
    defaultValues: TForm;
    languages: TLanguageOption[];
}

function isProject(data: TErrorResponse | {project: TProject}): data is {project: TProject} {
    return (data as {project: TProject}).project.id !== undefined;
}

export function ProjectLanguages({defaultValues, languages}: TProps) {
    const { control, handleSubmit, formState, reset, setError } = useForm<TForm>({defaultValues});

    const router = useRouter();

    const languagesFieldArray = useFieldArray({
        name: 'languages',
        control
    });

    const { fields, append, remove, update } = languagesFieldArray;

    const [languagesOptions, setLanguagesOptions] = useState<TLanguageOption[]>(languages);
    const [languageCode, setLanguageCode] = useState<string>('');

    useEffect(() => {
        const codes = defaultValues.languages.map(c => c.code);
        if (codes.length) {
            setLanguagesOptions(prevState => prevState.filter(c => !codes.includes(c.value)));
        }
    }, []);

    const handleLanguage = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setLanguageCode(target.value);
    };
    const handlePrimary = (index:number, code:string) => {
        const primaryIndex = fields.findIndex(f => f.primary);
        if (primaryIndex === -1) {
            return;
        }
        update(primaryIndex, {code: fields[primaryIndex].code, primary: false, name: fields[primaryIndex].name});
        update(index, {code, primary: true, name: fields[index].name});
    };
    const handleRemoveLanguage = (index: number) => {
        const code = fields[index].code;
        const languageIndex = languages.findIndex(c => c.value === code);
        if (languageIndex === -1) {
            return;
        }

        languagesOptions.splice(languageIndex, 0, {label: languages[languageIndex].label, value: languages[languageIndex].value});
        setLanguagesOptions(languagesOptions);
        remove(index);
    };
    const handleAddLanguage = () => {
        if (!languageCode) {
            return;
        }

        const l = languages.find(l => l.value === languageCode);
        if (!l) {
            return;
        }

        append({code: languageCode, primary: false, name: l.label});
        setLanguagesOptions(prevState => prevState.filter(c => c.value !== languageCode));
        setLanguageCode('');
    };

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

            reset({id: dataJson.project.id, languages: dataJson.project.languages});
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Box padding={16}>
                    <ul className={styles.languages}>
                        {fields.map((item, index) => (
                            <li key={item.id}>
                                <div>
                                    <span>{item.name}</span>
                                    <span>{item.primary}</span>
                                </div>
                                {!item.primary && (
                                    <div className={styles.actionLanguage}>
                                        <Button onClick={() => handlePrimary(index, item.code)}>Set Primary</Button>
                                        <Button onClick={() => handleRemoveLanguage(index)}>Delete</Button>
                                    </div>
                                )}
                                {item.primary && <div><span>Primary</span></div>}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <Select 
                            onChange={handleLanguage}
                            options={[{value: '', label: 'Select an option'}, ...languagesOptions]}
                        />

                        <Button onClick={() => handleAddLanguage()}>Add language</Button>
                    </div>
                </Box>
            </Card>

            <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
        </form>
    )
}